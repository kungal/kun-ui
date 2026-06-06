import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Library build: compile the .vue components to JS up front so any
// consumer's bundler can use them without needing to transpile .vue files
// inside node_modules (Vite does NOT process .vue in deps by default).
// Types are emitted separately by vue-tsc (see the build script).
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      // Keep the framework + shared packages external — they are peer/
      // runtime deps the consumer already has, not things to inline.
      external: ['vue', '@kun/core', '@iconify/vue'],
    },
  },
})
