---
"@kungal/ui-tokens": minor
"@kungal/ui-vue": minor
---

feat(tokens,vue): unified neutral border token (`--color-kun-border` / `border-kun`)

Every structural hairline (inputs, textareas, selects, autocomplete, date picker,
cards, dividers, tabs, tooltips, popovers, dropdowns, context menus, drawers,
pagination, slider tooltip, radio cards, tag input) now resolves to ONE semantic
token instead of a scatter of `border-default-200` / `border-default/20` /
`dark:border-default-200` + a per-component `darkBorder` toggle.

- **New:** `--color-kun-border` (defaults to the `default-200` step, so it flips
  light↔dark automatically) and a `border-kun` utility. Retheme every border at
  once by overriding `--color-kun-border` (set it under `.kun-dark-mode` too for a
  fixed non-flipping value). The global `*` border-color (opinionated base layer)
  now points at this token as well, so a bare `border` matches `border-kun`.
- **Fixed:** `KunDivider` (and any control that used the translucent
  `border-default/20` without a dark override) was ~half as bright as other
  hairlines in dark mode (L13% vs L26%); it now matches everything else (L26%).
- **Consistency:** light mode is visually unchanged (the old `default/20`-over-white
  already ≈ `default-200`); dark mode now collapses to a single neutral border value
  across all components.
- Interactive-control borders intentionally stay one step stronger (checkbox/radio
  boxes `default-300`, slider thumb) per common design-system practice — they are
  not structural hairlines.
- **Deprecated (no-op):** the `darkBorder` prop on Input/Textarea/NumberInput/
  Select/Autocomplete/DatePicker/Card. Safe to remove from call sites; kept for
  backward compatibility. Note: an un-bordered `KunCard` that relied on
  `darkBorder` to show a dark-only border should now use `bordered`.
