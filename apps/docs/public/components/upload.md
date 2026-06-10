# Upload (上传)

> 拖拽图片上传,内置裁剪。

## 示例

### Basic.vue

```vue
<template>
  <KunUpload
    :size="200"
    :aspect="1"
    hint="Drag & drop or click — crop to 1:1"
    class-name="w-48"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `aspect` * | `number` | — |
| `size` * | `number` | — |
| `className` | `string` | `""` |
| `hint` | `string` | `""` |
| `initialImage` | `string` | `""` |
| `rounded` | `KunUIRounded` | `undefined` |

---
本页来源 · KunUI · https://ui.kungal.com/components/upload
