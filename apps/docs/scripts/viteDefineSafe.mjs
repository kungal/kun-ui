// Vite's `define` rewrites bundled JS by raw token match and does not stop at
// string boundaries — including the string literal a JSON import compiles to.
// So a generated payload that *names* one of Nuxt's define keys gets
// substituted along with real code.
//
// Measured on the 2.27.0 release: a changelog entry containing
// `process.env.NODE_ENV` became `"production"` inside the JSON string, whose
// injected quotes ended the string early, and the whole /changelog route died
// during prerender with `Expected ',' or '}' after property value in JSON at
// position 3632`. `import.meta.env.DEV` is quieter and worse — it folds to
// `false` and silently rewrites the sentence.
//
// Breaking the FIRST dot is enough: the token no longer matches any define key,
// and nothing after it can start one either.
const DEFINE_TOKEN =
  /\b(process|import)\.(?=(env|meta|client|server|dev|browser)\b)/g

/** For an HTML payload (rendered with `v-html`): `&#46;` renders as a dot. */
export const escapeDefineTokens = (html) => html.replace(DEFINE_TOKEN, '$1&#46;')

/**
 * For a PLAIN-TEXT payload, where an entity would show up literally. Returns
 * the offending tokens so the generator can refuse rather than ship a sentence
 * the bundler will rewrite.
 */
export const findDefineTokens = (text) =>
  (String(text ?? '').match(/\b(?:process|import)\.(?:env|meta|client|server|dev|browser)\b/g) ?? [])
