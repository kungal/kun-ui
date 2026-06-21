---
"@kungal/ui-vue": minor
---

feat(vue): KunCard `padding` prop + roomier default; bump KunInfo padding

KunCard's inner padding was `p-3` (12px) — tighter than the modern norm (shadcn /
Ant use 24px, MUI 16px) and tighter than KunModal's own 24px, which made
card-heavy UIs feel cramped.

- New `padding` prop on KunCard: `none` | `sm` (12px) | `md` (20px) | `lg` (24px),
  **default `lg`**. Inner section `gap` also grows 12px → 16px. Pass `sm` for the
  old compact density, `none` for a full-bleed card (e.g. just a cover image).
- KunInfo padding 12px → 16px to match.

Visual change: cards/info are roomier by default. Set `padding="sm"` to keep the
previous density.
