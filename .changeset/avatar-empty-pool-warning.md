---
'@kungal/ui-vue': patch
---

**KunAvatar warns in dev when `avatarFallbackPool` is empty.** 2.32.0 moved the
fallback pool out of the library and into host config, correctly — a component
library must not name another service. What it did not do is say anything when
the host never supplies one. The default is `[]`, `pickAvatarFallback` reads that
as "no choice to make" and returns the single bundled `KUN_AVATAR_FALLBACK` data
URI for every seed. Nothing throws, nothing 404s, every request succeeds — and
every user without an avatar image renders the identical picture, which in a
community site is most accounts.

That is not hypothetical: the KunUI docs site itself shipped a whole release that
way, its own "sticker fallback" demo rendering Alice, Bob and Carol as three
copies of the same image, and nobody noticed until someone looked at the page.
A silent degradation with a visible symptom and no signal deserves a warning.

So `KunAvatar` now logs once per process, the first time it renders the fallback
for a user with no `avatar` while the pool is empty:

```
[KunAvatar] rendering the fallback avatar for a user with no `avatar` image, but
`avatarFallbackPool` is empty — so EVERY such user gets the same bundled image.
Configure a pool of absolute image URLs: `installKunUIConfig(app, {
avatarFallbackPool })`. See docs/INTEGRATION.md §7.1.
```

- **Dev only, and once.** Guarded by `process.env.NODE_ENV !== 'production'`, so
  your production bundler folds it away; the check survives into our `dist`
  rather than being stripped at our build. Once per process, not per instance —
  a user list mounts dozens of avatars and the message is about configuration.
- **Nothing renders differently.** Verified by SSR-rendering both cases: with no
  pool, one warning and the bundled data URI; with a two-entry pool, no warning
  and a real pick from it.
- **Deliberately not an error.** If you want one uniform default avatar, pass a
  one-entry pool and the warning stops.

**`docs/INTEGRATION.md` §7.1 is now a recipe you can actually run.** It
referenced an `AVATAR_POOL_FALLBACK` constant and a `fetchAvatarPool()` helper
that appeared nowhere, and it never mentioned that
`https://sticker.kungal.com/api/v1/avatar-pool` wraps its payload as
`{ code, data: { urls } }` — so the obvious first attempt assigns an object where
an array belongs and lands you straight back on the one repeated image. Both
files are now written out in full, and there are separate recipes for an SSR app
(fetch + `useState`, so server and client pick identically) and for a fully
prerendered one (bundle the list; a fetched pool can only reach the browser
through the payload, which the app-wide config puts on *every* page — measured
at 11922 B gzip per page versus 8567 B for the bundled constant).

Also corrects the `KunUser.avatar` doc comment in `@kungal/ui-core`, which still
described two behaviours the component no longer has: deriving `-100.webp`
thumbnails, and falling back via `getRandomSticker`.
