# Content (内容)

> 渲染可信 HTML(支持剧透与内联图片灯箱)。不做 sanitize —— 不可信 HTML 请自行处理。

## 示例

### Basic.vue

```vue
<script setup lang="ts">
// Trusted, author-written HTML. For user/untrusted HTML, sanitize it yourself
// first (e.g. DOMPurify) — KunContent does NOT sanitize.
const html =
  '<h3>Rich content</h3><p>KunContent renders trusted HTML, with <strong>spoiler</strong> and inline-image lightbox support.</p>'
</script>

<template>
  <KunContent :content="html" />
</template>
```

### Typography.vue

```vue
<script setup lang="ts">
// 完整排版示例:标题层级、段落、引用、列表、行内/块代码、表格、分割线、链接。
// KunContent 把(受信的)HTML 渲染进 .kun-prose,套用大气编辑式排版。
const html = `
<h1>排版:一门隐形的艺术</h1>
<p>好的排版应当<strong>克制而有节奏</strong>。当它做得足够好时,读者甚至不会注意到它的存在,只会觉得"这篇文章读起来很舒服"。本页用一段示例内容展示 <a href="https://ui.kungal.com">KunContent</a> 的 Markdown 排版。</p>
<h2>层级与节奏</h2>
<p>标题与正文之间保持清晰的对比与<em>呼吸感</em>:标题的上间距明显大于下间距,从而和紧随其后的内容自然成组。正文行高 1.8,对中文与中西混排都更友好。</p>
<blockquote><p>字体排印的最高境界,是让文字本身退后一步,把舞台让给意义。</p></blockquote>
<h3>列表</h3>
<ul>
  <li>无序列表项,用于并列的要点</li>
  <li>支持嵌套:
    <ul><li>次级要点一</li><li>次级要点二</li></ul>
  </li>
  <li>列表项之间有舒适的间距</li>
</ul>
<ol>
  <li>有序步骤:先确定测量(每行字符数)</li>
  <li>再调行高与段间距</li>
  <li>最后打磨标题比例</li>
