---
'@kungal/ui-vue': minor
'@kungal/ui-tokens': minor
---

**Keyboard focus is visible again.** `@kungal/ui-tokens/base.css` removed every outline with `*:focus { outline: none }` and drew nothing in its place. Tabbing through a KunUI app therefore showed no focus on many controls: the links in KunAvatar, KunUserChip, KunLink, KunBrand and a linked KunCard, and the buttons of KunTab, KunAccordion, KunRating, KunReaction and KunCarousel, among others. In Chrome 153, 26 of the docs site's component pages had at least one such control. The base layer now draws a ring on `:focus-visible`: 2px, primary at 50%, 2px outside the element. Keyboard focus shows it; a mouse click does not.

What this changes for you if you import `base.css`:

- **Your own elements get the ring too.** Buttons, links and `tabindex` elements show it when focused from the keyboard. If an element already draws its own focus style, add `outline-none` to it, as KunUI's own controls do; that utility wins over the base layer.
- **Text fields are unchanged.** `input`, `textarea` and `[contenteditable]` keep the old reset, because they match `:focus-visible` on a click as well. KunUI's fields draw their ring on the wrapper instead.
- **Interactive elements carry the ring's colour, width and offset while unfocused**, with no outline style, so that focusing changes only the style. Without this, an element with a `transition` class animated into the ring from a black 3px outline. The side effect: a bare `outline` utility with no colour on a button or link now draws in the ring's colour. Add a colour utility if you want `currentColor` back.

Four components needed fixes of their own:

- **KunSwitch:** its focus ring never appeared. The `peer-focus-visible` classes were on an element that is not a sibling of the input, which `peer-*` requires.
- **KunRating and the remove button in KunTagInput:** both set `focus:outline-none` without drawing a ring of their own.
- **KunTabPanel:** same as above. It is a tab stop while it is the active panel.
- **KunTab:** the ring now sits inside the tab, in the tab's own text colour at 50%. Drawn outside, it was clipped by the scrolling tab strip on the underlined and pills variants. Drawn in primary, it disappeared on a selected primary solid or pills tab.
