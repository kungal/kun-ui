# @kungal/ui-tokens

## 0.2.0

### Minor Changes

- 35358f2: Rename two packages onto a consistent `ui-` namespace:

  - `@kungal/core` → `@kungal/ui-core`
  - `@kungal/tokens` → `@kungal/ui-tokens`

  `@kungal/ui-vue` and `@kungal/ui-nuxt` are unchanged in name but depend on the
  renamed packages, so all four are released together.

  **Migration:** update your dependencies and every `import` / `@import` /
  `@source` that referenced the old names:

  ```diff
  - pnpm add @kungal/ui-vue @kungal/core @kungal/tokens
  + pnpm add @kungal/ui-vue @kungal/ui-core @kungal/ui-tokens
  ```

  ```diff
    @import 'tailwindcss';
  - @import '@kungal/tokens';
  + @import '@kungal/ui-tokens';
    @import '@kungal/ui-vue/style.css';
  - @source '../../node_modules/@kungal/core';
  + @source '../../node_modules/@kungal/ui-core';
  ```

  ```diff
  - import { registerKunIcons } from '@kungal/core'
  + import { registerKunIcons } from '@kungal/ui-core'
  ```

  The old `@kungal/core` / `@kungal/tokens` packages are deprecated on npm and
  will not receive further updates.

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
