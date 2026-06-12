---
"@kungal/ui-vue": minor
---

Make the navigational components render real, crawlable `<a href>` links.

Google only follows `<a href>` — it doesn't click `<div @click>` / `<button>` /
programmatic navigation. Several KunUI components navigated via `config.navigate`
on a non-anchor element, so those links were invisible to crawlers. They now
render a real anchor (`config.linkComponent` → `<a>` / `NuxtLink`), keeping the
same navigation behavior (and working without JS):

- **KunBrand** — the home/logo link was a `<div @click>`; now a real `<a>` to `to`
  (the canonical crawl entry point).
- **KunPagination** — new `pageHref?: (page) => string` prop. When provided, the
  numbered page controls render `<a href>` per page, so paginated content is
  crawlable. Without it, behaviour is unchanged (plain buttons).
- **KunAvatar / KunUserChip** — a profile-linking avatar was a `<div @click>`;
  now a real `<a>` to the user profile when there's a user to link to. KunUserChip
  wraps the **whole** chip (avatar + name) in one link so the name is anchor text,
  and gained an `isNavigation` prop (default `true`); the inner avatar is no longer
  a nested link.
- **KunDropdown / KunContextMenu** — menu items gained an optional `href`. An item
  with `href` renders `<a role="menuitem" href>` (crawlable, for navigational
  menus); action items without `href` stay `<button>`.

All changes are non-breaking: components without a navigation target (or
pagination without `pageHref`, menu items without `href`) render exactly as
before. Note KunBrand and a profile-linking KunAvatar/KunUserChip now render an
`<a>` instead of a `<div>` — restyle if you targeted the element by tag.
