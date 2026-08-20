// `rel` for the components that render a link with a `target` (KunLink,
// KunButton). Both used to UNION the caller's tokens with `noopener
// noreferrer`, so `noreferrer` could be added but never removed. Downstream
// (kungal forum) hit the consequence: `noreferrer` strips the `Referer`
// header, so a partner's analytics counted every click arriving from the forum
// as direct traffic — and being a referral was the term of the partnership.
// Only `noopener` closes the tabnabbing hole; `noreferrer` is a privacy
// default, so it has to be replaceable.
//
// The caller's `rel` therefore REPLACES the default instead of adding to it,
// which is also what NuxtLink does — the component KunLink renders under the
// Nuxt layer — so the two no longer disagree about the same prop:
//
//   firstNonUndefined(props.noRel ? '' : props.rel, options.externalRelAttribute,
//     (isAbsoluteUrl.value || hasTarget.value) ? 'noopener noreferrer' : '')
//
//   rel unset      + target="_blank"  →  "noopener noreferrer"
//   rel="noopener" + target="_blank"  →  "noopener"
//   rel="nofollow" + target="_blank"  →  "nofollow noopener"
//   rel="opener"   + target="_blank"  →  "opener"   (the spec's opt-back-in)
//   rel=""         + target="_blank"  →  no rel attribute (NuxtLink's `no-rel`)
export const resolveExternalRel = (
  rel: string | undefined,
  isBlank: boolean
): string | undefined => {
  if (rel === undefined) return isBlank ? 'noopener noreferrer' : undefined
  const parts = new Set(rel.split(/\s+/).filter(Boolean))
  // Checked before `noopener` is added back, so an explicit empty string stays
  // the "no rel at all" escape hatch instead of collapsing to "noopener".
  if (!parts.size) return ''
  if (isBlank && !parts.has('opener')) parts.add('noopener')
  return [...parts].join(' ')
}
