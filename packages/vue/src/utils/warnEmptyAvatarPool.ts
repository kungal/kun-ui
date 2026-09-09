// A user with no avatar image renders `pickAvatarFallback(name, pool)`, and an
// empty pool makes that return the single bundled KUN_AVATAR_FALLBACK for every
// seed. Nothing throws and nothing 404s — the app just shows ONE identical
// avatar for what, in a community site, is most accounts.
//
// That is exactly how it shipped: 2.32.0 moved the pool out of the library into
// host config with a default of `[]`, and the KunUI docs site — the one app that
// dogfoods every release — ran a whole version with no pool configured, its own
// "sticker fallback" demo rendering Alice, Bob and Carol as three copies of the
// same picture. Nobody noticed until someone looked at the page. A silent
// degradation with a visible symptom and no signal is worth a dev warning.
//
// Warned once per process rather than per instance: a user list mounts dozens of
// avatars, and the message is about app configuration, not about any one of
// them. Dev-only via `process.env.NODE_ENV`, never `import.meta.env.DEV`, which
// Vite folds to `false` while building this package and would strip the warning
// out of the published bundle.
let warned = false

export const warnEmptyAvatarPool = () => {
  if (process.env.NODE_ENV === 'production') return
  if (warned) return
  warned = true

  console.warn(
    '[KunAvatar] rendering the fallback avatar for a user with no `avatar` ' +
      'image, but `avatarFallbackPool` is empty — so EVERY such user gets the ' +
      'same bundled image. Configure a pool of absolute image URLs: ' +
      '`installKunUIConfig(app, { avatarFallbackPool })`. See ' +
      'docs/INTEGRATION.md §7.1.'
  )
}
