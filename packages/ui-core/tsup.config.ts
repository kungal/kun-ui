import { defineConfig } from 'tsup'

export default defineConfig({
  // One entry per locale catalog beyond the built-in default, so a zh-CN app
  // never pays for en. @kungal/ui-vue mirrors this with its own locale/en.
  entry: ['src/index.ts', 'src/locale/en.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  // esbuild escapes non-ASCII to \uXXXX by default, which turns the zh-CN
  // catalog into 6 bytes per character and makes the release check in
  // CLAUDE.md (grep dist/index.js for the shipped strings) find nothing.
  esbuildOptions: (options) => {
    options.charset = 'utf8'
  },
  // clsx / tailwind-merge stay external — they are runtime deps, not bundled.
  external: ['clsx', 'tailwind-merge'],
})
