---
"@kungal/ui-vue": patch
---

fix(vue): Card header/footer, Tab item radius, Message elevation

- **KunCard** — the header slot no longer draws a `border-b`. The footer dropped
  its `bg-default-100` fill + double padding for a single hairline divider in the
  unified `border-kun` token (`-mt-3` pulls it flush under the content), so it
  matches the rest of the UI instead of looking like a grey block.
- **KunTab** — `solid` / `light` / `bordered` tab items were `rounded-kun-sm`
  (6px), half the radius of every other control. Items (and their sliding
  indicator) are now `rounded-kun-md` (12px, the default control radius) and the
  list container is `rounded-kun-lg` (16px), so the items nest concentrically and
  match the overall corner radius.
- **KunMessage** (toast) — added `shadow-lg` (and a `dark:ring-white/10` edge) so
  toasts read as elevated/floating above the page instead of sitting flat with
  only a faint hairline ring.
