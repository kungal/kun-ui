---
'@kungal/ui-vue': minor
---

**KunDropdown: the trigger no longer nests a button inside a button.** Until now the `#trigger` slot was always wrapped in a focusable `<div role="button">`, so the usual `<KunButton>` trigger, which is how every docs example writes it, became a button inside a button. That meant two Tab stops, invalid HTML, and a screen reader announcing the outer element. Now, when the slot's single root is a `KunButton`, a `<button>` or an `<a>`, that element *is* the menu button. It receives `aria-haspopup`, `aria-expanded`, `aria-controls`, the click and arrow/Enter/Space handlers, `triggerClass`, and `disabled`, and no wrapper is rendered. Other content (text, an avatar, an icon) keeps the wrapper exactly as before. The decision is made at render time from the slot's vnodes, so the server HTML is already correct.

For your own button component, pass the new `as-child` prop: the slot's root receives the trigger attributes and `ref`, so the component must forward attrs to one focusable root element. `:as-child="false"` forces the old wrapper. In development, a wrapper that ends up containing a focusable element logs a warning that points at `as-child`.

What it costs you: nothing in the common case, because existing `<KunButton>` triggers convert automatically. If you styled or queried the wrapper `div[role=button]` around a KunButton trigger, that element is gone; `triggerClass` now lands on the button itself.

**KunSwitch: new `ariaLabel` prop, and the switch can be clicked by role.** A switch with no visible `label`, typically in a table row whose column header names it, previously had no accessible name, and a fallthrough `aria-label` landed on the outer `<div>`. `ariaLabel` now names the input itself. A visible `label` still wins and was already associated, because the `<label>` wraps the input. The hidden input also moved from `sr-only` to an invisible layer over the track. An `sr-only` input sat under the track, so `getByRole('switch').click()` / `.check()` in Playwright timed out on its hit-target check. Clicking the label text and the track behaves exactly as before.
