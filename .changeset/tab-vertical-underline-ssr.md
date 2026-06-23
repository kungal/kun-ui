---
"@kungal/ui-vue": patch
---

fix(vue): vertical underlined Tab indicator jumping on hydration (SSR)

The pre-hydration fallback bar (drawn before the JS-measured indicator mounts) was
hardcoded to the BOTTOM edge, so a vertical `underlined` tab showed its indicator
under the active tab on the server and then jumped to the LEFT once the measured
indicator took over. The fallback now follows orientation — a LEFT inset bar for
vertical, BOTTOM for horizontal — so the SSR axis matches the final one and there's
no jump.
