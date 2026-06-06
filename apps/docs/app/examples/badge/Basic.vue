<template>
  <KunBadge :count="5">
    <KunButton variant="bordered">Inbox</KunButton>
  </KunBadge>
  <KunBadge :count="120" :max="99" color="primary">
    <KunButton variant="bordered">Messages</KunButton>
  </KunBadge>
  <KunBadge variant="dot" color="success">
    <KunButton variant="bordered">Status</KunButton>
  </KunBadge>
</template>
