---
"@kungal/ui-core": minor
"@kungal/ui-vue": minor
---

Unify form-control sizing on one shared scale, and fix the `lg`/`xl` button
proportions.

- **New `kunControlSizeClasses` (@kungal/ui-core)** — a single source of truth for
  the per-size font + padding of every text-like form control. Padding-driven,
  `md` (~38px) as the anchor, `px:py` a clean 2:1, horizontal padding growing
  faster than vertical so a bigger control gets wider, not flatter.
- **KunButton `lg`/`xl` fixed** — `lg` was `px-6 py-2` (3:1) and `xl` was
  `px-8 py-2.5` (3.2:1, a wide flat bar). They're now `px-5 py-2.5` and
  `px-6 py-3` (both 2:1), so large buttons look proportional. `md` is unchanged.
- **One scale across controls** — KunButton, KunInput, KunSelect, KunDatePicker,
  KunTextarea and KunTagInput all consume the shared scale, so a button, input,
  select and date-picker of the same size line up at the same height in a row
  (md = 38px).
- **KunSelect / KunDatePicker / KunTextarea gain a `size` prop** (`xs`–`xl`,
  default `md`). Previously they had no size and were locked one notch tighter
  than buttons (`px-3` / `p-3`); their default horizontal padding is now `px-4`,
  matching KunButton/KunInput `md`.

Pill/compact display components (KunChip, KunBadge, KunAvatar) are intentionally
not part of this form-control scale and keep their compact sizing.
