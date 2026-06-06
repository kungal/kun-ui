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
      // Externalize the framework + every runtime dependency (incl. their
      // subpath imports like @vueuse/integrations/useFocusTrap) so they are
      // not inlined — consumers dedupe them via node_modules.
      external: (id) =>
        id === 'vue' ||
        id === '@kungal/core' ||
        id === 'focus-trap' ||
        id === 'date-fns' ||
        id === 'vue-advanced-cropper' ||
        id.startsWith('@vueuse/') ||
        id.startsWith('@floating-ui/') ||
        id.startsWith('date-fns/') ||
        id.startsWith('vue-advanced-cropper/'),
    },
  },
})
