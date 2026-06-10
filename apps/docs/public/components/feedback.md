# Feedback (反馈)

> 消息提示、确认弹窗与看板娘 —— useKunMessage / useKunAlert / useKunLoliInfo 及其 Provider。

## 示例

### Toast.vue

```vue
<template>
  <!-- useKunMessage is auto-imported; <KunMessageProvider/> is mounted once at
       the app root (see app.vue). -->
  <KunButton color="success" @click="useKunMessage('Saved!', 'success')">success</KunButton>
  <KunButton color="danger" @click="useKunMessage('Something failed', 'error')">error</KunButton>
  <KunButton color="warning" @click="useKunMessage('Careful…', 'warn')">warn</KunButton>
  <KunButton color="info" @click="useKunMessage('Heads up', 'info')">info</KunButton>
</template>
```

### Alert.vue

```vue
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
```

### Loli.vue

```vue
<template>
  <!-- useKunLoliInfo(message, durationSeconds); <KunLoliProvider/> is mounted
       once at the app root. -->
  <KunButton color="secondary" @click="useKunLoliInfo('莲: 你来啦~', 4)">
    Show mascot
  </KunButton>
</template>
```

---
本页来源 · KunUI · https://ui.kungal.com/components/feedback
