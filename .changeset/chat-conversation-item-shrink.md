---
'@kungal/ui-vue': patch
---

`KunChatConversationItem` keeps its height in a scrolling flex column. The row clips its swipe actions with `overflow: hidden`, which makes it a scroll container, and a flex item that is a scroll container gets an automatic minimum height of 0 (CSS Flexbox §4.5). In a `flex flex-col overflow-y-auto` list, the layout KunUI's own chat demo uses, a long conversation list shrank its rows instead of scrolling. moyu's 41 conversations came out about 17px each, with their contents overlapping. The row now sets `flex-shrink: 0` as an inline style. Measured in Chromium with 45 conversations in a 448px column: rows were 6.26px each before and 64px each now, and the list scrolls (scroll height 3046px). A site that already added `class="shrink-0"` at the call site, as moyu, letmoe and the kungal forum did, is unaffected, and it can remove that class now.
