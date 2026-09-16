# Component contracts — tier 3 of the Flutter roadmap

This directory is the machine-readable acceptance list for the future
`kun-ui-flutter` repo, per [`docs/architecture-flutter.md`](../docs/architecture-flutter.md)
§5: component *code* never crosses to Flutter, but the component *contracts* —
props, events, slots, and an honest classification of what is a web artifact —
do, and only stay correct when they are generated.

| File | Role |
| --- | --- |
| `component-contracts.json` | **Generated — do not edit.** Distilled from `apps/docs/app/generated/component-meta.json` by `scripts/gen-flutter-contracts.mjs`; regenerate with `pnpm gen`. The CI porcelain check keeps it current. |
| `flutter-portability.mjs` | **Hand-curated.** Which components and props are web-only, each with a reason. The generator fails on entries that name a component or prop that no longer exists. |

## Reading the contract

Every component is either:

- `"status": "portable"` — the parity report will ask the Flutter port to
  answer for its `props`, `events` and `slots`. **Portable does not mean
  "must build"**: tier-4 scope comes from the Flutter apps on demand (§7
  decision 3), so an unported portable component is information, not failure.
- `"status": "web-only"` — the parity report will never ask. The `reason`
  says why, and what carries the capability instead when one crosses (e.g.
  icons cross as the tier-1 `kun_ui_icons` font, toasts as an imperative API
  over Flutter's `Overlay`).

Portable components additionally carry `webOnlyProps` — props excluded from
the contract with a per-prop reason (CSS class pass-throughs, link-mode
attributes, native `<form>` field names, ARIA id plumbing).

Details that keep the file honest:

- **Types are TypeScript source strings**, exactly as the web layer declares
  them; translating `number | null` or `(value: number) => string` into Dart
  is the port's judgment. The shared design unions they name
  (`KunUIColor`, …) are enumerated in `vocabulary` so the file stands alone.
- **`v-model` appears as its parts**: a `modelValue` prop plus an
  `update:modelValue` event (named models: prop `x` plus `update:x`). A
  Flutter port typically maps the pair to `value` + `onChanged`.
- **Defaults are quoted as the docs quote them** (`"\"primary\""` is the
  string `'primary'`); a conditional default is described, not valued. A
  default that comes from the locale also carries `defaultFrom` (below).
- **A `@deprecated` prop carries a `deprecated` field** with the tag's text.
  It stays in `props` — the web still accepts it, and a manifest that already
  omits it must keep validating — but most are no-ops kept for call-site
  compatibility, and a new port can `omit` them citing that field.
- **Composables are out of scope.** Most are records of browser pathology
  that have nothing to cross (§4.1); the imperative capabilities
  (`useKunMessage`, `useKunAlert`, `useKunLoliInfo`, the config provider)
  get their Dart API contracts when tier 4 defines that API.

## Locale-sourced defaults

Sixteen props have no literal default: their placeholder or empty-state text is
resolved from the active locale. The contract says so structurally rather than
only in prose —

```json
{
  "name": "noResultText",
  "type": "string",
  "required": false,
  "default": "locale autocomplete.noResult",
  "defaultFrom": { "locale": ["autocomplete.noResult"] }
}
```

— so the port reads the same key from `kun_ui_messages` (tier 1) instead of
hard-coding a string the web no longer carries. More than one path means the
default is chosen at runtime: `KunDatePicker.placeholder` follows `precision`.
The generator fails if a path is not a key in the built-in catalog, so renaming
a message cannot leave the contract pointing at nothing.

**One field of a locale does not cross.** `name`, `code` and `messages` are
plain data and are exactly what `kun_ui_messages` is generated from.
`dateLocale` is a date-fns object backing the calendar grid — weekday and month
names, and the full date each day cell announces — and has no Dart counterpart.
On Flutter the grid resolves from `code` instead, which is why
`KunDatePicker.locale` stays a plain BCP 47 string in the contract: the web's
fallback order (`dateLocale` → `code` → `en-US`) collapses to `code` → the
platform default.

## The parity report

The Flutter repo declares what it implements in a manifest and runs the
checker from this repo, checked out at the release tag matching the
`kun_ui_tokens` version it pins (the lockstep version is the contract
version — there is no separate contract versioning):

```bash
node scripts/flutter-parity.mjs path/or/https/url/to/components.manifest.json
```

Manifest shape — for each claimed component, map every contract name to its
Dart name, or omit it with a reason:

```json
{
  "package": "kun_ui",
  "components": {
    "KunChip": {
      "widget": "KunChip",
      "props": {
        "closable": "closable",
        "color": "color",
        "disabled": { "omit": "No interactive chip in the first screens." },
        "size": "size",
        "variant": "variant"
      },
      "events": { "close": "onClose" },
      "slots": { "default": "child", "start": "leading", "end": "trailing" }
    }
  }
}
```

Drift — anything below fails the run (exit 1):

- a contract prop/event/slot on a **claimed** component that the manifest
  neither covers nor omits (the web grew API the port has not answered for);
- a manifest entry the contract no longer carries (removed or renamed
  upstream);
- a claimed component that is web-only, or unknown.

Omissions with reasons and unported portable components are reported, not
failed. Extra Dart-side parameters are invisible to the checker on purpose —
the contract is a floor, not a ceiling.
