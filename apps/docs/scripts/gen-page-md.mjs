// Generate a clean Markdown file for every docs route, served at `<route>.md`
// (e.g. /components/button.md). The "Copy page" control and AI tools fetch
// these. Built from the SAME single source the pages render from — site.config
// pageMeta (title/cn/description) + the example .vue sources + the committed
// component metadata — so the Markdown can't drift from the page.
//
//   pnpm gen        (from the repo root — runs every generator in order; this
//                    one reads component-meta.json, so gen:meta must go first)
//
// Re-run when pageMeta, examples, or component-meta change. You don't have to
// remember: the `check` workflow regenerates everything on each PR and fails if
// the committed output differs.

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createJiti } from 'jiti'

const here = dirname(fileURLToPath(import.meta.url))
const appDir = join(here, '..', 'app')
const publicDir = join(here, '..', 'public')

const jiti = createJiti(import.meta.url)
const { pageMeta, site } = await jiti.import(join(appDir, 'site.config.ts'))
const meta = JSON.parse(
  readFileSync(join(appDir, 'generated', 'component-meta.json'), 'utf8')
)

// Escape pipes so a union type / default never breaks a Markdown table cell.
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|')
const pageTitle = (m) => (m.cn ? `${m.title} (${m.cn})` : m.title)

// Exact example order from the page file's imports; fall back to the dir
// (Basic first) if the page can't be read.
function exampleNames(slug) {
  const pageFile = join(appDir, 'pages', 'components', `${slug}.vue`)
  if (existsSync(pageFile)) {
    const src = readFileSync(pageFile, 'utf8')
    const re = new RegExp(`~/examples/${slug}/(\\w+)\\.vue'`, 'g')
    const order = []
    for (const match of src.matchAll(re)) {
      if (!order.includes(match[1])) order.push(match[1])
    }
    if (order.length) return order
  }
  const dir = join(appDir, 'examples', slug)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.vue'))
    .map((f) => f.replace(/\.vue$/, ''))
    .sort((a, b) => (a === 'Basic' ? -1 : b === 'Basic' ? 1 : a.localeCompare(b)))
}

function examplesSection(slug) {
  const blocks = exampleNames(slug)
    .map((name) => {
      const file = join(appDir, 'examples', slug, `${name}.vue`)
      if (!existsSync(file)) return ''
      return `### ${name}.vue\n\n\`\`\`vue\n${readFileSync(file, 'utf8').trimEnd()}\n\`\`\``
    })
    .filter(Boolean)
  return blocks.length ? `## 示例\n\n${blocks.join('\n\n')}` : ''
}

function propsSection(title) {
  const comp = meta[`Kun${title}`]
  if (!comp?.props?.length) return ''
  // PropsTable.vue renders a 说明 column from the same JSDoc, so carry it here
  // too — an agent reading the .md should see what a human reading the page
  // sees. Only where it says something, though: prop descriptions are still
  // sparse, and an all-empty fourth column is pure noise in a file whose whole
  // job is to be read into a context window.
  const described = comp.props.some((p) => p.description)
  const rows = comp.props.map((p) => {
    const def =
      p.default == null || p.default === '' ? '—' : `\`${esc(p.default)}\``
    const cells = [
      `\`${esc(p.name)}\`${p.required ? ' *' : ''}`,
      `\`${esc(p.type)}\``,
      def,
    ]
    if (described) cells.push(esc(p.description ?? ''))
    return `| ${cells.join(' | ')} |`
  })
  const head = described ? '属性 | 类型 | 默认值 | 说明' : '属性 | 类型 | 默认值'
  const sep = described ? '--- | --- | --- | ---' : '--- | --- | ---'
  return `## Props\n\n| ${head} |\n| ${sep} |\n${rows.join('\n')}`
}

function buildMarkdown(route, m) {
  const url = `${site.url}${route}`
  const parts = [`# ${pageTitle(m)}`, '']
  if (m.description) parts.push(`> ${m.description}`, '')

  if (route.startsWith('/components/')) {
    const slug = route.slice('/components/'.length)
    const ex = examplesSection(slug)
    const pr = propsSection(m.title)
    if (ex) parts.push(ex, '')
    if (pr) parts.push(pr, '')
    if (!ex && !pr) parts.push(`完整组件参考见 ${site.url}/llms-full.txt`, '')
  } else {
    parts.push(`完整集成指南与组件参考见 ${site.url}/llms-full.txt`, '')
  }

  parts.push('---', `本页来源 · ${site.name} · ${url}`)
  return parts.join('\n') + '\n'
}

let count = 0
for (const [route, m] of Object.entries(pageMeta)) {
  // "/" → public/index.md ; "/components/button" → public/components/button.md
  const rel = route === '/' ? 'index.md' : `${route.replace(/^\//, '')}.md`
  const out = join(publicDir, rel)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, buildMarkdown(route, m))
  count++
}
console.log(`Generated ${count} page Markdown files into apps/docs/public/`)
