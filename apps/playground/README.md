# @kun/ui-playground

Local dev sandbox for **eyeballing KunUI components** while building them —
every Button variant × color, sizes, states, Cards, Icons, plus a dark-mode
toggle and a token palette strip. Not published.

```bash
pnpm --filter @kun/ui-playground dev      # start the dev server
pnpm --filter @kun/ui-playground build    # production build (verifies wiring)
```

It demonstrates the exact host-side wiring any KunUI consumer needs
(`src/style.css`):

```css
@import 'tailwindcss';
@import '@kun/tokens';
@source '../../../packages/core/src';  /* variant matrix + maps */
@source '../../../packages/vue/src';   /* component classes */
```

plus `import '@kun/ui-vue/style.css'` in `main.ts` for component scoped
styles, and toggling `.kun-dark-mode` on `<html>` for dark mode.

> When porting a new component in P1, drop it into a section here to verify
> it visually before moving on.
