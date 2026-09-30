<template>
  <div class="flex items-center gap-1">
    <KunTooltip text="搜索" shortcut="Mod+K">
      <KunButton variant="light" color="default" is-icon-only aria-label="搜索">
        <KunIcon name="lucide:search" />
      </KunButton>
    </KunTooltip>
    <KunTooltip text="引用" shortcut="Q">
      <KunButton variant="light" color="default" is-icon-only aria-label="引用">
        <KunIcon name="lucide:quote" />
      </KunButton>
    </KunTooltip>
    <KunTooltip text="撤销" shortcut="Mod+Z">
      <KunButton variant="light" color="default" is-icon-only aria-label="撤销">
        <KunIcon name="lucide:rotate-ccw" />
      </KunButton>
    </KunTooltip>
    <KunTooltip text="重做" shortcut="Mod+Shift+Z">
      <KunButton variant="light" color="default" is-icon-only aria-label="重做">
        <KunIcon name="lucide:rotate-cw" />
      </KunButton>
    </KunTooltip>
  </div>
</template>
