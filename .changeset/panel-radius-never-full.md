---
'@kungal/ui-core': minor
'@kungal/ui-vue': minor
---

`rounded="full"` no longer paints 9999px onto a floating panel: the popups of KunSelect / KunAutocomplete / KunDatePicker fall back to `lg`

> From this release the changelog is written in English.

**The bug**

All three are trigger + panel components, and all three applied the same `roundedClass` to both. On the trigger — a single-line control — `full` is a pill and is correct. On the panel it is not a pill at all: per CSS Backgrounds 3 §5.5 the browser scales every corner by `min(side / sum of that side's radii)`, so the radius actually painted is half the panel's short side.

Measured in this repo's own docs (`/components/select`, the FilterBar example, Chromium):

| panel | declared | actually painted |
| --- | --- | --- |
| 218×280 tag list | 9999px | 109px |
| 80×116 platform list | 9999px | 40px |

The 80×116 one was a lozenge with its option labels pushed into the curve. KunDatePicker's 276×324 calendar was 138px.

This was not a misconfiguration downstream. **KunUI's own example prescribed it** — `apps/docs/app/examples/select/FilterBar.vue` sets `rounded="full"` on three `KunSelect`s and overrides only `classNames.trigger`. Anyone copying the example shipped the blob.

**The change**

New `kunPanelRoundedClass(rounded)` in `@kungal/ui-core`: `full` resolves to `lg`, the other four buckets pass through unchanged. The three components' floating panels use it; their triggers are untouched.

`lg` is not an invented number — `--radius-kun-lg: 16px` is documented in `tokens.css` as “containers / floating panels”. HeroUI is built the same way: the five buckets of its select `radius` variant write **only** `trigger`, and `popoverContent` takes its radius from Popover, whose default is `lg`.

**What it costs you**

- If you set `rounded="full"`: the popup becomes a 16px rounded rectangle; the trigger stays a pill. That is the only visible change.
- If you already corrected it with `classNames.popup`: your class still wins (since 2.27.0 `cn()` understands `rounded-kun-*`). Nothing changes for you.
- The other four buckets (`none` / `sm` / `md` / `lg`) behave exactly as before.
- If you genuinely want a 9999px panel: `classNames.popup="rounded-kun-full"`. KunAutocomplete has no `classNames` at all — which is also why this had to be fixed in the library: its consumers had no local escape hatch.

**KunPopover / KunModal / KunDrawer / KunTooltip are unchanged.** They have a single surface, so `rounded` names that surface directly and `full` there is an explicit request. What was fixed here is one prop quietly governing two surfaces, one of which has no correct value for `full`.

**Docs site**

The homepage's version badge and component counts are now read at build time from `packages/vue/package.json` and `KUN_COMPONENT_NAMES` instead of being typed by hand — they said “v0.2” and “53 个组件” while npm was at 2.28.0 with 70 components. Section 12 of `docs/INTEGRATION.md` (inlined verbatim into `llms-full.txt`) is now generated from the same list; hand-maintained, it had fallen 18 names behind, so AI tools reading `llms-full.txt` were told KunAccordion, KunCarousel, KunCommandPalette, KunSteps and friends did not exist.
