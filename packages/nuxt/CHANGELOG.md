# @kungal/ui-nuxt

## 0.6.2

### Patch Changes

- Updated dependencies [7b521fc]
  - @kungal/ui-vue@0.6.2
  - @kungal/ui-tokens@0.6.2

## 0.6.1

### Patch Changes

- Updated dependencies [dc437bb]
  - @kungal/ui-vue@0.6.1
  - @kungal/ui-tokens@0.6.1

## 0.6.0

### Minor Changes

- c15c5fc: Remove the `KunFavicon` component.

  `KunFavicon` was just a static, hardcoded inline SVG of the KunUI lollipop mark
  with no props — it carried no library value (an app that wants a logo ships its
  own asset, e.g. via `KunBrand`'s `iconSrc`). It's dropped from the `@kungal/ui-vue`
  exports and the `@kungal/ui-nuxt` auto-import list.

  **Migration:** if you were rendering `<KunFavicon />`, inline your own logo SVG or
  `<img>`/`KunImage` pointing at your favicon asset instead.

### Patch Changes

- Updated dependencies [c15c5fc]
  - @kungal/ui-vue@0.6.0
  - @kungal/ui-tokens@0.6.0

## 0.5.2

### Patch Changes

- Updated dependencies [8b39e7c]
  - @kungal/ui-vue@0.5.2
  - @kungal/ui-tokens@0.5.2

## 0.5.1

### Patch Changes

- Updated dependencies [bef6580]
  - @kungal/ui-tokens@0.5.1
  - @kungal/ui-vue@0.5.1

## 0.5.0

### Patch Changes

- Updated dependencies [b669cf4]
  - @kungal/ui-vue@0.5.0
  - @kungal/ui-tokens@0.5.0

## 0.4.1

### Patch Changes

- Updated dependencies [93b8446]
  - @kungal/ui-vue@0.4.1
  - @kungal/ui-tokens@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies [cb46d7b]
  - @kungal/ui-vue@0.4.0
  - @kungal/ui-tokens@0.4.0

## 0.3.4

### Patch Changes

- Updated dependencies [3a50b6a]
  - @kungal/ui-vue@0.3.4
  - @kungal/ui-tokens@0.3.4

## 0.3.3

### Patch Changes

- Updated dependencies [9e0bdc2]
  - @kungal/ui-vue@0.3.3
  - @kungal/ui-tokens@0.3.3

## 0.3.2

### Patch Changes

- Updated dependencies [2bd491f]
  - @kungal/ui-vue@0.3.2
  - @kungal/ui-tokens@0.3.2

## 0.3.1

### Patch Changes

- Updated dependencies [24de30a]
  - @kungal/ui-tokens@0.3.1
  - @kungal/ui-vue@0.3.1

## 0.3.0

### Patch Changes

- Updated dependencies [9b8cbae]
  - @kungal/ui-vue@0.3.0
  - @kungal/ui-tokens@0.3.0

## 0.2.5

### Patch Changes

- Updated dependencies [f0bbd79]
  - @kungal/ui-vue@0.2.5
  - @kungal/ui-tokens@0.2.5

## 0.2.4

### Patch Changes

- Updated dependencies [0ec98f9]
  - @kungal/ui-vue@0.2.4
  - @kungal/ui-tokens@0.2.4

## 0.2.3

### Patch Changes

- Updated dependencies [f0bc0fc]
  - @kungal/ui-vue@0.2.3
  - @kungal/ui-tokens@0.2.3

## 0.2.2

### Patch Changes

- Updated dependencies [d32b6e5]
  - @kungal/ui-vue@0.2.2
  - @kungal/ui-tokens@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [f48f420]
  - @kungal/ui-vue@0.2.1
  - @kungal/ui-tokens@0.2.1

## 0.2.0

### Minor Changes

- 35358f2: Settle on the `@kungal/ui-*` package namespace; the four packages are versioned and released together.

### Patch Changes

- Updated dependencies [e3cf45d]
- Updated dependencies [d5ffbb6]
- Updated dependencies [35358f2]
  - @kungal/ui-vue@0.2.0
  - @kungal/ui-tokens@0.2.0

## 0.1.1

### Patch Changes

- c532a02: Add npm `keywords` to every package for better discoverability on the npm registry.
- Updated dependencies [c532a02]
  - @kungal/ui-tokens@0.1.1
  - @kungal/ui-vue@0.1.1
