---
"@kungal/ui-core": patch
---

fix(core): `shadow` button variant now actually casts its colored glow

The `shadow` variant set a shadow *color* (`shadow-{color}/40`) but never a shadow
*size*, so `--tw-shadow` stayed empty and the button rendered with `box-shadow:
none` — it looked identical to `solid`. Added `shadow-lg` to every entry so the
geometry exists and the tint applies: each shadow button now floats with a soft
diffuse glow in its own color (the button's `overflow-hidden` doesn't clip an
outset box-shadow, so it shows in both themes).
