---
"@kungal/ui-vue": minor
"@kungal/ui-nuxt": minor
---

SEO-first Tab panels + crawlable tab-as-route.

KunTab was a headless tab **bar** (it rendered `role="tab"` buttons and exposed
the active value, but no content). That left the SSR-SEO-critical decision —
how to render and hide each section — entirely to the consumer, and the obvious
`v-if` choice silently drops inactive panels from the indexable DOM. This adds a
first-class, SEO-optimal content layer.

**New `KunTabPanel` / `KunTabPanels`.**

```vue
<KunTab v-model="active" :items="items" name="product" />
<KunTabPanels v-model="active" name="product">
  <KunTabPanel value="overview">…</KunTabPanel>
  <KunTabPanel value="specs">…</KunTabPanel>
</KunTabPanels>
```

- **`mount` (default `"eager"`)** — `eager` server-renders **every** panel into the
  HTML so search engines index all of it; inactive panels are hidden, not removed.
  `"lazy"` renders on first activation then keeps (huge data, accepts the
  trade-off for unopened panels); `"unmount"` keeps only the active panel in the
  DOM (NOT crawlable — for heavy non-SEO widgets only). `forceMount` is a boolean
  alias for `eager`, familiar from Radix/Reka/MUI.
- **Inactive panels hide with `hidden="until-found"`** (`hiddenStrategy`, default) —
  they stay indexed *and* become reachable by in-page search (Ctrl+F),
  scroll-to-text fragments and deep links; the `beforematch` reveal flips the
  active tab to match. `hiddenStrategy="display"` falls back to `display:none`.
  SSR/first paint is flash-free (a `content-visibility` placeholder upgrades to
  the real attribute on the client).
- Correct `role="tabpanel"` + `aria-labelledby`/`aria-controls` wiring (tab ↔
  panel ids derive from the tab `value`, namespaced by an optional `name`).

**KunTab: `href` items now render a real `<a>` (crawlable tab-as-route).** Tabs
with `href` previously rendered a `<button>` that navigated programmatically —
invisible to crawlers. They now render `config.linkComponent` (`<a>` / `NuxtLink`)
with the href, so each tab is a discoverable URL and works without JS; with JS the
click is intercepted and routed through `config.navigate` (no double-nav). Tabs
also gained `id` / `aria-controls` (and KunTab a `name` prop) to pair with panels.
