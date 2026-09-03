---
'@kungal/ui-vue': patch
---

修复输入法(IME)组合期间回车/方向键被组件抢走,并给 KunCommandPalette 补上「回车提交查询」的出口。

**输入法组合期误触发(KunCommandPalette / KunAutocomplete / KunSelect[searchable])**

用 Chrome 152.0.7977.8 经 CDP `Input.imeSetComposition` 实测:拼音还没上屏时,用来选中候选词的那个回车会以普通 `keydown` 送到页面 —— `key: 'Enter'`、`keyCode: 13`、`isComposing: true`。三个组件的键盘处理都没有过滤它,于是:

- 命令面板:打「sousuo」按回车上屏,面板直接选中高亮项并关闭,输入框里还留着未上屏的 `sousuo`;
- KunAutocomplete:组合中的 `app` 被回车确认成了选项 `apple`;
- 可搜索的 KunSelect:组合「xuan」按回车,值被填成了「选项甲」。

方向键同理 —— 翻候选词的 ↑↓ 会同时移动列表高亮。

现在这三个组件的 keydown 在 `e.isComposing || e.keyCode === 229` 时直接放行(229 是不支持 `isComposing` 的老引擎上的等价信号)。cmdk、Zag 的 combobox、Reka 的 ListboxRoot 都有同一道守卫,本仓库的 KunTagInput 早就有(`respectComposition`),这次只是补齐其余三个。**中文/日文/韩文输入下这是每天都会撞到的行为,建议下游一并升级。**

**KunCommandPalette 新增 `@submit`**

面板本身不含搜索逻辑,此前回车只有一条路径:选中高亮项。没有可选中的结果时(无结果,或结果全部 `disabled`),回车照样被 `preventDefault` 吃掉却什么也不做 —— 是一个死键。

现在:回车落在真实结果上时行为不变,照常 `@select`;**没有可选中的结果**时改为触发 `@submit`,带上 `query.trim()`,并且不再吞掉这个按键。

```vue
<KunCommandPalette v-model:open="open" v-model:query="query" :items="items"
  @select="go" @submit="(q) => navigateTo(`/search?q=${encodeURIComponent(q)}`)">
  <template #no-result="{ query }">
    <p class="text-default-400 text-xs">按 ↵ 全站搜索「{{ query }}」</p>
  </template>
</KunCommandPalette>
```

有结果时也要提交原始查询的场景,**继续把动作项排在第 0 位**当成一条普通结果 —— cmdk(`forceMount`)、GitHub、Linear 都是这么做的,好处是这个动作看得见、能用鼠标点,而不是一个只有键盘用户才发现得了的隐藏行为。所以我们没有引入 Zag 那种 `alwaysSubmitOnEnter`:让回车永不选中会破坏命令面板的核心键盘约定。

纯新增,没有破坏性变更。
