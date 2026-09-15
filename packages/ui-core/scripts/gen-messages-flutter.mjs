// ─────────────────────────────────────────────────────────────────────────────
// The Flutter half of the message pipeline: one catalog source, two outputs.
//
// packages/ui-core/src/locale/*.json is what the web bundles and what this
// script emits `kun_ui_messages` from, so a string cannot exist on one platform
// only. The catalogs are JSON rather than TypeScript for exactly this reason —
// a Node generator can read them without evaluating TS.
//
// The Dart shape is NOT a map of dotted paths. TypeScript can prove that
// `t('pagination.pge')` is misspelled (KunMessagePath is a template-literal
// union) but it cannot prove that `t('datePicker.monthCell', { year })` is
// missing `month` — that ships `{month}` into a real aria-label. Dart can, so
// every templated string becomes a method with required named parameters and
// that failure mode does not exist here.
//
// Run: pnpm --filter @kungal/ui-core gen:messages:flutter
//
// Output is written pre-formatted: check.yml's `flutter-tokens` job runs
// `dart format --output=none --set-exit-if-changed` over this package and has
// no step that could fix the output up, so what this script emits has to be
// format-clean already. Reproduced here are the two shapes that matter — an
// arrow body joins the signature at or under 80 columns, and an initializer
// list of two or more aligns under an extra-spaced colon.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const LOCALE_DIR = join(HERE, '../src/locale')
const PUB_DIR = join(HERE, '../../ui-messages-flutter')
const DART_OUT = join(PUB_DIR, 'lib/kun_ui_messages.dart')
const PUBSPEC = join(PUB_DIR, 'pubspec.yaml')
const NPM_PKG = join(HERE, '../../ui-tokens/package.json')

const PUB_NAME = 'kun_ui_messages'
// Ordered: the first is the built-in default and leads the generated file.
const CATALOGS = ['zh-CN', 'en']
// The one catalog whose strings are quoted in dartdoc — a reader of the
// generated file can parse them, whichever locale they ship.
const DOC_CATALOG = 'en'

// ── version lockstep ────────────────────────────────────────────────────────
const npmVersion = JSON.parse(readFileSync(NPM_PKG, 'utf8')).version
const pubVersion = readFileSync(PUBSPEC, 'utf8').match(/^version:\s*(\S+)/m)?.[1]
if (pubVersion !== npmVersion) {
  console.error(
    `\n✗ version lockstep broken: @kungal/ui-tokens is ${npmVersion}, but ` +
      `packages/ui-messages-flutter/pubspec.yaml is ${pubVersion ?? '(none)'}.\n` +
      '  pub.dev rejects a publish whose pubspec version does not match the\n' +
      '  release tag. Run `pnpm sync:pub` to bring the pub package back in line.'
  )
  process.exit(1)
}

// ── load and cross-check the catalogs ───────────────────────────────────────
const catalogs = CATALOGS.map((code) => ({
  file: `${code}.json`,
  ...JSON.parse(readFileSync(join(LOCALE_DIR, `${code}.json`), 'utf8')),
}))

const fail = (...lines) => {
  console.error(`\n✗ gen-messages-flutter:\n  ${lines.join('\n  ')}`)
  process.exit(1)
}

const [base, ...rest] = catalogs
const paths = (c) =>
  Object.entries(c.messages).flatMap(([ns, group]) =>
    Object.keys(group).map((key) => `${ns}.${key}`)
  )
const basePaths = paths(base)
for (const other of rest) {
  const a = new Set(basePaths)
  const b = new Set(paths(other))
  const missing = [...a].filter((p) => !b.has(p))
  const extra = [...b].filter((p) => !a.has(p))
  if (missing.length || extra.length) {
    fail(
      `${other.file} does not carry the same keys as ${base.file}.`,
      ...missing.map((p) => `missing: ${p}`),
      ...extra.map((p) => `extra:   ${p}`),
      'Every catalog must be complete — a key resolved from one locale and',
      'not another is a message that disappears when the app switches.'
    )
  }
}

