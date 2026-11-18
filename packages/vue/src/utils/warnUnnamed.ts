// A control with no accessible name is announced by its role alone. KunUI used
// to paper over that with English role words ('button', 'select', 'slider', …)
// as the aria-label, which said nothing a screen reader does not already say,
// hid the gap from axe and Lighthouse, and on KunButton overrode a correct
// name: an icon-only button with sr-only "Close" text computed as "button".
// Now the name is left absent and the gap is reported here instead, as React
// Aria's useLabel does. Dev-only via `process.env.NODE_ENV`, never
// `import.meta.env.DEV`, which Vite folds to `false` when it builds this
// package.
export const warnUnnamed = (component: string, el: Element | null | undefined) => {
  if (process.env.NODE_ENV === 'production') return
  if (!el) return

  const attr = (name: string) => el.getAttribute(name)?.trim()
  const named =
    attr('aria-label') ||
    attr('aria-labelledby') ||
    attr('title') ||
    ((el as HTMLInputElement).labels?.length ?? 0) > 0 ||
    (el.matches('button, a, [role="button"], [role="link"]') &&
      (el.textContent?.trim() ||
        el.querySelector('img[alt]:not([alt=""]), [aria-label]:not([aria-label=""])')))
  if (named) return

  console.warn(
    `[${component}] has no accessible name, so a screen reader announces only ` +
      `its role. Give it a visible \`label\`, or \`aria-label\` / ` +
      `\`aria-labelledby\` when there is none.`
  )
}
