---
'@kungal/ui-vue': minor
---

`KunBanner` takes `size="sm"`: a 32px strip with `text-xs`, tighter padding, a 14px icon and a 24px close button, against the default `md`'s 40px and `text-sm`. It is meant for a notice that stays up for the whole visit, such as a content-mode reminder with `:closable="false"`, where one sentence wrapped to three lines on a phone. Measured on a 375px-wide strip, the moyu notice is 72px tall on 2.49.1 and 40px with `size="sm"`. Put a `size="xs"` button in `#actions` so it fits the strip.

On a phone, a banner without a close button no longer keeps an empty close column. That column's gap took 12px of text width, so the same moyu notice at the default size now wraps to two lines (52px) instead of three. The column still exists from the `sm` breakpoint up, where it balances the centred message. Nothing else changes for `md`.
