# Kbd (按键)

> 键盘快捷键徽标:Mod 在 Apple 上显示 ⌘、其它平台显示 Ctrl,读屏器读键名而不是符号。

## 示例

### Basic.vue

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <KunKbd keys="Mod+K" />
    <KunKbd keys="Shift+Mod+Z" />
    <KunKbd keys="Alt+ArrowUp" />
    <KunKbd keys="Mod+Enter" />
    <KunKbd>Esc</KunKbd>
  </div>
</template>
```

### InText.vue

```vue
<template>
  <div class="text-default-700 space-y-2 text-sm">
    <p>
      按 <KunKbd keys="Mod+Enter" /> 发送，<KunKbd keys="Shift+Enter" /> 换行。
    </p>
    <p>在帖子列表里依次按 <KunKbd keys="G G" /> 回到顶部，按 <KunKbd keys="J" /> / <KunKbd keys="K" /> 切换上下一帖。</p>
    <p class="text-base">字号跟随正文：<KunKbd keys="Mod+Shift+P" /></p>
  </div>
</template>
```

### SearchTrigger.vue

```vue
<template>
  <KunButton variant="bordered" color="default" class-name="w-64 justify-between">
    <span class="flex items-center gap-2">
      <KunIcon name="lucide:search" />
      搜索游戏、话题、用户
    </span>
    <KunKbd keys="Mod+K" />
  </KunButton>
</template>
```

### Plain.vue

```vue
<template>
  <ul class="border-default-200 rounded-kun-lg w-64 divide-y divide-default-200 border text-sm">
    <li class="flex items-center justify-between px-3 py-2">
      撤销 <KunKbd keys="Mod+Z" variant="plain" />
    </li>
    <li class="flex items-center justify-between px-3 py-2">
      重做 <KunKbd keys="Mod+Shift+Z" variant="plain" />
    </li>
    <li class="flex items-center justify-between px-3 py-2">
      删除 <KunKbd keys="Mod+Backspace" variant="plain" />
    </li>
  </ul>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `keys` | `string` | `""` | Key combination, rendered for the viewer's platform: `+` joins a chord and a space separates a sequence (`'Mod+K'`, `'Shift+Delete'`, `'G G'`). `Mod` is ⌘ on Apple and Ctrl elsewhere; the server renders Ctrl and a Mac switches after mount. Screen readers hear key names, not glyphs. Without it, the default slot is shown as one key. |
| `variant` | `"keycap" \| "plain"` | `"keycap"` | `keycap` draws each key as a cap. `plain` is one line of muted text, the way a menu shows a shortcut: `⇧⌘Z` on Apple, `Ctrl+Shift+Z` elsewhere. |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `#default` | `any` | A single key written out, shown when `keys` is not set. |

---
本页来源 · KunUI · https://ui.kungal.com/components/kbd
