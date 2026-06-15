---
"@kungal/ui-vue": minor
---

**Content spoilers**: reworked the click-to-reveal spoiler effect. The covered region now renders an animated dust/particle field (spawn → drift → fade → respawn) instead of a flat frosted block, and revealing dissolves the particles out as the text appears. The markup contract is unchanged (`class="kun-spoiler kun-spoiler-hidden"` in trusted HTML).

Under the hood it's now SSR-safe by construction (the cover is pure CSS present in the server-rendered HTML — no post-mount DOM injection, no hydration flash, and the secret stays hidden with JS disabled), the particle canvas is a pure client-side enhancement driven by one shared, fps-throttled rAF loop with off-screen spoilers paused via IntersectionObserver, and spoilers are now keyboard-accessible (`role="button"`, focusable, Enter/Space to reveal, `aria-expanded`). Respects `prefers-reduced-motion`. The cover is rectangular (no rounded corners) so it lines up with the browser's text-selection highlight.
