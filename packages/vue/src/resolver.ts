import { KUN_COMPONENT_NAMES } from './componentNames'

// Resolver for `unplugin-vue-components` — the on-demand auto-import path every
// major Vue library ships (Element Plus, PrimeVue, Vuetify…). A Vite/Vue app:
//
//   import Components from 'unplugin-vue-components/vite'
//   import { KunUIResolver } from '@kungal/ui-vue/resolver'
//   plugins: [Components({ resolvers: [KunUIResolver()] })]
//
// …can then use `<KunButton>` / `<KunReaction>` / any KunUI component with no
// import and no global registration — tree-shaken, on demand. Because the
// resolvable set comes from the same single source the library registers from,
// a newly-added component works downstream automatically (nothing to update).

export interface KunUIResolverOptions {
  /**
   * Auto-import the bundled component styles (scoped styles + keyframes) the
   * first time any component is used. Default `true`. Set `false` if your app
   * already imports `@kungal/ui-vue/style.css` itself.
   */
  importStyle?: boolean
}

// The shape unplugin-vue-components expects from a component resolver. Declared
// locally so we don't take a dependency on unplugin-vue-components just for a type.
interface ComponentResolverObject {
  type: 'component'
  resolve: (name: string) =>
    | { name: string; from: string; sideEffects?: string }
    | undefined
}

export function KunUIResolver(
  options: KunUIResolverOptions = {}
): ComponentResolverObject {
  const names = new Set<string>(KUN_COMPONENT_NAMES)
  const importStyle = options.importStyle ?? true
  return {
    type: 'component',
    resolve(name: string) {
      if (!names.has(name)) return
      return {
        name,
        from: '@kungal/ui-vue',
        sideEffects: importStyle ? '@kungal/ui-vue/style.css' : undefined,
      }
    },
  }
}
