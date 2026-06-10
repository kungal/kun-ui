---
"@kungal/ui-tokens": patch
---

Add a runtime `--kun-radius-scale` knob for corner radius.

The scalable radius tokens (`sm` / `md` / `lg`) now multiply their base by
`var(--kun-radius-scale, 1)`, so a consumer can drive **every** KunUI corner at
once from a single CSS variable — live, with no re-render and no config change:

```css
:root { --kun-radius-scale: 0 }    /* square corners everywhere */
:root { --kun-radius-scale: 1.5 }  /* 50% rounder everywhere   */
```

The default (`1`) leaves everything unchanged. `none` and `full` deliberately
don't scale (a square stays square; a pill stays a pill). Because
`--kun-radius-scale` is a separate, consumer-owned variable that the token
`calc()` reads, it avoids the cascade-order trap of trying to override
`--radius-kun-*` directly. (Small controls clamp `border-radius` to ~half their
height, so a button can't get rounder than a pill — by design.)
