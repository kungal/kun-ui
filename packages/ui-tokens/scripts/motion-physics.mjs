// ─────────────────────────────────────────────────────────────────────────────
// The KunShatter ballistic model — physics parameters as motion tokens.
//
// This is the shared source of truth one level ABOVE the sampled keyframes:
// the web component (packages/vue/src/components/Shatter.vue) bakes WAAPI
// keyframes from these constants at runtime, and gen-tokens.mjs publishes the
// same constants as `KunShatterPhysics` in the kun_ui_tokens pub package, so a
// Flutter shatter bakes the identical trajectories instead of re-tuning by eye.
//
// These numbers are not arbitrary: they are the product of by-eye tuning
// rounds with the maintainer. KunShatter's 2.4.0 defaults were rejected as
// "太快速太僵硬" (too fast, too stiff); what satisfied was a gentler launch,
// gravity as a t² *acceleration* (a linear end-offset reads as fake), and the
// duration raised 900 → 1100 ms. A change here re-tunes the house feel on
// every platform at once — which is the point. Tune HERE, never inline in a
// component, and run `pnpm gen`.
//
// The model, per shard (rng() uniform in [0,1); lengths in px):
//   reach   = spread × elementDiagonal × reachFactor
//   launch  = reach × (launchMin + rng·launchSpan)
//   vx, vy  = dirX × launch,  dirY × launch × verticalFactor
//   g       = gravity × reach × (gravityMin + rng·gravitySpan)
// over normalised time t ∈ [0,1], sampled into keyframeSteps linear segments:
//   drag(t) = 1 − (1−t)^dragExponent          (impulse decays against air drag)
//   x(t)    = vx·drag(t)
//   y(t)    = vy·drag(t) + g·t²               (gravity accelerates, ×t²)
//   rot(t)  = spin·t,  spin = (2·rng−1) × rotation
//   scale(t)= 1 − (1−scaleEnd)·t,  scaleEnd = scaleEndMin + rng·scaleEndSpan
//   opacity = 1 until fadeOutStartMin + rng·fadeOutStartSpan, then linear → 0
// reassemble runs the same shards home along 1 − (1−t)^settleExponent, fading
// in over the first fadeInWindow of t. Each shard starts after
// (distanceFromImpact/maxDistance) × min(duration×staggerFraction, staggerCapMs)
// ms — the fracture propagates outward from the impact point.
// ─────────────────────────────────────────────────────────────────────────────
export const SHATTER_PHYSICS = {
  // How many linear keyframe segments each trajectory is sampled into. Enough
  // that the curve reads as continuous; few enough that N shards stay cheap.
  keyframeSteps: 16,

  // reach = spread × elementDiagonal × reachFactor — the distance scale every
  // other length-like constant multiplies.
  reachFactor: 0.5,

  // Outward launch speed, in units of reach: launchMin + rng·launchSpan.
  // A gentle push (max 0.87 × reach), not a hard snap.
  launchMin: 0.32,
  launchSpan: 0.55,

  // Vertical launch is damped: shards fly a little flatter than their radial
  // direction, and gravity then owns the vertical.
  verticalFactor: 0.8,

  // Downward acceleration, in units of reach (applied ×t²):
  // gravityMin + rng·gravitySpan, scaled by the component's `gravity` knob.
  gravityMin: 0.85,
  gravitySpan: 0.5,

  // drag(t) = 1 − (1−t)^dragExponent — how fast the launch impulse decays.
  dragExponent: 1.7,

  // Shards shrink slightly as they fly: end scale = scaleEndMin + rng·span.
  scaleEndMin: 0.8,
  scaleEndSpan: 0.16,

  // Fade starts late in the flight (fadeOutStartMin + rng·span of t), so the
  // glass is seen flying, not dissolving.
  fadeOutStartMin: 0.5,
  fadeOutStartSpan: 0.18,

  // Reassemble eases home along 1 − (1−t)^settleExponent (decelerate into
  // place) and fades in over the first fadeInWindow of t.
  settleExponent: 2,
  fadeInWindow: 0.4,

  // Stagger: shards nearest the impact let go first —
  // delay = (dist/maxDist) × min(duration×staggerFraction, staggerCapMs).
  staggerFraction: 0.22,
  staggerCapMs: 120,

  // The tuned defaults of the two feel-defining component props. They must
  // stay literal in Shatter.vue's withDefaults (the docs PropsTable reads the
  // literal), so gen-motion.mjs asserts the SFC agrees with these.
  defaultDurationMs: 1100,
  defaultRotationDeg: 140,
}
