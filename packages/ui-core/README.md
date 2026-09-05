# @kungal/ui-core

The **framework-agnostic foundation** every KunUI render layer is built
on. Pure TypeScript — no Vue, no React, no DOM coupling. Ships dual
ESM/CJS with type declarations.

## What's here

| Export | Purpose |
| --- | --- |
| `KunUIVariant`, `KunUIColor`, `KunUISize`, `KunUIRounded` | the design-system type vocabulary |
| `cn(...inputs)` | clsx + tailwind-merge class merge ("last class wins"), taught KunUI's own `rounded-kun-*` / `shadow-kun-*` / `z-kun-*` / `ease-kun-*` / `duration-kun-*` scales so they resolve against Tailwind's |
| `kunVariantClasses(variant, color)` | the 7×7 variant × color → Tailwind class matrix |
| `kunBgClasses` / `kunTextClasses` / `kunBorderClasses` / `kunRingClasses` / `kunSoftBgClasses` | per-color static class maps |
| `kunRoundedClasses` | radius bucket → `rounded-kun-*` class map |
| `resolveRounded(prop, fallback, configDefault)` | pure precedence resolver (prop > built-in > provider) |
| `KUN_DEFAULT_ROUNDED` | global radius default (`'md'`) |
| `getKunIcon` / `hasKunIcon` / `registerKunIcon(s)` / `KunIconData` | bundled icon registry (inline SVG, no runtime fetch) seeded with KunUI's own icons; consumers register more |
| `randomNum`, `decodeIfEncoded` | small pure helpers |

> Icon data is generated from `@iconify-json/*` (devDependencies) into
> `src/icons-data.ts` by `scripts/gen-icons.mjs` — run `pnpm gen:icons` after
> adding a name. The generated literal ships; the `@iconify-json` packages do
> not.

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
pnpm --filter @kungal/ui-core build      # tsup → dist (esm + cjs + d.ts)
pnpm --filter @kungal/ui-core typecheck
```
