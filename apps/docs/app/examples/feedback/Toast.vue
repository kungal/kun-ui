<template>
  <!-- useKunMessage is auto-imported; <KunMessageProvider/> is mounted once at
       the app root (see app.vue). -->
  <KunButton color="success" @click="useKunMessage('Saved!', 'success')">success</KunButton>
  <KunButton color="danger" @click="useKunMessage('Something failed', 'error')">error</KunButton>
  <KunButton color="warning" @click="useKunMessage('Careful…', 'warn')">warn</KunButton>
  <KunButton color="info" @click="useKunMessage('Heads up', 'info')">info</KunButton>
</template>
