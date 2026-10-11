// ===== 任务与题型共享类型 =====
import type { SkillTag, Settings } from './store';

export type Subject = '数学' | '语文' | '英语';

/** 数字键盘题（数学） */
export interface Question {
  id: string;
  skill: SkillTag;
  prompt: string;
  suffix: string;
  answer: number;
  hint: string;
  unit?: string;
}

/** 选择题（语文）：主展示 + 选项点选 */
export interface ChoiceQ {
  id: string;
  skill: SkillTag;
  main: string; // 大字展示：拼音 / 汉字 / 诗句 / 词语
  prompt: string; // 指令语
  sub?: string; // 补充说明（如古诗标题作者）
  choices: string[];
  answerIndex: number;
  hint: string;
  audio?: string; // 需要朗读的英文文本（显示 🔊 发音按钮）
  autoAudio?: boolean; // 进入此题时自动播放（听音题）
}

interface TaskBase {
  id: string;
  title: string;
  desc: string;
  gradVar: string;
  bonus: number;
  subject: Subject;
}

export interface NumpadTask extends TaskBase {
  kind: 'numpad';
  gen: (s: Settings) => Question[];
}

export interface ChoiceTask extends TaskBase {
  kind: 'choice';
  gen: (s: Settings) => ChoiceQ[];
}

export type TaskDef = NumpadTask | ChoiceTask;
