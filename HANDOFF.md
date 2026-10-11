# HANDOFF.md — 项目交接说明

> 最后更新：2026-09-14（当前会话交接）
> 用途：当会话上下文快满时，用本文件 + DECISIONS.md + TODO.md + CHANGELOG.md 把全部关键信息固化到代码库，新会话只读本目录即可无缝接手。

## 1. 项目一句话简介

「小学生学习助手」（页面标题：**玥玥课后学习帮手（二年级）**）——面向小学二年级学生的课后练习 Web 应用：数学口算/乘除/应用题 + 语文（生字/词语/古诗）+ 英语（字母/单词/句型），答题赚星星 → 喂养虚拟宠物「星宝」，带家长统计面板。

## 2. 技术栈

- Node.js 20 · Vite 7.2.4 · React + TypeScript
- Tailwind CSS 3.4.19（shadcn 主题，`components.json` 已配置，40+ shadcn 组件可用）
- react-router（目前只有 `/` 一个路由）
- **无后端**：所有数据存浏览器 `localStorage`，key = `xingxing-math-v1`
- 音效：全部用 WebAudio 振荡器现场合成（无音频依赖）；英文发音用预录 mp3（`public/audio/en/*.mp3`）

## 3. 目录地图（相对项目根 `/mnt/agents/output/app`）

```
index.html            入口，页面标题「玥玥课后学习帮手（二年级）」
src/main.tsx          渲染入口
src/App.tsx           唯一路由 → Home
src/pages/Home.tsx    应用外壳：3 个底部 Tab（首页/星宝/家长）+ 练习覆盖层调度
src/sections/
  TodayHome.tsx       首页：今日任务卡片、连续打卡、薄弱点
  PetHouse.tsx        星宝宠物屋：喂食/改名等
  ParentZone.tsx      家长区：题量设置、音效开关、学习统计、数据重置
  PracticeSession.tsx 数字键盘题型会话（数学 3 个任务）
  ChoiceSession.tsx   选择题型会话（语文 3 个 + 英语 3 个任务）
src/components/
  CatPet.tsx          宠物猫形象（SVG/动画）
  Confetti.tsx        撒花庆祝组件
  SessionSummary.tsx  练习结算总结
  ui/                 shadcn 组件（按需使用）
src/lib/
  store.ts            ★ 核心：数据模型 + localStorage 持久化 + 打卡/星星/宠物逻辑 + 音效合成
  taskTypes.ts        任务定义类型（NumpadTask / ChoiceTask 联合）
  questions.ts        数学出题引擎 + ALL_TASKS + 每日轮换逻辑 getTodayTasks()
  chinese.ts          语文内容：生字/词语/古诗题库（含必背古诗 10 首，行 237-246 附近）
  english.ts          英语内容：字母/主题词汇/核心句型
  tts.ts              英文发音播放（优先本地 mp3）
  audioManifest.ts    本地音频清单
  utils.ts / chinese相关拼音工具
```

## 4. 核心状态模型（`store.ts`）

```
AppState {
  stars: number          // 可花费星星（喂宠物）
  totalStars: number     // 累计星星 → 决定宠物等级
  streak: number         // 连续打卡天数
  lastActiveDate: string
  records: QuestionRecord[]   // 最近 2000 条作答记录（滑窗截断）
  days: Record<string, DayLog> // 按天的题数/对数/完成任务列表
  pet: PetState { name('星宝'), fullness, happiness, lastFed, totalFed }
  settings: Settings { counts: 每任务题量, soundOn }
}
```

- 题量档位统一为 **5/10/15/20**，默认各 10；读取时 `snapTier` 吸附到最近档位
- 宠物等级：`PET_LEVELS = [0,20,60,120,220,360,560,840,1200,1700]`，共 10 级
- 喂食一次花费 5 星星，饱食度 +30、开心值 +25（上限 100）
- **旧版字段迁移**：`oralCount/multCount` → `counts.oral/counts.mult`（在 `loadState` 中，勿删）

## 5. 任务体系（9 个任务，id 固定）

| id | 学科 | 题型 | 标题 | 奖励星星 |
|---|---|---|---|---|
| oral | 数学 | numpad | 口算小达人（100以内加减） | 5 |
| mult | 数学 | numpad | 乘除法闯关（表内乘除） | 4 |
| word | 数学 | numpad | 应用题挑战 | 6 |
| zi | 语文 | choice | 生字小达人（看拼音选字·组词） | - |
| ci | 语文 | choice | 词语百宝箱（量词/近反义词） | - |
| shi | 语文 | choice | 古诗小诗人（必背 10 首） | - |
| letter | 英语 | choice | 字母乐园（26 字母） | - |
| eword | 英语 | choice | 单词小达人（主题词汇） | - |
| sent | 英语 | choice | 句子小达人（核心句型） | - |

每日轮换（`getTodayTasks()`）：oral 每天有；mult 与 word 隔天轮换；语文 3 选 2、英语 3 选 2，按 `dayIndex % 3` 轮换。**新增任务必须：① 在对应题库文件定义 TaskDef；② 加入 `ALL_TASKS`；③ 如需轮换改 `getTodayTasks`；④ `DEFAULT_COUNTS` 补默认题量。**

## 6. 会话结算流程（`Home.tsx finishSession`）

1. 每题 `recordAnswer`（记 records + days）
2. `completeTask`（任务 bonus 星星 + 记入今日完成任务）
3. 一次答对数额外 `+1 星/题`
4. `touchStreak` 打卡
5. `saveState` 自动持久化（`useEffect`）

## 7. 运行与验证

```bash
cd /mnt/agents/output/app
npm install   # 已装过可跳过
npm run dev   # 开发
npm run build && npm run preview  # 验证构建
```

## 8. 接手新会话的标准开场白

> 「读 HANDOFF.md / DECISIONS.md / TODO.md / CHANGELOG.md 和 src/lib/store.ts、src/lib/questions.ts，然后我们从 TODO.md 第 1 条开始。」

## 9. 四个交接文件的分工

- **HANDOFF.md**（本文件）：项目全貌、状态模型、任务体系、如何接手
- **DECISIONS.md**：已拍板的设计决策及原因，避免反复推翻
- **TODO.md**：待办清单，做完一条勾一条
- **CHANGELOG.md**：按日期记录每次改了什么
