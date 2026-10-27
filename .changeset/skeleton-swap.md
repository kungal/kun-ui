---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

New `KunSkeletonSwap`: a region-level switch between a skeleton and the real content, for pages that fetch without `await` in setup and so render while their data is still loading on client-side navigation. `KunSkeleton` stays the single placeholder block you build the skeleton from; nothing about it changes.

```vue
<KunSkeletonSwap :loading="pending">
  <TopicList :topics="data" />
  <template #skeleton><TopicListSkeleton /></template>
</KunSkeletonSwap>
```

- **No flash for fast loads.** The skeleton shows only after `loading` has lasted `delay` (default 150 ms), and once shown it stays at least `minDuration` (default 300 ms, React's fallback throttle), so a response arriving just after it appeared does not blink it off again.
- **No jump when it arrives.** With no content yet, the skeleton is laid out invisibly during the delay, so the page already has its shape when it fades in. The two layers share one grid cell and crossfade (motion-safe only); there is no positioning and no `z-index`, so a region never paints outside its own box.
- **Reloading existing content.** Through the delay the previous content stays as it is and stays interactive: making it inert would drop the focus of the control that started the load on every fast refetch. Once the skeleton takes over, the old content fades out inert. The default slot therefore keeps rendering during a reload and must render from the previous data.
- **Server rendering.** `loading` false at creation renders the content directly, with no skeleton phase and no fade, so a server render that waited for its data hydrates without a flash. A server render that is still loading shows the skeleton at once, since it cannot wait out a delay; hydration matches it.
- **Accessibility.** The root is a real `div` with `aria-busy="true"` while loading; the skeleton layer is `aria-hidden` and `inert`. Add `aria-live="polite"` yourself on a region small enough to be announced. Do not add it to a whole page.
- The root's `display` is an inline grid, so a display class on it has no effect; lay the content out inside the slots.

The schedule is `nextKunSkeletonSwap` / `initialKunSkeletonSwap` in `@kungal/ui-core`, pure and tested, so the Flutter port shows and hides its skeleton at the same moments.
