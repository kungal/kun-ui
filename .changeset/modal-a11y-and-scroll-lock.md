---
'@kungal/ui-vue': minor
---

fix(vue): KunModal/KunDrawer get real ARIA names, a tab-order-clean backdrop, and a scroll lock that holds on iOS

A pass over the dialog primitives against what Radix, Reka (Nuxt UI), react-aria
(HeroUI v3), Base UI and Zag (Chakra v3) actually ship. The architecture already
matched them — portal + `div[role=dialog]` + focus trap + `inert` + refcounted
scroll lock, deliberately NOT a native `<dialog>`, whose top layer would leave
every KunUI popover teleported to `<body>` painted above the modal but inert.
These are the details that didn't.

**KunModal gains `title` and `description`.** `title` renders the panel's `<h2>`
and is wired to `aria-labelledby`; `description` renders under it and is wired to
`aria-describedby` (which `role="alertdialog"` is required to have). Both are
opt-in — a dialog that draws its own heading in the slot renders exactly as
before. The old hardcoded `aria-label="对话框"` fallback is gone: it announced a
meaningless Chinese string to every screen-reader user regardless of the app's
language and never announced the real title. With neither `title` nor
`ariaLabel`, KunUI now warns in dev. `KunDrawer` gains `ariaLabel` and the same
warning.

**`role="alertdialog"` is no longer dismissed by a backdrop click.** A click that
lands on the dim area is not an answer to "delete this account?". Escape still
cancels — Radix and Reka both prevent outside-dismissal on their AlertDialog and
leave Escape alone. `:is-dismissable="true"` opts the backdrop back in; `false`
still turns both off.

**The backdrop is out of the tab order.** It carried `tabindex="0"` — the only
way focus-trap would activate on a dialog whose body has no tabbable node — which
made the dim area itself a tab stop that assistive tech announces. The panel now
carries `tabindex="-1"` and serves as focus-trap's `fallbackFocus` instead.

**The body scroll lock now holds on iOS**, where `overflow: hidden` never stopped
touch scrolling: the body is taken out of flow and the scroll position is stashed
and restored, the same trick body-scroll-lock and react-aria's `usePreventScroll`
use. Unlock also restores the page's own inline styles rather than blanking them.

**Scrollbar compensation actually compensates.** The gap was measured after
`overflow: hidden` had already removed the scrollbar, so it always came out 0 and
the page jumped ~15px sideways on every open. It is measured first now, and added
to the page's existing padding instead of replacing it.

**`overscroll-behavior: contain`** on the modal panel, the `outside`-scrolling
overlay and the drawer body, so a scroller inside the dialog can't chain its
leftover scroll to the page behind it.

**Every teleported overlay is tagged `data-kun-overlay`** — Tooltip, Popover,
Dropdown, Select, Autocomplete, DatePicker, ContextMenu and CommandPalette were
missing the tag that `useKunBackgroundInert` documents and uses to keep KunUI's
own layers out of the `inert` sweep.
