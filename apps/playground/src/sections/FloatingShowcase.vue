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
      <KunTooltip text="Below the trigger" position="bottom">
        <KunButton variant="bordered">Hover (bottom)</KunButton>
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
      <KunPopover :auto-position="true">
        <template #trigger>
          <KunButton color="primary">Open popover</KunButton>
        </template>
        <div class="flex w-56 flex-col gap-2 p-4">
          <h4 class="font-semibold">Popover</h4>
          <p class="text-default-600 text-sm">
            Positioned with floating-ui. Click outside or press Esc to close.
          </p>
        </div>
      </KunPopover>
    </div>
  </section>
</template>
