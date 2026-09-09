# KunUI on Flutter — constraint analysis & roadmap

Companion to [`architecture.md`](./architecture.md). That document answers
"how far does KunUI reach across **web** frameworks (Nuxt → Vue → React)."
This one answers the harder version of the same question: the NextMoe
ecosystem's apps are all Flutter, so **how much of KunUI can reach a
renderer that has no DOM, no CSS, and no Tailwind?**

Research date: **2026-09-07**. Every claim below is sourced; version
numbers and star counts are as of that date.

Revised **2026-09-09** after an independent second verification pass
(all load-bearing claims re-checked against primary sources). The
direction survived review; §3.3, §3.4, §4.2, §5 and §6 carry refinements
from that pass, and the §7 decisions are now made.

---

## 1. The honest constraint

`architecture.md` opens with "there is no technology that runs `.vue`
inside React." The Flutter version of that sentence is stronger, because
the gap is not the component model — it is the entire rendering substrate:

> **Flutter does not render HTML.** There is no DOM, no CSS cascade, no
> `z-index`, no `Teleport`, no focus trap, no `overflow: hidden`. A Flutter
> widget tree is composited by Skia/Impeller. Nothing in `@kungal/ui-vue`
> executes there, and nothing in `@kungal/ui-tokens` is *read* there —
> because reading it would mean parsing CSS.

So "supporting Flutter" always means **rewriting the render layer**, same
as React. The difference is that with React we could still ship the *same
CSS file* and the same Tailwind classes; with Flutter even the token
delivery mechanism has to be regenerated. The question is therefore not
"can we share components" (no) but **"what is the largest artifact that can
be machine-generated into both worlds, so the two never drift?"**

## 2. What the industry actually does

### 2.1 Google / Material 3 — the strongest precedent, and a warning

Material 3 is the only major design system with a first-party web
implementation *and* a first-party Flutter implementation. The outcome:

