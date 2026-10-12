---
'@kungal/ui-vue': minor
---

KunSkeleton's `text` placeholder now takes a full line box, and every skeleton on a page pulses in step.

- **A `text` placeholder is one line tall.** Without an explicit `height`, it is now `1lh` tall (the line box of the font it inherits), with the same `1em` bar centred in it, the way a line of text sits in its box. At `1em`, the content below jumped by the leading when the real words arrived. KunUI's own HoverCard lazy-content demo grew 8px on arrival; it now grows 0px. MUI, Radix Themes and Primer reserve the line box the same way. Engines without `lh` (Safari before 16.4) keep the old `1em` bar.
- **What it costs you.** Each default-height text placeholder grows by its leading, for example from 16px to 24px at `text-base`, so a stack of them is taller than before. Two adjustments make it match your content again:
  - Give the placeholder the text classes of the content it stands in for, because the line box follows the font: use `class-name="text-sm"` for a `text-sm` line.
  - Remove any gap you added between the lines of one paragraph to fake the leading.

  A `text` placeholder with an explicit `height` is unchanged.
- **Pulses stay in step.** A CSS animation starts when its element is inserted, so placeholders mounted at different moments pulsed out of phase. On mount, each placeholder now pins its pulse to the document timeline, so all skeletons on the page pulse together, as Fluent 2's skeleton guidance asks. The pulse still animates only opacity on the compositor and is still off under `prefers-reduced-motion`.
- **Announcing a load.** The placeholder stays `aria-hidden`. The docs now show how to announce a load once instead of once per skeleton: put `aria-live="polite"` on the loading region, and `aria-busy="true"` on it while it loads.
