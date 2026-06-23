---
"@kungal/ui-tokens": patch
---

fix(tokens): lighten the secondary colour to a softer pink

`secondary`'s solid lightness goes 0.74 → 0.80 (OKLCH `0.8 0.152 341.5`) — a paler,
fresher pink. Its foreground flips to dark (white is illegible on the lighter fill);
the generator re-derives it by measured contrast and still asserts WCAG AA on every
solid pair in both light and dark.
