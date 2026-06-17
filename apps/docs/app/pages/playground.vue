<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Per-route SEO (title/description from site.config → pageMeta['/playground']).
useKunSeoMeta()

interface Template {
  label: string
  code: string
}

// Starter templates. Each is a self-contained SFC that imports only from the
// three modules the playground allows (vue / @kungal/ui-vue / @kungal/ui-core).
// NOTE: composables like useKunMessage are auto-imported elsewhere in the docs,
// but playground code runs without that transform — so they're imported here.
const templates: Template[] = [
  {
    label: '按钮',
    code: `<script setup lang="ts">
import { ref } from 'vue'
import { useKunMessage } from '@kungal/ui-vue'

const count = ref(0)
<\/script>

<template>
  <div class="flex flex-col items-start gap-4">
    <div class="flex flex-wrap gap-3">
      <KunButton color="primary" @click="count++">点击 +1</KunButton>
      <KunButton color="secondary" variant="flat">Secondary</KunButton>
      <KunButton variant="bordered">Bordered</KunButton>
      <KunButton color="success" @click="useKunMessage('成功啦!', 'success')">
        弹出提示
      </KunButton>
    </div>
    <p class="text-default-600">已点击 {{ count }} 次</p>
  </div>
</template>
`,
  },
  {
    label: '表单',
    code: `<script setup lang="ts">
import { ref } from 'vue'
import type { KunSelectOption } from '@kungal/ui-vue'

const name = ref('')
const framework = ref('vue')
const agree = ref(false)
const options: KunSelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'solid', label: 'Solid' },
]
<\/script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <KunInput v-model="name" label="昵称" placeholder="输入你的名字" />
    <KunSelect v-model="framework" :options="options" label="框架" />
    <KunCheckBox v-model="agree">我同意条款</KunCheckBox>
    <KunButton color="primary" :is-disabled="!agree">提交</KunButton>
  </div>
</template>
`,
  },
  {
    label: '卡片',
    code: `<script setup lang="ts">
import { ref } from 'vue'

const liked = ref(false)
<\/script>

<template>
  <KunCard class-name="max-w-sm">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold">KunUI</h3>
        <p class="text-default-500 text-sm">专为 ACGN 设计的无头 UI 组件库</p>
      </div>
      <KunChip color="primary" variant="flat">v1.4</KunChip>
    </div>
    <div class="mt-4 flex gap-2">
      <KunButton
        size="sm"
        :color="liked ? 'danger' : 'default'"
        :variant="liked ? 'solid' : 'bordered'"
        @click="liked = !liked"
      >
        {{ liked ? '已喜欢 ♥' : '喜欢' }}
      </KunButton>
      <KunButton size="sm" variant="light">分享</KunButton>
    </div>
  </KunCard>
</template>
`,
  },
  {
    label: '反馈',
    code: `<script setup lang="ts">
import { useKunMessage, useKunAlert } from '@kungal/ui-vue'

const confirmDelete = async () => {
  const ok = await useKunAlert({
    title: '确认删除?',
    message: '此操作不可撤销。',
  })
  useKunMessage(ok ? '已删除' : '已取消', ok ? 'success' : 'info')
}
<\/script>

<template>
  <div class="flex flex-wrap gap-3">
    <KunButton color="success" @click="useKunMessage('已保存!', 'success')">成功提示</KunButton>
    <KunButton color="warning" @click="useKunMessage('请注意', 'warn')">警告提示</KunButton>
    <KunButton color="danger" @click="confirmDelete">确认弹窗</KunButton>
  </div>
</template>
`,
  },
]

const source = ref(templates[0]!.code)
const activeLabel = ref<string>(templates[0]!.label)

const loadTemplate = (t: Template) => {
  activeLabel.value = t.label
  source.value = t.code
}

onMounted(() => {
  // Handoff from a Demo's "在 Playground 中编辑" button (stashed source).
  const stashed = sessionStorage.getItem('kun-playground-source')
  if (stashed) {
    source.value = stashed
    activeLabel.value = ''
    sessionStorage.removeItem('kun-playground-source')
  }
})
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-2xl font-bold">Playground (在线试玩)</h1>
    <p class="text-default-600 mt-2 mb-6">
      直接在浏览器里编辑单文件组件,实时渲染 KunUI。只能从
      <code class="text-sm">vue</code>、<code class="text-sm">@kungal/ui-vue</code>、<code
        class="text-sm"
        >@kungal/ui-core</code
      >
      三个模块导入;所有组件已全局注册,可直接使用。
    </p>

    <!-- Starter templates -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <span class="text-default-400 text-xs">模板:</span>
      <KunButton
        v-for="t in templates"
        :key="t.label"
        size="sm"
        :variant="activeLabel === t.label ? 'solid' : 'flat'"
        :color="activeLabel === t.label ? 'primary' : 'default'"
        @click="loadTemplate(t)"
      >
        {{ t.label }}
      </KunButton>
    </div>

    <ClientOnly>
      <Playground v-model="source" height="500px" />
      <template #fallback>
        <div
          class="border-default-200 rounded-kun-lg bg-content1/40 flex items-center justify-center border text-sm text-default-400"
          style="height: 540px"
        >
          正在加载 Playground…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
