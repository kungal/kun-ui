---
"@kungal/ui-vue": minor
---

Button/input sizing polish, a beautified checkbox, and a uniform corner radius.

- **KunButton / KunInput sizes**: horizontal padding now grows with size while
  vertical padding stays tight (`py < px`), so larger sizes get *wider*, not
  fatter — matching modern libraries (shadcn `lg = px-8`, HeroUI fixed heights).
  `md` is unchanged; `lg`/`xl` are noticeably less bulky. Input vertical padding
  matches Button per size so the two line up in a form row.
- **KunCheckBox**: the check is smaller (more breathing room in the box),
  stays centered, and scales in with a subtle pop. Cursor is now a pointer.
- **Uniform corner radius**: every component now defers to the single global
  `config.rounded` (default `md`). Removed the per-component radius overrides on
  KunModal / KunDrawer / KunInfo / KunPopover / KunUpload (were `lg`) and
  KunRadioGroup, so all surfaces share one radius — set `config.rounded` once to
  restyle them together. (Pill/circle controls that use `rounded-full` are
  unaffected, by design.)
