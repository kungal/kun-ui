# FadeCard (淡入卡片)

> 淡入淡出 + 展开收起的过渡容器。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const shown = ref(true)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="shown = !shown">Toggle</KunButton>
    <KunFadeCard>
      <KunCard v-if="shown" color="primary" class-name="max-w-sm">
        Fades + expands in / out
      </KunCard>
    </KunFadeCard>
  </div>
</template>
```

---
本页来源 · KunUI · https://ui.kungal.com/components/fadecard
