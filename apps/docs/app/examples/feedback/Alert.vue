<script setup lang="ts">
// useKunAlert resolves to true (confirm) or false (cancel).
const confirm = async () => {
  const ok = await useKunAlert({
    title: 'Delete item?',
    message: 'This action cannot be undone.',
  })
  useKunMessage(ok ? 'Confirmed' : 'Cancelled', ok ? 'success' : 'info')
}
</script>

<template>
  <KunButton color="danger" @click="confirm">Confirm dialog</KunButton>
</template>
