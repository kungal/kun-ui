<script setup lang="ts">
// Tooltip + Popover both use @floating-ui/vue for positioning (offset / flip
// / shift), Teleported to body.
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
  </section>
</template>
