---
"@kungal/ui-vue": minor
---

feat(vue): KunImage / KunImageNative emit `load` and `error`

Both components now declare `load` and `error` as real events, with the
signature `(src: string, event?: Event)`.

`src` is the payload rather than only the DOM event because `fallbackSrc` makes
a single `KunImage` perform two attempts — a listener needs to tell "the
original failed (and a fallback is coming)" from "the fallback failed too".
Both attempts are reported. `event` is the native DOM event where one exists;
it is `undefined` when the outcome was determined by re-reading an image that
was already complete in cache, which fires no DOM event.

This closes a gap where `@error` could not be used to drop an image's whole
container on failure — `fallbackSrc` only swaps the source, leaving the
aspect-ratio box in place.

Note for existing users:

- On `KunImage`, `@error` previously reached the parent ONLY when `skeleton`
  was `false` and no `thumbhash` was set. In every other configuration the
  component's root is the wrapper `<div>`, and since `error` does not bubble
  from the inner `<img>`, the listener silently never fired. It now fires in
  all configurations.
- Where `@error` / `@load` did fire before, they arrived by attribute
  fallthrough and were passed the raw `Event` as the first argument. The first
  argument is now `src`, with the event second. Handlers written as
  `@error="e => ..."` need updating.
