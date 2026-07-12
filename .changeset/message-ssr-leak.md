---
'@kungal/ui-vue': patch
---

fix(vue): KunMessage no longer leaks toasts across SSR requests

The toast store is module-scope, so on the server it's a single array shared by
every SSR request and never cleared there (the dismiss timer is client-only). A
server-side `useKunMessage()` — e.g. from a data-fetch error handler that runs
during SSR — therefore piled up (deduped into a growing `count`), baked into
every page's SSR HTML, and vanished on hydration (empty client store →
hydration mismatch). Two guards, both making toasts the client-only ephemeral UI
they are: `useKunMessage()` is a no-op on the server (the store is never mutated
there), and `KunMessageProvider` renders nothing until mounted.
