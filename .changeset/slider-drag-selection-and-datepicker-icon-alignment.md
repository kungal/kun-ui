---
'@kungal/ui-vue': patch
---

修复 KunSlider 拖动时会选中页面文字，以及 KunDatePicker / KunSelect / KunRating / KunCommandPalette 中纯图标按钮的图标未垂直居中。

**KunSlider — 拖动会选中别处的文字**

滑块的 `mousedown` / `touchstart` 是 passive 监听，永远调不到 `preventDefault()`，
浏览器于是照常从按下点开始拉一段原生选区：鼠标不在圆点上（在圆点上也一样）随便甩两下，
页面上其它段落、标签、数值就被整片选中了。

修法是 CSS，不是 JS：滑轨容器上加 `user-select: none` 与 `touch-action: none`。
这与 shadcn/ui 在 Slider 根节点上写 `touch-none select-none`、Radix / Reka 在
`pointerdown` 里 `preventDefault()` 是同一条思路；react-aria 的 `disableTextSelection`
更直接写明「只给按下的元素加 user-select 挡不住相邻元素被选中」，正是这次反馈的现象。

两条声明按本仓库的规矩写成 inline `style` 而非工具类——`dist/style.css` 不含任何工具类，
工具类要靠消费端 Tailwind 扫描 `dist/index.js` 再生成，可能被漏掉；行内样式不会。

`touch-action: none` 同时修掉了一个附带问题：以前在移动端按住滑块上下滑，
页面会跟着一起滚动。标签与数值文本在滑轨容器之外，仍可正常选中复制。

**KunDatePicker / KunSelect — 清除按钮比尾部图标高约 2px**

清除按钮是块级的，里面只有一个 `<svg>`。`<svg>` 是 inline-block，坐在行盒的文字基线上，
行盒的 strut 在基线下方还留着降部空间，图标因此被顶到按钮盒子中心线的上方；
外层 `items-center` 居中的是按钮，不是图标，于是它比旁边的日历图标 / 箭头高出一截。

按钮改为 `flex items-center`（与 KunInput、KunAutocomplete 一致），图标即被真正居中。

KunDatePicker 另外两处一并对齐：清除图标原本固定 16px，而日历图标是 1em、随控件尺寸缩放，
xs 下 16px 对 12px 明显一大一小——现在两者都用 1em；按钮的 `p-1` 还把整个触发器撑高了 8px，
同尺寸下比 KunSelect / KunInput 高一截，现在以负外边距抵消内边距，既保住点按热区又不再撑高。

实测（Chrome 151）：md 尺寸触发器高度 45.6px → 37.6px，与 KunSelect 的 37.6px 一致；
xs–xl 五档清除图标与日历图标的中心线偏差由 -1.64 ~ +0.25px 全部归零，热区 24×24 起。

**同一根因的其余四处**

顺着这条线把 71 个 SFC 里 18 个「只装一个图标的 button」全部量了一遍，
除上面两处外还有三处中招（KunTab 的两个滚动按钮本来就是 `inline-flex`，误报）：

- **KunRating** —— 偏差 **-2.20px**，是全库最大的一处：星星按钮是块级的，
  整排星星因此比旁边的评分文字（「4.5 · 120 条评价」这类写法）高出 2px。修后归零，
  星排高度 24.4px → 20px，与图标本身一致。
- **KunCommandPalette** 关闭按钮 -0.40px、**KunSelect** 多选标签上的移除按钮 -0.49px ——
  都在亚像素级，肉眼看不出来，但根因相同：谁哪天把图标调大一档，偏差就跟着放大。
  一并改成 `flex items-center` 收口。

拖动选中文字这条线也一并排查了：KunScrollShadow（`draggable`）会在 6px 判定阈值之前
起一个 1 字符的选区，拖动中被 `user-select: none` 收起、松手后又恢复，属于痕迹级；
KunMessageItem（吐司滑动关闭）、KunLightbox、useKunSwipeDismiss（抽屉/弹窗下拉关闭）、
KunCarousel 实测均无此问题——它们各自用 `setPointerCapture`、`touch-none` +
`draggable="false"`、非 passive `touchmove` + `preventDefault()`、原生 scroll-snap 挡住了。
