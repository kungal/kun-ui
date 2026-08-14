# Divider (分割线)

> 横向或纵向分割线,可带居中标签。

## 示例

### Basic.vue

```vue
<template>
  <div class="w-full max-w-md">
    <p class="text-default-600 text-sm">第一部分内容</p>
    <KunDivider />
    <p class="text-default-600 text-sm">第二部分内容</p>
  </div>
</template>
```

### WithLabel.vue

```vue
<template>
  <div class="w-full max-w-md">
    <p class="text-default-600 text-sm">使用第三方账号登录</p>
    <KunDivider>或</KunDivider>
    <p class="text-default-600 text-sm">使用邮箱登录</p>
  </div>
</template>
```

### Vertical.vue

```vue
<template>
  <div class="flex h-10 items-center gap-3">
    <span class="text-default-600 text-sm">首页</span>
    <KunDivider orientation="vertical" />
    <span class="text-default-600 text-sm">文档</span>
    <KunDivider orientation="vertical" />
    <span class="text-default-600 text-sm">关于</span>
  </div>
</template>
```

### Dashed.vue

```vue
<template>
  <div class="w-full max-w-md">
    <p class="text-default-600 text-sm">实线分割线</p>
    <KunDivider border-style="solid" />
    <p class="text-default-600 text-sm">虚线分割线</p>
    <KunDivider border-style="dashed" />
  </div>
</template>
```

### Colors.vue

```vue
<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <KunDivider color="default" />
    <KunDivider color="primary" />
    <KunDivider color="secondary" />
    <KunDivider color="success" />
    <KunDivider color="warning" />
    <KunDivider color="danger" />
    <KunDivider color="info" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `borderStyle` | `"solid" \| "dashed"` | `"solid"` |
| `className` | `string` | `""` |
| `color` | `KunUIColor` | `"default"` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `withLabel` | `boolean` | `false` |

---
本页来源 · KunUI · https://ui.kungal.com/components/divider
