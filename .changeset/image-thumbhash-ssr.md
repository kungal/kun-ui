---
"@kungal/ui-vue": patch
---

fix(vue): KunImage renders the ThumbHash blur during SSR

The blur-up placeholder was decoded in `onMounted`, so it could not exist in
server-rendered markup: SSR painted the grey pulse skeleton, and the blur only
appeared after hydration — precisely when it was no longer needed. The point of
shipping a ThumbHash is a meaningful placeholder in the *first* paint, at zero
extra requests, and that was being missed on every SSR page.

The decode is now a `computed`, evaluated during render on both server and
client.

The client-only gate rested on a code comment claiming the decode needs a
canvas. It does not: thumbhash's `rgbaToDataURL` hand-assembles the PNG bytes
and needs only `atob`/`btoa`, so it runs unchanged under Node and produces
byte-identical output on both sides — verified in a real Nuxt SSR build, with no
hydration mismatch.
