---
"@kungal/ui-vue": patch
---

Bundle the KunLoli mascots, fix Tab icon spacing, enlarge the Null/Loading
images, and align KunTagInput's tag color.

- **KunLoli**: the popup pulled its mascot from `/alert/{name}.webp` in the
  consuming app's public dir, so it showed a broken image in any app that didn't
  ship those four files. The four mascots are now bundled as base64 webp data
  URIs (same zero-setup, no-network policy as the bundled icons and the
  KunLoading / KunNull images), so `<KunLoli>` works out of the box.
- **KunTab**: tabs with both an icon and a label had no gap between them (the
  size→gap map was defined but never applied), so the two were cramped together.
  The gap (`gap-1` / `gap-1.5` / `gap-2` by size) is now applied.
- **KunNull / KunLoading**: the default mascot image is one size larger
  (`w-60`→`w-72` and `w-72`→`w-80` respectively).
- **KunTagInput**: tags used a one-off color palette (`bg-primary/15
  text-primary-700`) that read slightly off from the rest of the UI; they now use
  the same `flat` variant every other KunUI chip uses, so a tag's color matches.
