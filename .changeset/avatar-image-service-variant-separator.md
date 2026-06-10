---
'@kungal/ui-vue': patch
---

KunAvatar: pick the 100px-thumbnail variant separator by image family. Content-addressed image_service avatars (`…/aa/bb/<hash>.webp`) expose variants with an underscore (`<hash>_100.webp`), while legacy path-based avatars use a hyphen (`avatar-100.webp`). The previous hardcoded hyphen `-100` 404'd every new image_service avatar (blank top-bar/comment avatars after a user changed their picture). Now detects the two-level-hex hash path and uses `_` for those, `-` otherwise.