// A placeholder that survives in one language and not another silently drops
// the value it carried (react-aria's de-DE moves {fieldLabel}, it never omits
// it). The generated method signature is one per key, so the sets must agree.
const placeholders = (template) => [
  ...new Set([...template.matchAll(/\{(\w+)\}/g)].map((m) => m[1])),
]
const params = {}
for (const path of basePaths) {
  const [ns, key] = path.split('.')
  const sets = catalogs.map((c) => placeholders(c.messages[ns][key]).sort())
  const [first, ...others] = sets
  for (const [i, other] of others.entries()) {
    if (other.join() !== first.join()) {
      fail(
        `${path} interpolates {${first.join('}, {')}} in ${base.file} but ` +
          `{${other.join('}, {')}} in ${catalogs[i + 1].file}.`,
        'A translation may move a placeholder; it may not drop one.'
      )
    }
  }
  params[path] = placeholders(base.messages[ns][key])
}

// ── Dart identifiers ────────────────────────────────────────────────────────
const DART_RESERVED = new Set([
  'assert', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
  'do', 'else', 'enum', 'extends', 'false', 'final', 'finally', 'for', 'if',
  'in', 'is', 'new', 'null', 'rethrow', 'return', 'super', 'switch', 'this',
  'throw', 'true', 'try', 'var', 'void', 'while', 'with',
])
// The web namespace for KunNull. `null` is a Dart reserved word, so it is the
// one name that cannot cross verbatim; contracts/README.md records the mapping
// because contract entries still say `null.description`.
const RENAMED = { null: 'nullState' }

const ident = (name, what) => {
  const dart = RENAMED[name] ?? name
  if (!/^[a-z][A-Za-z0-9]*$/.test(dart) || DART_RESERVED.has(dart)) {
    fail(
      `${what} "${name}" does not yield a usable Dart identifier (got "${dart}").`,
      'Rename it in packages/ui-core/src/locale/types.ts and the catalogs, or',
      'add it to RENAMED here with the reason.'
    )
  }
  return dart
}

const pascal = (s) => s[0].toUpperCase() + s.slice(1)
const className = (ns) => `Kun${pascal(ident(ns, 'namespace'))}Strings`

// Dart single-quoted literal. `$` starts an interpolation, so it is escaped
// even though no catalog uses one today — a future translation will.
const lit = (s) =>
  `'${s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n')}'`

const docOf = (ns, key) => {
  const doc = catalogs.find((c) => c.code === DOC_CATALOG) ?? base
  return doc.messages[ns][key]
}

// ── emit ────────────────────────────────────────────────────────────────────
const out = []
const w = (...lines) => out.push(...lines)

w(
  '// AUTO-GENERATED by packages/ui-core/scripts/gen-messages-flutter.mjs —',
  '// do not edit. Source: packages/ui-core/src/locale/*.json, the same',
  '// catalogs the web bundle resolves its strings from.',
  '',
  '/// Every user-visible string KunUI renders on its own — accessible names',
  '/// for icon-only controls, empty and loading states, and the handful of',
  '/// built-in button labels.',
  '///',
  '/// A widget parameter that sets the same text always wins over the catalog;',
  '/// the catalog is what the parameter falls back to.',
  'library;',
  ''
)

const namespaces = Object.keys(base.messages)

