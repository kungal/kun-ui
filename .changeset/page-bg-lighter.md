---
"@kungal/ui-tokens": patch
---

fix(tokens): lighten the page background a touch

The light page background goes from `#eeeef1` back up to `#f2f2f5` — the previous
value made the step up to a white card feel abrupt. Cards still pop (≈13 units)
but the transition is gentler. Dark mode unchanged.
