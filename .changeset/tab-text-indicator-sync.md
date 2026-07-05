---
'@kungal/ui-vue': patch
---

fix(vue): KunTab active-tab text color now tracks the sliding indicator

The per-tab text color transitioned over Tailwind's default 150ms while the
sliding indicator slid over 250ms (`--kun-dur-base`), so the newly-active tab's
text reached its final color ~100ms before the pill arrived under it. With
`solid`/`pills` that meant the text went white over the still-uncovered light
background and read as "invisible until the animation finished". The tab text
transition is now pinned to the indicator's duration and easing
(`duration-kun-base ease-kun-standard`), so color and position land in lockstep.
