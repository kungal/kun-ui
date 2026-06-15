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
