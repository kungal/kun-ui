---
'@kungal/ui-vue': minor
---

**KunAvatar no longer names another service.** Its fallback for a user with no avatar image now comes from `useKunUIConfig().avatarFallbackPool`, and the last link in the chain is a bundled data URI that cannot fail to load.

The old `getRandomSticker` built a URL from a hardcoded `https://sticker.kungal.com` plus a `/stickers/KUNgal{pack}/{n}.webp` path and two magic counts. That path addressed **a position in a mutable collection on a site KunUI does not own**, so when that site stopped serving static files, every avatar-less account across six consumers 404'd at once — and in a community site that is most accounts. A URL naming another service does not belong in a component library.

**What changed**

- `useKunUIConfig()` gains `avatarFallbackPool: string[]` (default `[]`). Supply absolute, immutable image URLs; KunUI never assembles one from a template.
- New `pickAvatarFallback(seed, pool)` in `@kungal/ui-core` — the deterministic pick, same hash as before, now over a pool you own. Stable across SSR and hydration.
- New `KUN_AVATAR_FALLBACK` — the terminal fallback, a 128×128 webp inlined as a base64 data URI (7.1 KB), matching the no-fetch policy of the bundled icons and KunNull's mascot. `KunAvatar`'s `fallback-src` is now this, so the *last* fallback cannot be a network failure. Measured on the built docs: an avatar-less `KunAvatar` issues **zero** image requests.
- `getRandomSticker` still exports and still type-checks, now **deprecated**. It returns the bundled fallback for any input — it cannot return a sticker URL any more, because the files it pointed at are gone. Nothing in the ecosystem imported it from `@kungal/*`; every consumer had its own copy.

**`installKunUIConfig` now merges instead of replacing.** `app.provide` is last-write-wins, so the `@kungal/ui-nuxt` layer plugin and an app's own plugin could not both configure KunUI: whichever ran second reset the other's keys to the built-in defaults, turning every `NuxtLink` back into a full-page `<a>`. Order no longer matters and later keys win. The merge mutates the installed object rather than re-providing the key, so Vue no longer logs `App already provides property with key "Symbol(kun-ui-config)"` at what is now the supported pattern.

**Sizing the pool.** The pick is `hash(user.name) % pool.length`, so the array is an index space, not a ranking: replacing one entry moves only the users who land on it, while changing its *length* re-assigns everybody. Keep it small — with immutable caching, a 64-entry pool at ~5 KB each is ~340 KB, the total a browser can ever download, and a 30-avatar page pulls 24 distinct images (measured). Fetch the list on your server, never per render and never from the browser. `docs/INTEGRATION.md` §7.1 has the Nuxt recipe.
