<template>
  <!-- 当 count 超过 max 时，显示为 `max+`。 -->
  <KunBadge :count="8" :max="99">
    <KunButton variant="bordered">8</KunButton>
  </KunBadge>
  <KunBadge :count="120" :max="99">
    <KunButton variant="bordered">120 → 99+</KunButton>
  </KunBadge>
  <KunBadge :count="2000" :max="999" color="primary">
    <KunButton variant="bordered">2000 → 999+</KunButton>
  </KunBadge>
</template>
