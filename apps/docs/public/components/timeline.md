# Timeline (时间线)

> 纵向时间线(KunTimeline + KunTimelineItem):彩色圆点或图标徽章 + 内容,纯 CSS 连线。

## 示例

### Basic.vue

```vue
<template>
  <KunTimeline class-name="max-w-md">
    <KunTimelineItem title="创建话题" time="3 天前">
      在「游戏讨论」板块发布了新话题。
    </KunTimelineItem>
    <KunTimelineItem title="收到回复" time="2 天前" color="success">
      有 5 位用户参与了讨论。
    </KunTimelineItem>
    <KunTimelineItem title="编辑内容" time="1 天前" color="warning">
      修订了正文并补充了截图。
    </KunTimelineItem>
    <KunTimelineItem title="置顶" time="刚刚" color="danger">
      话题被管理员置顶。
    </KunTimelineItem>
  </KunTimeline>
</template>
```

### Icons.vue

```vue
<template>
  <KunTimeline class-name="max-w-md">
    <KunTimelineItem icon="lucide:check" color="success" title="订单已确认" time="09:30" />
    <KunTimelineItem icon="lucide:upload" color="primary" title="已发货" time="14:20" />
    <KunTimelineItem icon="lucide:info" color="warning" title="运输中" time="次日">
      预计明天送达。
    </KunTimelineItem>
  </KunTimeline>
</template>
```

## Props

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `className` | `string` | `""` |

---
本页来源 · KunUI · https://ui.kungal.com/components/timeline
