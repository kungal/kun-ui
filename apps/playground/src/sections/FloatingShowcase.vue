<script setup lang="ts">
// Tooltip + Popover both use @floating-ui/vue for positioning (offset / flip
// / shift), Teleported to body.

// Rail-style right-anchored hover flyouts — the downstream nav-rail case. Each
// tile opens a tall menu to its RIGHT; the bottom tiles sit low in the viewport,
// so flip()/shift()/size() must keep the menu on-screen (cap max-height + scroll)
// instead of overflowing the bottom edge.
const railGroups = [
  { icon: 'lucide:home', label: 'Home', items: ['Dashboard', 'Activity', 'Starred'] },
  { icon: 'lucide:folder', label: 'Projects', items: Array.from({ length: 18 }, (_, i) => `Project ${i + 1}`) },
  { icon: 'lucide:settings', label: 'Settings', items: ['Profile', 'Account', 'Appearance', 'Notifications', 'Security', 'Billing'] },
  { icon: 'lucide:ellipsis', label: 'Other', items: Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`) },
]
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Tooltip &amp; Popover (@floating-ui)</h2>

    <div class="flex flex-wrap items-center gap-4">
      <KunTooltip text="I'm a tooltip">
        <KunButton variant="bordered">Hover (top)</KunButton>
      </KunTooltip>
      <KunTooltip text="Below the trigger" position="bottom" :show-arrow="true">
        <KunButton variant="bordered">Hover (bottom, arrow)</KunButton>
      </KunTooltip>
      <KunTooltip>
        <KunButton variant="bordered" color="secondary">Rich content</KunButton>
        <template #content>
          <div class="flex items-center gap-2">
            <KunIcon name="lucide:info" class="text-primary" />
            <span>Slotted tooltip body</span>
          </div>
        </template>
      </KunTooltip>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <KunPopover :auto-position="true" :show-arrow="true">
        <template #trigger>
          <KunButton color="primary">Open popover</KunButton>
        </template>
        <div class="flex w-56 flex-col gap-2 p-4">
          <h4 class="font-semibold">Popover</h4>
          <p class="text-default-600 text-sm">
            Focus moves here on open; returns to the trigger on close.
          </p>
          <KunButton size="sm" color="primary" class-name="kun-pop-action">
            Focusable action
          </KunButton>
        </div>
      </KunPopover>
    </div>

    <!-- full-width: trigger anchor spans its container (needs a full-width trigger too) -->
    <div class="w-80 max-w-full rounded-kun-lg border-kun border border-dashed p-3">
      <p class="text-default-500 mb-2 text-xs">KunPopover full-width (in a 320px box)</p>
      <KunPopover full-width position="bottom-start">
        <template #trigger>
          <KunButton color="secondary" full-width>Full-width trigger ▾</KunButton>
        </template>
        <div class="w-64 p-4 text-sm">Panel content</div>
      </KunPopover>
    </div>

    <!-- Right-anchored hover flyouts (nav-rail case). The tall "Projects" /
         "Other" menus near the bottom must stay fully on-screen: right-start
         with autoPosition flips/shifts and size()-caps the height + scrolls. -->
    <div>
      <p class="text-default-500 mb-2 text-xs">
        Right-anchored hover flyout (position="right-start", tall menus near the
        bottom edge cap + scroll instead of clipping)
      </p>
      <div class="inline-flex flex-col gap-2 rounded-kun-lg border-kun border p-2">
        <KunPopover
          v-for="g in railGroups"
          :key="g.label"
          position="right-start"
          trigger="hover"
          group="rail-demo"
          :aria-label="g.label"
        >
          <template #trigger>
            <button
              class="hover:bg-default-100 flex size-10 items-center justify-center rounded-kun-md"
              :aria-label="g.label"
            >
              <KunIcon :name="g.icon" class="size-5" />
            </button>
          </template>
          <div class="w-52 p-1.5">
            <p class="text-default-500 px-2 py-1 text-xs font-medium">{{ g.label }}</p>
            <button
              v-for="it in g.items"
              :key="it"
              class="hover:bg-default-100 block w-full rounded-kun-sm px-2 py-1.5 text-left text-sm"
            >
              {{ it }}
            </button>
          </div>
        </KunPopover>
      </div>
    </div>
  </section>
</template>
