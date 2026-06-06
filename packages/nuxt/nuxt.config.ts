import { defineNuxtModule, addComponent } from '@nuxt/kit'

// The components live in the framework-agnostic-friendly @kun/ui-vue
// package (already compiled). Rather than re-authoring SFCs in this layer,
// register each named export as a Nuxt auto-import so downstream templates
// can use `<KunButton>` etc. with no import — and Nuxt generates the
// component types, so the tags stay type-checked in consumer templates.
const KUN_COMPONENTS = ['KunButton', 'KunCard', 'KunIcon', 'KunRipple']

export default defineNuxtConfig({
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    defineNuxtModule({
      meta: { name: 'kun-ui-components' },
      setup() {
        for (const name of KUN_COMPONENTS) {
          addComponent({ name, export: name, filePath: '@kun/ui-vue' })
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
// The consuming app owns one stylesheet that imports Tailwind + @kun/tokens
// and declares the @source scan for the KunUI class sites (the scan path is
// node_modules-layout-specific, so only the app can write it correctly).
// See this package's README.
