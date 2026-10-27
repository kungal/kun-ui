import type { KunUser } from '@kungal/ui-vue'

export interface DemoTopic {
  id: number
  title: string
  user: KunUser
  replies: number
}

const users: KunUser[] = [
  { id: 0, name: '鲲' },
  { id: 0, name: '雪之下' },
  { id: 0, name: '千恋万花' },
  { id: 0, name: '星空列车' },
]

const titles = [
  '《白色相簿2》全线路通关后的一点感想',
  '求推荐剧情向、节奏慢一点的纯爱作品',
  '新人第一次玩 Galgame,该从哪部开始?',
  '《樱之诗》和《樱之刻》应该按什么顺序玩',
  '分享一下自己整理的汉化补丁安装步骤',
  '今年秋季新作里最期待哪一部?',
  '《素晴日》的结局到底该怎么理解',
  '有没有适合在通勤路上玩的短篇推荐',
  '关于存档迁移到新电脑的问题',
]

export const demoTopicPage = (page: number): DemoTopic[] =>
  Array.from({ length: 3 }, (_, i) => {
    const n = (page - 1) * 3 + i
    return {
      id: n + 1,
      title: titles[n % titles.length]!,
      user: users[n % users.length]!,
      replies: (n * 37) % 120 + 3,
    }
  })
