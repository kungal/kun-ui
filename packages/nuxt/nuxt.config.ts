import { defineNuxtModule, addComponent, addImports } from '@nuxt/kit'
import { KUN_COMPONENT_NAMES } from '@kungal/ui-vue'

// The components live in the framework-agnostic-friendly @kungal/ui-vue
// package (already compiled). Rather than re-authoring SFCs in this layer,
// register each named export as a Nuxt auto-import so downstream templates
// can use `<KunButton>` etc. with no import — and Nuxt generates the
// component types, so the tags stay type-checked in consumer templates.
//
// The list is NOT duplicated here: it's the `KUN_COMPONENT_NAMES` single source
// from @kungal/ui-vue (the same one the library types its global registry
// against), so a new component is auto-registered for Nuxt with zero changes
// in this layer — and the two lists can never drift out of sync.

// Composables auto-imported for DX parity with the original Nuxt-native lib
// (so `useKunMessage(...)` etc. work with no import in any component).
const KUN_COMPOSABLES = [
  'useKunMessage',
  'useKunMessageState',
  'useKunUIConfig',
  'provideKunUIConfig',
  'useResolvedRounded',
  'useRipple',
  'useKunUniqueId',
  'useKunCopy',
  'useSpoilerContent',
  'useContentLightbox',
  'useFilePicker',
  'useKunAlert',
  'useKunLoliInfo',
  'getRandomSticker',
  'getRandomLoli',
  'decodeIfEncoded',
]

export default defineNuxtConfig({
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    defineNuxtModule({
      meta: { name: 'kun-ui-components' },
      setup() {
        for (const name of KUN_COMPONENT_NAMES) {
          addComponent({ name, export: name, filePath: '@kungal/ui-vue' })
        }
        for (const name of KUN_COMPOSABLES) {
          addImports({ name, as: name, from: '@kungal/ui-vue' })
        }
      },
    }),
  ],

  // Default provider stays IPX (the @nuxt/image default). The `none`
  // provider is registered here at the layer level so any KunImage call
  // site downstream can opt out via `provider="none"` for pre-optimized
  // static assets, without each consuming app re-declaring it.
  image: {
    providers: {
      none: { name: 'none', provider: '@nuxt/image/runtime/providers/none' },
    },
  },
})

// NOTE on styling: this layer intentionally does NOT own a Tailwind entry.
// The consuming app owns one stylesheet that imports Tailwind + @kungal/ui-tokens
// and declares the @source scan for the KunUI class sites (the scan path is
// node_modules-layout-specific, so only the app can write it correctly).
// See this package's README.
