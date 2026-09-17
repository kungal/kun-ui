---
'@kungal/ui-vue': patch
'@kungal/ui-core': patch
---

**KunAvatar no longer warns about an empty `avatarFallbackPool` when there is no user.** The dev warning exists because users with no avatar image all get the same fallback when the pool is empty. A `null` or `undefined` user always gets one shared image, whether or not a pool is configured, so the warning does not apply to it. It fired anyway. Because it fires only once per page, an app whose users all have avatars saw it while the user was still loading. It now fires only when it renders a user who has no `avatar`. That includes a user who arrives after the first render.

**`id: 0` is now documented as "no profile".** KunAvatar and KunUserChip have always rendered a user whose `id` is 0 without a link. Apps rely on this for an unknown or deleted author, or for a signed-out viewer. The docs for `KunUser.id` and `isNavigation` now say so.
