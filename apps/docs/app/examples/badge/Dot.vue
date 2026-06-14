<template>
  <!-- variant="dot" 只显示一个小圆点，不显示数字。 -->
  <KunBadge variant="dot" color="success">
    <KunButton variant="bordered">状态</KunButton>
  </KunBadge>
  <KunBadge variant="dot" color="danger">
    <span class="border-kun inline-flex size-10 items-center justify-center rounded-kun-lg border">
      <KunIcon name="lucide:messages-square" class="text-xl" />
    </span>
  </KunBadge>
</template>
