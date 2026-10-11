# TODO.md — 待办清单

> 规则：做完一条把 `[ ]` 改 `[x]` 并在 CHANGELOG.md 记一笔；新需求加在对应分区末尾。

## 近期（下一个迭代建议做）

- [ ] 交接验证：新会话按 HANDOFF.md 接手后跑一次 `npm run build`，确认四份文档与代码一致
- [ ] 语文/英语任务的 `bonus` 字段目前未在 HANDOFF 表格中填实值，核对 `chinese.ts`/`english.ts` 里的 bonus 并补全文档
- [ ] 检查 `public/audio/en/` 单词覆盖度是否跟 `english.ts` 词表一致（缺失的单词录音要补 mp3 或降级为浏览器 TTS）

## 功能增强（候选，按价值排序）

- [ ] 学习周报：把 `days` 聚合数据做成家长区 7 天趋势图（可用 shadcn chart 组件）
- [ ] 薄弱点"再练一次"按钮：从 `weakSkills()` 结果直接生成对应技能的专项练习
- [ ] 宠物饥饿/开心值随时间自然衰减（目前只有喂食增长，无衰减逻辑）
- [ ] 数据导出/导入 JSON（家长区），为换设备做准备
- [ ] 答错题的"错题本"视图（records 里 `firstTry=false` 的题）

## 技术债

- [ ] `Home.tsx` 里有一行 `<span className="hidden">{todayStr()}</span>`（143 行），疑似调试残留，确认后删除
- [ ] `src/App.tsx` 只有单路由，react-router 可简化；但若计划加"错题本/周报"页面则保留
- [ ] README.md 还是 Vite 模板默认内容，替换为项目真实说明
- [ ] `english.ts`/`chinese.ts` 题库数据与代码混在一个文件，体量大后可拆 `src/data/`
- [ ] 评估 records 滑窗 2000 条是否够用（见 DECISIONS.md D-06）

## 已搁置 / 明确不做

- [x] ~~上后端账号体系~~（D-01：明确不做，除非要跨设备同步）