</ol>
<h3>代码</h3>
<p>行内代码如 <code>const kun = createKunUI()</code>,与正文区分但不喧宾夺主;块级代码用于成段展示:</p>
<pre><code>function greet(name) {
  // 一句问候
  return \`你好,\${name}!\`
}</code></pre>
<h3>表格</h3>
<table>
  <thead><tr><th>组件</th><th>用途</th><th>关键特性</th></tr></thead>
  <tbody>
    <tr><td>KunContent</td><td>渲染受信富文本</td><td>剧透 · 灯箱 · 排版</td></tr>
    <tr><td>KunMarkdown</td><td>Markdown 字形</td><td>内联 SVG</td></tr>
    <tr><td>KunLightbox</td><td>图片查看器</td><td>缩放 · 旋转 · 飞散</td></tr>
  </tbody>
</table>
<hr />
<p>分割线之上是正文的结尾。按 <kbd>Esc</kbd> 可关闭大多数浮层。</p>
`
</script>

<template>
  <KunContent :content="html" />
</template>
```

### Spoiler.vue

```vue
<script setup lang="ts">
// 剧透:在受信任的 HTML 中,用 class="kun-spoiler kun-spoiler-hidden" 包裹
// 需要遮挡的内容,KunContent 会按文字形状(逐行、逐词按空格分隔)加上粒子
// 遮罩,点击即可揭示。
const html =
  '<p>剧透警告:<span class="kun-spoiler kun-spoiler-hidden">凶手其实是管家</span>(点击揭示)。</p>' +
  '<p>English: <span class="kun-spoiler kun-spoiler-hidden">the butler did it in the library</span> (click to reveal — each word is masked separately).</p>'
</script>

<template>
  <KunContent :content="html" />
</template>
```

### LongSpoiler.vue

```vue
<script setup lang="ts">
// 超长多段剧透:用块级 <div class="kun-spoiler kun-spoiler-hidden"> 把一整段
// 多自然段内容包起来,整块被磨砂噪声遮罩盖住,点击任意位置揭示。大面积下
// 噪声抖动更明显。
const html = `
<p>以下是完整剧情走向,涉及关键剧透(点击展开):</p>
<div class="kun-spoiler kun-spoiler-hidden">
  <p>故事开篇,主角在一座被常年浓雾笼罩的海港小镇醒来,失去了过去三年的全部记忆。他唯一记得的,是一枚刻着陌生纹章的铜质怀表,以及一个反复出现在梦里的、背对着他的白衣少女的身影。镇上的人对他异常熟络,仿佛他从未离开过,这种熟悉感却让他遍体生寒。</p>
  <p>随着调查深入,他发现镇上每个居民都在隐瞒同一件事:三年前的那场大火。所有记录都被人为抹去,教堂的地下室里藏着一本写满名字的册子,而他自己的名字,赫然被一道墨线划去。怀表在靠近灯塔时会无端发烫,指针逆向转动,像是在指引,又像是在警告。</p>
  <p>真正的转折发生在第二幕:那位白衣少女并非梦境的产物,而是他亲手送走的妹妹。三年前的大火不是意外,而是他为了销毁某个足以颠覆整座小镇的秘密,亲自点燃的。失忆不是创伤的结果,而是他向镇上的“守夜人”交换来的——用记忆换取妹妹活下去的机会。</p>
  <p>而那枚怀表,是契约的信物。当指针归零的那一刻,被交换的记忆会连本带利地归还,代价则是,他必须替代守夜人,永远留在这座小镇,维持浓雾不散。所谓的“守夜人”,正是历代做出同样选择的人,一个接一个,困在循环里。</p>
  <p>结局有两条分支。其一,他选择再次遗忘,把怀表埋回灯塔之下,雾散人安,小镇恢复平静,但下一个失忆者将在某个清晨醒来,重复他的命运。其二,他砸碎怀表,直面归还的全部记忆与随之而来的崩塌,雾彻底散去,小镇暴露在真相之下,而他与妹妹得以并肩走出港口——代价是,这里的一切都将不复存在。</p>
  <p>游戏在最后一个镜头停在那枚停摆的怀表上,表盖内侧刻着一行小字:“记得的人,才是被困住的人。”至此,标题的双关含义才真正揭晓。</p>
</div>
<p>(点击上方区块即可揭示;再长的段落也会被整块遮住。)</p>
`
</script>

<template>
  <KunContent :content="html" />
</template>
```

### Lightbox.vue

```vue
<script setup lang="ts">
// 内联图片灯箱:KunContent 内任意 <img> 都会自动接入 KunLightbox,
// 点击图片即可放大查看(多张图片可左右切换),无需额外接线。
// 这里用离线 data-URI 图片,demo 不需要联网。
const swatch = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/></svg>`
  )}`

const html = `<p>点击任意图片打开灯箱(可左右切换):</p><div style="display:flex;gap:8px;flex-wrap:wrap"><img src="${swatch('#7c3aed', '#ec4899')}" alt="渐变 1" style="width:120px;border-radius:8px" /><img src="${swatch('#0ea5e9', '#22c55e')}" alt="渐变 2" style="width:120px;border-radius:8px" /></div>`
</script>

<template>
  <KunContent :content="html" />
</template>
```

### BlurUp.vue

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// 正文里的图片是后端 markdown 渲染成的原始 <img>(经 v-html 注入,不是组件)。
// KunContent 内部会自动给带 data-thumbhash 的正文图加模糊占位:把解码出的 ThumbHash
// 画成图片自身的背景,真实图片加载完成后清除——零 DOM 改动,和灯箱/剧透共存。
// width/height 让浏览器原生按比例预留空间(消除加载抖动);两者都由后端随图一起吐出。
const key = ref(0)
const reload = () => (key.value += 1)

const html = computed(
  () =>
    '<p>后端把图片的宽高与 ThumbHash 直接写进标签,正文图便和封面一样享受占位:</p>' +
    `<img src="/banner.webp?c=${key.value}" width="1920" height="1080" loading="lazy" data-thumbhash="eBeCA4AmyAaYeIcLy20KVwg3inaCelc=" alt="banner" />` +
    '<p>宽高让浏览器按比例预留空间(不再加载跳动),ThumbHash 提供加载前的模糊预览。</p>'
)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <KunButton size="sm" variant="bordered" @click="reload">重新加载</KunButton>
    <KunContent :key="key" :content="html" class-name="max-w-md" />
  </div>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` * | `string` | — | Rendered with v-html — the caller MUST pass trusted/pre-sanitized HTML (KunUI does not sanitize; see docs/architecture.md). |
| `className` | `string` | `""` |  |
| `compact` | `boolean` | `false` | Tighter density for comment / reply streams (adds `.kun-prose-compact`). Visual effect requires importing `@kungal/ui-vue/prose.css`. |

---
本页来源 · KunUI · https://ui.kungal.com/components/content
