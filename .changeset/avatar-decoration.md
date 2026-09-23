---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

KunAvatar draws avatar frames. `KunUser` gains an optional `avatarDecoration: { src, animatedSrc? }`, and any avatar whose user carries one gets the frame around it — `KunUserChip` included, with no change at the call site. The asset is a square canvas 1.2× the avatar with the avatar circle centred, the geometry Discord's decorations and Steam's avatar frames use; the frame hangs 10% outside the avatar on every side as an absolutely positioned, `pointer-events: none`, `aria-hidden` overlay, so it moves no layout and never takes the avatar link's click.

The new `decoration` prop decides when the animated asset plays: `hover` (the default) shows the still frame and plays the animation while the avatar is hovered or focused, `always` plays it continuously, `static` never animates, and `none` hides the frame. Frames are not drawn below the `md` size, where they are illegible, and `KunAvatarGroup` never draws them — its 4px gap cannot hold two frames overhanging by 10%. A reader who asked for reduced motion always gets the still image, through a native `<picture>` `<source media="(prefers-reduced-motion: reduce)">`, so it is right in the server-rendered HTML with no script.

Nothing changes for a user without `avatarDecoration`: no extra element, no inline style.
