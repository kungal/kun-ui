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

### SizeAspect.vue

```vue
<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="w-40">
      <KunUpload :size="200" :aspect="1" description="正方形 1:1" />
    </div>
    <div class="w-56">
      <KunUpload :size="400" :aspect="16 / 9" description="宽幅 16:9" />
    </div>
  </div>
</template>
```

### Rounded.vue

```vue
<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="w-40">
      <KunUpload :size="200" :aspect="1" rounded="full" description="圆形头像" />
    </div>
    <div class="w-40">
      <KunUpload
        :size="200"
        :aspect="1"
        rounded="lg"
        initial-image="https://avatars.githubusercontent.com/u/106518268"
        description="带默认图片"
      />
    </div>
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `aspect` * | `number` | — |
| `size` * | `number` | — |
| `className` | `string` | `""` |
| `description` | `string` | `""` |
| `hint` | `string` | `""` |
| `initialImage` | `string` | `""` |
| `rounded` | `KunUIRounded` | — |

---
本页来源 · KunUI · https://ui.kungal.com/components/upload
