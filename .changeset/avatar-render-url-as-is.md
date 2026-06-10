---
"@kungal/ui-vue": patch
---

KunAvatar: render the avatar URL exactly as given — stop deriving size variants
in the component.

KunAvatar used to turn `user.avatar` into a 100px thumbnail by string-replacing
the extension (`.webp` → `-100.webp`, most recently host-aware `_100` / `-100`).
That baked CDN-specific URL conventions into the UI library. KunAvatar now
renders `user.avatar` as-is; `size` only controls the rendered dimensions.
Empty/missing avatar still falls back to a deterministic sticker.

**Migration (consumers now pass the exact URL to show):** for small avatars pass
the pre-sized thumbnail your CDN exposes (e.g. content-addressed
`…/<hash>_100.webp`, legacy `…/avatar-100.webp`); for profile/`original` sizes
pass the full image. Your backend already knows the image host, so resolving the
URL belongs there — not in the UI.
