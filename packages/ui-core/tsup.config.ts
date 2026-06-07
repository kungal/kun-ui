import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  // clsx / tailwind-merge stay external — they are runtime deps, not bundled.
  external: ['clsx', 'tailwind-merge'],
})
