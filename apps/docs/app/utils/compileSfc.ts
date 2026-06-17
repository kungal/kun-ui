import type { Component } from 'vue'
// The three modules a KunUI example is ever allowed to import. They're already
// in the docs bundle, so we hand the live registry straight to the compiled
// code — no CDN, no version skew with the rest of the site.
import * as Vue from 'vue'
import * as KunVue from '@kungal/ui-vue'
import * as KunCore from '@kungal/ui-core'

// @vue/compiler-sfc is heavy (it pulls in @babel/parser). Load it lazily so it
// lands in its own client chunk — never in the main bundle, never on the server
// during `nuxt generate`. Mirrors how Code.vue lazy-imports Shiki.
type Sfc = typeof import('@vue/compiler-sfc')
let sfcPromise: Promise<Sfc> | null = null
const loadCompiler = () => (sfcPromise ??= import('@vue/compiler-sfc'))

// compileScript emits code that still contains TypeScript (`_ctx: any`, `!`
// assertions, plus any user annotations) — normally the build's esbuild pass
// strips it, but the browser can't parse it. Sucrase is a fast, pure-JS TS→JS
// transform (no type-checking) that does exactly that, in its own lazy chunk.
type Sucrase = typeof import('sucrase')
let sucrasePromise: Promise<Sucrase> | null = null
const loadSucrase = () => (sucrasePromise ??= import('sucrase'))

const MODULES: Record<string, Record<string, unknown>> = {
  vue: Vue as unknown as Record<string, unknown>,
  '@kungal/ui-vue': KunVue as unknown as Record<string, unknown>,
  '@kungal/ui-core': KunCore as unknown as Record<string, unknown>,
}

// We execute compiled SFCs as *real ES modules* via Blob URLs + dynamic import
// — no eval / new Function. Bare imports (`from 'vue'`) can't be resolved by the
// browser, so each allowed module gets a one-time "shim" Blob that re-exports
// the live module off globalThis; the compiled code's imports are rewritten to
// point at those shim URLs. Module semantics do the sandboxing for us.
let shimUrls: Record<string, string> | null = null
const GLOBAL_KEY = '__KUN_PLAYGROUND_MODULES__'
const IDENT_RE = /^[A-Za-z_$][\w$]*$/

const ensureShims = (): Record<string, string> => {
  if (shimUrls) return shimUrls
  ;(globalThis as Record<string, unknown>)[GLOBAL_KEY] = MODULES
  shimUrls = {}
  for (const spec of Object.keys(MODULES)) {
    const mod = MODULES[spec]!
    const lines = [
      `const m = globalThis[${JSON.stringify(GLOBAL_KEY)}][${JSON.stringify(spec)}];`,
    ]
    for (const key of Object.keys(mod)) {
      if (key === 'default' || !IDENT_RE.test(key)) continue
      lines.push(`export const ${key} = m[${JSON.stringify(key)}];`)
    }
    if ('default' in mod) lines.push(`export default m["default"];`)
    const blob = new Blob([lines.join('\n')], { type: 'text/javascript' })
    shimUrls[spec] = URL.createObjectURL(blob)
  }
  return shimUrls
}

export interface CompileResult {
  /** The compiled component, ready to render via `<component :is>`. */
  component: Component | null
  /** Compiled (scope-rewritten) CSS to inject, or '' when the SFC has no style. */
  css: string
  /** A human-readable compile error (Chinese-friendly), or null on success. */
  error: string | null
}

// Small, stable content hash → the `data-v-xxxxxx` scope id for scoped styles.
const hashId = (s: string): string => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36).padStart(6, '0')
}

// Point every `from '<allowed module>'` at its shim Blob URL. Anything else is
// rejected — a Playground example only ever imports the three KunUI modules.
const rewriteImports = (code: string, shims: Record<string, string>): string =>
  code.replace(
    /(\bfrom\s*)(['"])([^'"]+)\2/g,
    (_m, lead: string, _q, spec: string) => {
      if (!(spec in shims)) {
        throw new Error(
          `Playground 只能导入 vue、@kungal/ui-vue、@kungal/ui-core,无法解析模块:${spec}`
        )
      }
      return `${lead}${JSON.stringify(shims[spec])}`
    }
  )

// Build a real ES module from compiler output and import it. The Blob URL is
// revoked once the module has loaded (its exports are already captured).
const importModule = async (code: string, shims: Record<string, string>) => {
  const url = URL.createObjectURL(
    new Blob([rewriteImports(code, shims)], { type: 'text/javascript' })
  )
  try {
    return await import(/* @vite-ignore */ url)
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Compile a single-file component **in the browser** and return a live component
 * plus its scoped CSS. The compiled code runs as a module in the user's own
 * session (a playground is self-authored code), so this is self-XSS scope only —
 * do not feed it untrusted, third-party source.
 */
export const compileSfc = async (source: string): Promise<CompileResult> => {
  let sfc: Sfc
  let sucrase: Sucrase
  try {
    ;[sfc, sucrase] = await Promise.all([loadCompiler(), loadSucrase()])
  } catch {
    return { component: null, css: '', error: '编译器加载失败,请检查网络后重试。' }
  }
  const stripTypes = (code: string) =>
    sucrase.transform(code, { transforms: ['typescript'] }).code

  try {
    const filename = 'Playground.vue'
    const { descriptor, errors } = sfc.parse(source, { filename })
    if (errors.length) {
      return {
        component: null,
        css: '',
        error: errors.map((e) => e.message).join('\n'),
      }
    }
    if (!descriptor.template && !descriptor.script && !descriptor.scriptSetup) {
      return { component: null, css: '', error: '空组件:至少需要一个 <template>。' }
    }

    const shims = ensureShims()
    const id = hashId(source)
    const scopeId = `data-v-${id}`
    const hasScoped = descriptor.styles.some((s) => s.scoped)

    let component: Component
    if (descriptor.script || descriptor.scriptSetup) {
      // compileScript inlines the template into the render fn and, when there
      // are scoped styles, attaches `__scopeId = "data-v-…"` to the default
      // export itself — so `mod.default` is the finished component.
      const compiled = sfc.compileScript(descriptor, {
        id,
        inlineTemplate: true,
        templateOptions: {
          compilerOptions: { scopeId: hasScoped ? scopeId : null },
        },
      })
      const mod = await importModule(stripTypes(compiled.content), shims)
      component = mod.default as Component
    } else {
      // Template-only SFC: compile just the render function.
      const { code } = sfc.compileTemplate({
        source: descriptor.template!.content,
        filename,
        id: scopeId,
        scoped: hasScoped,
        compilerOptions: { scopeId: hasScoped ? scopeId : null },
      })
      const mod = await importModule(code, shims)
      component = { render: mod.render } as Component
      if (hasScoped) (component as { __scopeId?: string }).__scopeId = scopeId
    }

    const css = descriptor.styles
      .map(
        (s) =>
          sfc.compileStyle({
            source: s.content,
            filename,
            id: scopeId,
            scoped: s.scoped,
          }).code
      )
      .join('\n')

    return { component, css, error: null }
  } catch (e) {
    return {
      component: null,
      css: '',
      error: e instanceof Error ? e.message : String(e),
    }
  }
}
