---
'@kungal/ui-vue': patch
---

修复 `defineModel` 回读导致的三处状态滞后：KunAutocomplete、KunTagInput、KunCheckBoxGroup

下游报了 KunAutocomplete 的 `@search` 事件带的是按键之前的值。查下来是同一个根因，而且还漏网了两处更严重的。

**根因。** `defineModel()` 返回的不是普通 ref。父组件绑了 `v-model` 时，赋值只会 `emit('update:modelValue')`，本地值要等父组件重渲染、props 回流之后才更新 —— 同一个 tick 内再读它，拿到的还是旧值。Vue 官方判定这是预期行为（vuejs/core#11832：“The new value will only be available after the parent has updated (on the next tick)”）。更容易踩坑的是它不对称：父组件只传 `:model-value` 而不绑 `v-model` 时，赋值走本地分支，读回来就是新值。消费者侧几乎总是绑 `v-model`，所以这三处 bug 全落在「正常用法」那一侧。

**实测（Chrome 152 / CDP，父组件绑 v-model）。**

| 组件 | 操作 | 修复前 | 修复后 |
|---|---|---|---|
| KunAutocomplete | 逐字输入 `key` | `@search` 依次为 `""`、`"k"`、`"ke"` | `"k"`、`"ke"`、`"key"` |
| KunAutocomplete | 首项 disabled 的列表里输入 `a` | 高亮落在第 2 行 `apricot`，回车提交 `apricot` | 高亮 `apple`，回车提交 `apple` |
| KunTagInput | 粘贴 `a,b,c`（`splitOnPaste` 默认开） | 只剩一个标签 `c`，但 `@add` 触发了 3 次 | 三个标签都在，`@add` 与 model 一致 |
| KunCheckBoxGroup | 依次点 A、B、A | `@change` 依次为 `[]`、`[a]`、`[a,b]`，永远慢一步 | `[a]`、`[a,b]`、`[b]` |

KunTagInput 那条最严重：`splitAndAdd` 每次循环都基于粘贴前的数组重建，所以只有最后一个分片留下来；`maxTags` 和查重也都是拿粘贴前的数组去比的。

**改法。** 事件载荷和内部判断一律用刚算出来的值，不再回读 model：`onInput` 用 `e.target.value`，过滤函数改成接受 query 参数，`toggleOption` / `tryAdd` 传显式的数组并把新数组一路串下去。这也是各家的通行写法 —— Reka UI 的 `ComboboxInput` 把 `event.target.value` 交给内部的 `filterSearch` ref、Element Plus autocomplete 的 `handleInput(value)` 两个 emit 都用同一个入参、Vant Search 的 `onInput = (value) => emit('update:modelValue', value)`、Zag combobox 发的是 `event.currentTarget.value`，没有一家会去读 model 的当前值。

无 API 变更。下游如果为了绕开 `@search` 滞后而改读自己的 v-model ref，可以继续那么写，也可以换回事件载荷 —— 两者现在一致。