for (const ns of namespaces) {
  const keys = Object.keys(base.messages[ns])
  const plain = keys.filter((k) => params[`${ns}.${k}`].length === 0)
  const templated = keys.filter((k) => params[`${ns}.${k}`].length > 0)

  w(`/// Strings for \`Kun${pascal(ident(ns, 'namespace'))}\`.`)
  if (RENAMED[ns]) {
    w(
      `///`,
      `/// Reached as \`messages.${RENAMED[ns]}\`: the web namespace is`,
      `/// \`${ns}\`, which is a Dart reserved word.`
    )
  }
  w(`class ${className(ns)} {`, `  const ${className(ns)}({`)
  for (const k of keys) {
    w(params[`${ns}.${k}`].length ? `    required String ${ident(k, 'key')},` : `    required this.${ident(k, 'key')},`)
  }
  // dart format's shapes, reproduced so the published package is
  // format-clean without this repo's CI needing a Dart toolchain: one
  // initializer stays on the `})` line, two or more get an extra space before
  // the colon and align under it.
  if (templated.length === 1) {
    const k = ident(templated[0], 'key')
    w(`  }) : _${k} = ${k};`)
  } else if (templated.length) {
    const inits = templated.map((k) => `_${ident(k, 'key')} = ${ident(k, 'key')}`)
    w(`  })  : ${inits[0]},`, ...inits.slice(1).map((x, i) => `        ${x}${i === inits.length - 2 ? ';' : ','}`))
  } else {
    w('  });')
  }
  w('')
  for (const k of plain) {
    w(`  /// \`${DOC_CATALOG}\`: ${docOf(ns, k)}`, `  final String ${ident(k, 'key')};`, '')
  }
  for (const k of templated) {
    w(`  final String _${ident(k, 'key')};`, '')
  }
  for (const k of templated) {
    const names = params[`${ns}.${k}`].map((p) => ident(p, 'placeholder'))
    const sig = names.map((p) => `required Object ${p}`).join(', ')
    const body = names
      .map((p) => `.replaceAll('{${p}}', '\$${p}')`)
      .join('')
    // 80 columns, dart format's limit: it joins the body onto the signature
    // when the whole method fits and splits after `=>` when it does not.
    const head = `  String ${ident(k, 'key')}({${sig}}) =>`
    const tail = `_${ident(k, 'key')}${body};`
    w(
      `  /// \`${DOC_CATALOG}\`: ${docOf(ns, k)}`,
      ...(`${head} ${tail}`.length <= 80
        ? [`${head} ${tail}`]
        : [head, `      ${tail}`]),
      ''
    )
  }
  out[out.length - 1] = '}'
  w('')
}

w(
  '/// A complete KunUI message catalog.',
  '///',
  '/// ```dart',
  '/// const messages = KunMessages.zhCN;',
  '/// Semantics(label: messages.input.clear, child: …);',
  '/// Text(messages.pagination.page(page: 3));',
  '/// ```',
  '///',
  '/// A string with a `{placeholder}` is a method with required named',
  '/// parameters, not a field: the whole template is one string because a',
  '/// value moves position between languages, and requiring the parameters',
  '/// means a missing one is a compile error instead of a literal `{month}`',
  '/// in an accessibility label.',
  'class KunMessages {',
  '  const KunMessages({',
  '    required this.name,',
  '    required this.code,'
)
for (const ns of namespaces) w(`    required this.${ident(ns, 'namespace')},`)
w(
  '  });',
  '',
  '  /// Endonym, for a language switcher\'s own list (e.g. `简体中文`).',
  '  final String name;',
  '',
  '  /// BCP 47 tag. KunUI never picks a locale for you; this is what a',
  '  /// `KunDatePicker` resolves its calendar grid from when you do.',
  '  final String code;',
  ''
)
for (const ns of namespaces) {
  w(`  final ${className(ns)} ${ident(ns, 'namespace')};`, '')
}
for (const c of catalogs) {
  const field = c.code === 'zh-CN' ? 'zhCN' : ident(c.code, 'catalog')
  w(`  /// ${c.name} (\`${c.code}\`).`, `  static const KunMessages ${field} = KunMessages(`, `    name: ${lit(c.name)},`, `    code: ${lit(c.code)},`)
  for (const ns of namespaces) {
    w(`    ${ident(ns, 'namespace')}: ${className(ns)}(`)
    for (const k of Object.keys(base.messages[ns])) {
      w(`      ${ident(k, 'key')}: ${lit(c.messages[ns][k])},`)
    }
    w('    ),')
  }
  w('  );', '')
}
w(
  '  /// Every catalog this package ships, by BCP 47 code.',
  '  static const Map<String, KunMessages> byCode = {',
  ...catalogs.map((c) => `    ${lit(c.code)}: ${c.code === 'zh-CN' ? 'zhCN' : ident(c.code, 'catalog')},`),
  '  };',
  '}',
  ''
)

writeFileSync(DART_OUT, out.join('\n'))

const templated = basePaths.filter((p) => params[p].length).length
console.log(
  `gen-messages-flutter: ${namespaces.length} namespaces, ${basePaths.length} keys ` +
    `(${templated} templated), ${catalogs.length} catalogs → ${PUB_NAME}`
)
console.log(`(pub lockstep ok — ${PUB_NAME} ${pubVersion})`)
