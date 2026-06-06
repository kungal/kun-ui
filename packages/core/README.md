# @kun/core

The **framework-agnostic foundation** every KunUI render layer is built
on. Pure TypeScript — no Vue, no React, no DOM coupling. Ships dual
ESM/CJS with type declarations.

## What's here

| Export | Purpose |
| --- | --- |
| `KunUIVariant`, `KunUIColor`, `KunUISize`, `KunUIRounded` | the design-system type vocabulary |
| `cn(...inputs)` | clsx + tailwind-merge class merge ("last class wins") |
| `kunVariantClasses(variant, color)` | the 7×7 variant × color → Tailwind class matrix |
| `kunBgClasses` / `kunTextClasses` / `kunBorderClasses` / `kunRingClasses` / `kunSoftBgClasses` | per-color static class maps |
| `kunRoundedClasses` | radius bucket → `rounded-kun-*` class map |
| `resolveRounded(prop, fallback, configDefault)` | pure precedence resolver (prop > built-in > provider) |
| `KUN_DEFAULT_ROUNDED` | global radius default (`'md'`) |
| `randomNum`, `decodeIfEncoded` | small pure helpers |

## Why a separate package

The same class tables and resolution logic must produce **byte-identical
output** in the Vue layer and the React layer. Keeping them here means a
color tweak or a new variant is one edit, not one-per-framework — and
because there is zero framework code, neither framework drags the other
in.

Reactive wrappers belong in the render layers, e.g.:

```ts
// Vue
const rounded = computed(() => resolveRounded(props.rounded, 'lg', cfg.rounded))
// React
const rounded = useMemo(() => resolveRounded(rounded, 'lg', cfg.rounded), [rounded, cfg.rounded])
```

## Build

```bash
pnpm --filter @kun/core build      # tsup → dist (esm + cjs + d.ts)
pnpm --filter @kun/core typecheck
```
