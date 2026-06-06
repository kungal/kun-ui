<template>
  <KunButton color="primary" loading>Loading</KunButton>
  <KunButton color="primary" disabled>Disabled</KunButton>
  <!-- useKunMessage is auto-imported by the Nuxt layer; KunMessageProvider is
       mounted in app.vue. -->
  <KunButton color="primary" @click="useKunMessage('点击成功!', 'success')">
    Click me
  </KunButton>
</template>