- [`material-foundation/material-color-utilities`](https://github.com/material-foundation/material-color-utilities)
  (⭐2260, last push 2026-08-21) implements the **colour science** — the HCT
  space, tonal palettes, dynamic colour — separately in **six languages**:
  `cpp / dart / java / kotlin / swift / typescript`. Its README lists all
  six as shipping, and invites requests for more.
- [`material-components/material-web`](https://github.com/material-components/material-web)
  (⭐11231) carries this note at the top of its README:

  > **Note: [MWC is in maintenance mode pending new maintainers](https://github.com/material-components/material-web/discussions/5642).**

One company, one design system, two component implementations — and the
web one is the one that stopped. **The layer that survived on both sides is
the token/algorithm layer, reimplemented per language.** That is the single
most important finding in this document.

### 2.2 Microsoft / Fluent — icons cross, components do not

[`microsoft/fluentui-system-icons`](https://github.com/microsoft/fluentui-system-icons)
(⭐10823) ships `android/`, `ios/`, `flutter/`, `fonts/` and `assets/`
**side by side in one repository**, from one set of source SVGs. Microsoft
publishes [`fluentui_system_icons`](https://pub.dev/packages/fluentui_system_icons)
to pub.dev themselves.

The *components*, however, are not Microsoft's: [`fluent_ui`](https://pub.dev/packages/fluent_ui)
(v4.16.1) is a community package by `bdlukaa`. Same for `macos_ui`.

**Icons are the one asset that vendors genuinely share across platforms.**

### 2.3 shadcn/ui — three independent ports, and a drift exhibit

| Package | Repo | Stars | Relationship to the web original |
| --- | --- | --- | --- |
| `shadcn_ui` | [nank1ro/flutter-shadcn-ui](https://github.com/nank1ro/flutter-shadcn-ui) | ⭐2798 | independent rewrite |
| `forui` | [duobaseio/forui](https://github.com/duobaseio/forui) | ⭐2334 | "heavily inspired by", independent |
| `shadcn_flutter` | [sunarya-thito/shadcn_flutter](https://github.com/sunarya-thito/shadcn_flutter) | ⭐936 | independent rewrite |

None shares code with the web project. More instructive is *how they carry
the tokens*. From `flutter-shadcn-ui`, `lib/src/theme/color_scheme/zinc.dart`:

```dart
const ShadZincColorScheme.light({
  super.primary     = const Color(0xff18181b),
  super.secondary   = const Color(0xfff4f4f5),
  super.destructive = const Color(0xffef4444),
  super.border      = const Color(0xffe4e4e7),
  ...
```

**Hand-transcribed hex.** Web-side shadcn moved to OKLCH with Tailwind v4;
this Dart file does not follow. It cannot — nothing generates it.

This is the failure mode KunUI must design against, and it is the reason
the plan in §5 makes generation non-negotiable rather than a nicety.

### 2.4 What the survey adds up to

> **Component code is never shared. Tokens and icons are shared, and only
> stay correct when they are generated.** Two teams maintaining two
> component implementations of one design system is a load Google could not
> carry; a hand-copied token table drifts on the first palette change.

## 3. The infrastructure that *did* mature

The negative finding above is old news. What is new since 2025 is that the
shared-token half now has a real standard and real tooling.

### 3.1 DTCG Format Module 2025.10 — first stable version

The Design Tokens Community Group [announced the first stable version on
2025-10-28](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/),
with 20+ editors from Adobe, Amazon, Google, Microsoft, Meta, Figma,
Salesforce, Shopify and others.

Its [colour module](https://www.designtokens.org/tr/2025.10/color/) defines
14 colour spaces — `srgb`, `srgb-linear`, `hsl`, `hwb`, `lab`, `lch`,
`oklab`, **`oklch`**, `display-p3`, `a98-rgb`, `prophoto-rgb`, `rec2020`,
`xyz-d65`, `xyz-d50` — and an OKLCH token looks like this:

```json
{ "$type": "color",
  "$value": { "colorSpace": "oklch",
              "components": [0.7016, 0.3225, 328.363],
              "alpha": 1,
              "hex": "#ff00ff" } }
```

**That is structurally what `packages/ui-tokens/scripts/gen-tokens.mjs`
already computes.** Its `chan()` emits an `"L C H"` triplet from culori and
its `formatHex()` already produces the sRGB fallback. Emitting DTCG is an
extra output, not a rewrite.

> Cite **2025.10**, not the drafts. `designtokens.org/tr/drafts/format/` is
> a newer preview carrying "Do not attempt to implement this version of the
> specification. Do not reference this version as authoritative in any way."

### 3.2 Style Dictionary has a Flutter path — with a trap in it

Style Dictionary v5 [uses DTCG as its base format](https://styledictionary.com/info/dtcg/)
and ships a first-class Flutter transform group
(`lib/common/transformGroups.js:317`):

```js
[transformGroups.flutter]: [
  attributeCti, nameCamel, colorHex8flutter,
  sizeFlutterRemToDouble, contentFlutterLiteral, assetFlutterLiteral,
],
```

and a Dart template (`lib/common/templates/flutter/class.dart.template.js`)
emitting `import 'dart:ui';` + a class of `static const` fields.

**Do not use `color/hex8flutter` as-is.** Its implementation is:

```js
const str = getColor(token, options).toHex8().toUpperCase();
return `Color(0x${str.slice(6)}${str.slice(0, 6)})`;   // → Color(0xFF00FF5F)
```

That output is on Flutter's deprecated path (§3.3) and quantises every
OKLCH value to 8-bit sRGB on the way out — throwing away exactly the
precision the palette generator exists to preserve. KunUI needs its own
transform.

### 3.3 Flutter's colour API moved under wide-gamut

Per the [wide-gamut migration guide](https://docs.flutter.dev/release/breaking-changes/wide-gamut-framework),
landed in `3.26.0-0.1.pre`, stable in **Flutter 3.27**:

- new constructor `Color.from(alpha:, red:, green:, blue:, colorSpace:)`
  taking **normalised doubles**;
- `ColorSpace` enum with `extendedSRGB` and `displayP3`;
- floating-point accessors `a`, `r`, `g`, `b`;
- **deprecated**: `value`, `red`, `green`, `blue`, `opacity`,
  `withOpacity()` (→ `withValues(alpha: …)`).

So generated Dart must target `Color.from(...)`. As of 2026-09 the
current stable is **Flutter 3.47** (2026-08), so this API is long
settled, and the ecosystem decision is "target latest Flutter only" —
the package's honest floor is simply the API floor, `>=3.27`.
`Color.from` is a **const constructor** (verified against the API docs),
which is what makes a generated `static const` token class possible at
all; it takes normalised doubles, so generated values keep the
generator's precision instead of quantising to 8-bit hex on the way out.

This also means the
gamut question is real and must be decided deliberately: several KunUI
hues are clamped to sRGB today by `clampChroma(..., 'rgb')` in
`gen-tokens.mjs`, and a P3-capable phone could show more. **Ship sRGB-clamped
values first** so web and app match, and treat P3 as a separate, later,
explicitly-measured decision.

### 3.4 Motion is portable as *data* — at two different levels

The four named easings (`--ease-kun-standard/out/in/emphasized`) are
plain cubic-beziers, and Flutter's
[`Cubic(a, b, c, d)`](https://api.flutter.dev/flutter/animation/Cubic-class.html)
is the same parametrisation — they cross as
`const Cubic(0.2, 0, 0, 1)` with **no sampling step at all**. The same
is true of the duration scale (`Duration(milliseconds: …)`).

Sampling matters for the *ballistic* animations. KunUI's house rule is
that motion must feel physical, and the technique that satisfied it was
**sampling a real ballistic trajectory into ~16 linear keyframes**
rather than fitting one fat bezier. For those, the shared source of
truth should be **the physics parameters** (gravity, launch velocity),
one level above the samples: the web output bakes keyframes from them
(the existing house method, unchanged) and the Flutter output either
bakes the same table into
[`CatmullRomCurve.precompute(...)`](https://api.flutter.dev/flutter/animation/CatmullRomCurve-class.html)
(deterministic cross-platform parity) or, for gesture-driven cases
(a drawer released mid-drag), runs the SDK's own
`SpringSimulation`/`GravitySimulation` live — something CSS cannot do.

Where the industry is heading, verified 2026-09: **M3 Expressive
(2025-05) made spring *parameters* the motion token**, not curves — but
the Flutter SDK itself does **not** ship M3 Expressive motion, the
Flutter team is not currently working on it, and the gap is filled by
the community [`motor`](https://pub.dev/packages/motor) package
(`MaterialSpringMotion` tokens). KunUI takes physics-as-tokens (the
direction) without taking `motor` (the dependency): iron rule #4's
spirit holds on the Dart side too, and `flutter/physics` +
`CatmullRomCurve` are in the SDK.

## 4. What crosses, measured against this repo

| Asset | Crosses? | Notes |
| --- | --- | --- |
| OKLCH palette: 7 hues × 11 shades + solid + on-colour | 🟢 generate | plus the **WCAG AA assertion** — the most valuable invariant we own |
| Radius buckets (`--radius-kun-*`, 5) | 🟢 generate | `--kun-radius-scale` becomes a theme field |
| Elevation (`--shadow-kun-sm/md/lg`) | 🟢 generate | maps to `BoxShadow`; offsets/blur port, spread semantics differ slightly |
| Motion: 4 easings + 4 durations + sampled curves | 🟢 generate | §3.4 |
| The 30 icons in `WANT` | 🟢 generate | one SVG source → both |
| Component *contracts* (props/events/slots) | 🟡 spec only | `apps/docs/app/generated/component-meta.json`, 70 entries |
| Vue SFC render layer (70 registered components) | 🔴 0% | rewrite |
| Tailwind: `cn()`, tailwind-merge, `@source`, utility classes | 🔴 0% | no analogue exists |

### 4.1 What does not cross — and that Flutter does not need

Roughly two thirds of `packages/vue/src/composables` (26 files, 3 of them
context modules) are **records of browser pathology**, not design logic:

- **The entire z-index band** — `--z-kun-sticky: 30`, `modal: 9000`,
  `popover: 9300`, `alert: 9700`, `message: 9999` — has no meaning in
  Flutter. Confirmed from Flutter source, `packages/flutter/lib/src/widgets/overlay.dart`:
  `insert(OverlayEntry entry, {OverlayEntry? below, OverlayEntry? above})`
  splices into a list at a computed index — *"If `below` is non-null, the
  entry is inserted just below `below`. … Otherwise, the entry is inserted
  on top."* Ordering is **list position**, expressed relatively. There is no
  z-index to fight over, so `useKunOverlayZIndex` and `useKunFloatingLayer`
  have nothing to do.
- `useBodyScrollLock` + `--kun-scrollbar-width` — a Flutter route/overlay
  does not let the page behind it scroll, so the whole measured-scrollbar,
  iOS-touch-scroll, `dvh`-vs-keyboard cluster evaporates.
- `Teleport`, `focus-trap`, `onClickOutside`, `useKunBackgroundInert`,
  `useKunCloseRequest` — Flutter answers these with `Navigator` routes,
  `FocusScope`, `PopScope` and `Shortcuts`/`Actions`.
- Components that are web artifacts: `KunMarkdown`, `KunContent` (`v-html`),
  `KunScrollShadow` (a deliberate pure-CSS answer — see iron rule #4),
  `KunImage` (`@nuxt/image`), `KunLink`, `KunRipple` (Flutter has `InkWell`).

**Iron rule #5 does not apply on Flutter.** "Correctness CSS goes inline,
never in a class" exists because a consumer's Tailwind might purge a class.
Dart has no purge step, so the rule is web-only — but the *reason* behind it
(the library must not depend on a consumer's build pipeline to be correct)
is exactly why generated Dart must be published as a package, not copied.

### 4.2 Three shortcuts, rejected

- **Flutter Web replacing the Vue layer.** CanvasKit renders to a canvas
  rather than semantic DOM, so a crawler sees the bootstrap HTML shell and
  little else; CanvasKit itself is ~1.5 MB before app code. The KunGal
  properties are content sites where search visibility is existential.
  (Sourced, not measured here — if this is ever seriously proposed, measure
  it before deciding.)
- **A WebView wrapping the Vue components.** That is not a design-system
  decision; it converts the app into a shell and forfeits every reason to
  have chosen Flutter.
- **[WebF](https://github.com/openwebf/webf) rendering the Vue components
  inside Flutter.** The modern version of the WebView shortcut: a
  W3C/WHATWG-compliant web runtime on Flutter that claims Vue apps run
  unmodified. Rejected for the *design system* on the same grounds as the
  WebView — it embeds a JS runtime and its own CSS engine, so building
  KunUI on it would make every downstream Flutter app a hybrid app — plus
  one of its own: it only just announced beta (2026). A downstream app
  rendering one rich-content screen with it is an app-level call (the
  Flutter analogue of iron rule #4's "an app may take such a dependency
  locally; the library may not"); it is not an architecture for KunUI.

## 5. The plan — five tiers

Only tiers 0–2 are *shared*. Tiers 3–4 are "written separately, verified
against a shared spec."

| Tier | What | Where it lives | Shared? |
| --- | --- | --- | --- |
| **0** | **Tokens.** Extend `gen-tokens.mjs`'s in-memory model to emit **three sibling outputs**: `palette.generated.css` (byte-identical), generated Dart, and a DTCG 2025.10 interop export. | `packages/ui-tokens-flutter/` → `kun_ui_tokens` on pub.dev; `tokens.dtcg.json` in `@kungal/ui-tokens` | 🟢 generated |
| **1** | **Icons.** Add `gen:icons:flutter`; one SVG source, two outputs. Repo shape modelled on `microsoft/fluentui-system-icons`. | `@kungal/ui-core` `WANT` → Dart asset package | 🟢 generated |
| **2** | **Motion.** Beziers/durations cross as consts (§3.4, no sampling); ballistic animations share their *physics parameters*, from which web bakes keyframes and Flutter bakes `CatmullRomCurve.precompute` tables. | tokens package | 🟢 generated |
| **3** | **Component contracts.** `component-meta.json` (70 components) becomes the Flutter port's acceptance list and a parity report. | this repo | 🟡 spec |
| **4** | **Component implementations.** Hand-written widgets on `ThemeExtension`; Widgetbook plays the role `apps/docs` plays here. | separate `kun-ui-flutter` repo | 🔴 separate |

Notes that are easy to get wrong:

- **The AA assertion must gate the Dart output too.** `gen:tokens` exits
  non-zero when any solid/on-colour pair misses WCAG AA. That guarantee is
  the reason the palette generator exists; a second consumer of the palette
  that does not inherit it is a regression, not a feature.
- **Generated Dart belongs in the CI gate.** `check.yml`'s "generated files
  are up to date" job uses `git status --porcelain` specifically because a
  brand-new generated file is *untracked* and `git diff` cannot see it. The
  Dart artifacts need the same treatment for the same reason.
- **Tier 0 emits `Color.from(...)`, not `Color(0xFF…)`** (§3.2, §3.3).
- **DTCG is an export, not the pivot.** The single source of truth is the
  *policy* in `gen-tokens.mjs` (`HUES`, the ramp, the AA assertion) — a
  DTCG file stores resolved values and cannot express any of that. So the
  generator's one in-memory model emits CSS, Dart and DTCG as siblings;
  the working generator is not rewritten around a format whose only
  in-repo consumer would be ourselves. The DTCG file exists for what it
  is good at: interop with Figma and external token tooling.
- **Tier 1 hides two traps the "one SVG source" framing glosses over.**
  (a) The 30 bundled icons are lucide, which is **stroke-based** — and the
  Flutter-native delivery is an icon font + `IconData` (free
  `IconTheme` color/size inheritance, `--tree-shake-icons`, zero runtime
  deps; `fluentui-system-icons` ships exactly this, `fonts/` + one Dart
  file), so the pipeline needs an explicit **stroke→outline** conversion
  step (lucide's own font build does this upstream; every lucide Flutter
  package is such a regenerated font). (b) The 30th icon,
  `svg-spinners:90-ring-with-bg`, is an *animated* SVG — no static format
  carries it; the Flutter side gets a hand-written rotating-arc widget in
  tier 4. The honest tier-1 count is 29 crossing, 1 not.
- **Tier 0's generated Dart is theme-system-agnostic plain `const`
  classes** — not `ThemeExtension` subclasses. Verified 2026-09: the
  modern independent design systems on Flutter (forui's
  `FTheme`/`FThemeData`, shadcn_ui's `ShadTheme`) do **not** hang off
  Material's `ThemeData`; KunUI is its own design language, not a
  Material skin, so the eventual `kun-ui-flutter` will likely want its
  own `KunTheme` InheritedWidget. That is tier 4's decision — the token
  package must not foreclose it either way. (forui also models input
  modality — touch/pointer — and breakpoints as theme dimensions; worth
  stealing when tier 4 starts.)
- **Do not port 70 components.** Scope tier 4 from what the Flutter apps
  actually need — realistically ~20 — and let the rest arrive on demand.
  Iron rule: one consumer is not a component.

## 6. Cost and risk

- **This opens a second product line, not a package.** Four npm packages in
  lockstep becomes four npm packages *plus* a pub.dev package on a different
  registry. The publish channel is less alien than first feared, though:
  pub.dev supports [automated publishing from GitHub Actions via OIDC](https://dart.dev/tools/pub/automated-publishing),
  **triggered by pushing a git tag** matching a configured pattern (e.g.
  `kun_ui_tokens-v{{version}}`, set in the package's Admin tab), with
  `permissions: id-token: write` and the reusable
  `dart-lang/setup-dart` publish workflow — and `release.yml` already
  pushes tags, so the pub leg is a second workflow listening on the same
  release train, not a second train. Two hard constraints: **the first
  version must be published manually** (`dart pub publish`), and the
  `pubspec.yaml` version must match the tag — which is why the version
  bump step must sync `pubspec.yaml` from `@kungal/ui-tokens`'s
  `package.json` (the lockstep extends to pub.dev).
- **The dominant failure mode is drift, not difficulty.** §2.3's `zinc.dart`
  is the exhibit. Mitigation is entirely in tier 0: generate, and gate.
- **Iron rule #1 tension.** "This repo is upstream for the whole ecosystem"
  is only true for Flutter if the Flutter tokens are generated *here*. The
  moment someone hand-writes a colour in the Flutter repo, the rule is
  broken in a way no downstream policy can catch.

## 7. Decisions (made 2026-09-09)

Confirmed by the maintainer after the second verification pass:

1. **`kun_ui_tokens` publishes from this repo** (`packages/ui-tokens-flutter/`).
   Iron rule #1 stays literally true; this repo grows Dart tooling in CI
   (`flutter analyze` on the generated package) and a tag-triggered pub.dev
   publish workflow (§6).
2. **sRGB-clamped now.** The generated Dart carries exactly the values the
   CSS carries — same `clampChroma(..., 'rgb')` pass, same numbers — so the
   app and the sites match. P3 is a later, explicitly-measured decision.
3. **Tier 4 scope comes from the Flutter apps on demand**, not from parity
   with the web list.

---

## Sources

Read on 2026-09-07. Repository facts were read via `gh api` / raw files
rather than from memory.

- Google / M3: [material-color-utilities](https://github.com/material-foundation/material-color-utilities) · [material-web](https://github.com/material-components/material-web) · [MWC maintenance-mode discussion](https://github.com/material-components/material-web/discussions/5642)
- Microsoft: [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons) · [fluentui_system_icons on pub.dev](https://pub.dev/packages/fluentui_system_icons) · [fluent_ui (community)](https://pub.dev/packages/fluent_ui)
- shadcn ports: [flutter-shadcn-ui](https://github.com/nank1ro/flutter-shadcn-ui) · [forui](https://forui.dev/) · [shadcn_flutter](https://github.com/sunarya-thito/shadcn_flutter)
- DTCG: [first stable version announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) · [Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) · [Color module 2025.10](https://www.designtokens.org/tr/2025.10/color/)
- Style Dictionary: [DTCG support](https://styledictionary.com/info/dtcg/) · [predefined transforms](https://styledictionary.com/reference/hooks/transforms/predefined/) · [source](https://github.com/style-dictionary/style-dictionary)
- Flutter: [wide-gamut Color migration](https://docs.flutter.dev/release/breaking-changes/wide-gamut-framework) · [CatmullRomCurve](https://api.flutter.dev/flutter/animation/CatmullRomCurve-class.html) · [Overlay](https://api.flutter.dev/flutter/widgets/Overlay-class.html) · `packages/flutter/lib/src/widgets/overlay.dart`
- Flutter web / SEO: [Flutter for Web SEO readiness](https://www.codesoltech.com/blog/flutter-for-web-seo/) · [Flutter Web & Desktop 2026](https://softaims.com/blog/flutter-web-desktop-production-ready-2026)
- Shape precedent (no authority, cited for its structure only): [figuredout_ui_flutter](https://github.com/AlphaArtrem/figuredout_ui_flutter) — a Flutter design system described as "the sibling of the React package", with a generated contrast report and a `components.manifest.json`
