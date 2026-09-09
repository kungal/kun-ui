---
'@kungal/ui-core': minor
---

Motion crosses to Flutter as physics, not keyframes (tier 2 of the Flutter roadmap).

KunShatter's ballistic model — outward impulse, air-drag decay `1 − (1−t)^1.7`, gravity as a t² acceleration, per-shard scale/fade envelopes, the outward-propagating stagger — now lives in one shared manifest (`packages/ui-tokens/scripts/motion-physics.mjs`) instead of inline literals in the component. Two artifacts are generated from it:

- `KUN_SHATTER_PHYSICS`, a new export of `@kungal/ui-core`, which `KunShatter` now consumes. Same numbers as before — the baked keyframes are unchanged, so nothing moves differently.
- `KunShatterPhysics` in the `kun_ui_tokens` pub package, documenting the full model, so a Flutter shatter samples the identical trajectories instead of re-tuning the feel by eye.

The four cubic-bezier easings and the duration scale already crossed in 2.33.0 as `KunEasing`/`KunDurations` — they need no sampling at all (`Cubic(a, b, c, d)` is the same parametrisation as CSS `cubic-bezier`). The ballistic motion is the part that cannot cross as a curve constant, and its parameters are one level above the samples: the web bakes WAAPI keyframes from them at runtime, Flutter can bake the same tables or run them through its own simulations. Sampled spline tables (`CatmullRomCurve.precompute`) were rejected — every curve in this model has a closed form, and a table would only approximate what the exponents state exactly.

Nothing to do as a consumer of the npm packages.
