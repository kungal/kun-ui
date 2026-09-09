---
'@kungal/ui-vue': patch
---

Tier 3 of the Flutter roadmap: the component contracts now ship as a generated acceptance list.

`contracts/component-contracts.json` distills the docs' component metadata (70 components) into the surface a Flutter port must answer for — props, events, slots, and the shared design-union vocabulary — with a hand-curated classification of what never crosses: 13 web-only components and the web-only props (CSS class pass-throughs, link-mode attributes, native `<form>` field names, ARIA id plumbing), each excluded with a reason. `scripts/flutter-parity.mjs` is the matching parity checker: the future `kun-ui-flutter` repo declares what it implements in a manifest and its CI fails on drift — a claimed component whose contract grew unanswered surface, or a manifest entry the web has removed. Absence is not drift: tier-4 scope comes from the Flutter apps on demand.

Nothing changes for a consumer of the npm packages — no runtime code is touched. This release exists to put the contract under the release train's version lockstep: the contract version *is* the package version.
