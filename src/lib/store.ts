// ===== 数据模型与本地持久化（数据保存在本浏览器 localStorage）=====

export type SkillTag = '进位加法' | '退位减法' | '乘法口诀' | '表内除法' | '应用题' | '生字' | '拼音' | '词语' | '古诗' | '字母' | '单词' | '句型';

export type TaskId = string;

export interface QuestionRecord {
  date: string; // YYYY-MM-DD
  skill: SkillTag;
  correct: boolean; // 最终是否答对
  firstTry: boolean; // 是否一次答对
  timeMs: number;
}

export interface DayLog {
  questions: number;
  correct: number;
  tasksCompleted: TaskId[];
}

export interface PetState {
  name: string;
  fullness: number; // 0-100 饱食度
  happiness: number; // 0-100 开心值
  lastFed: string; // 日期
  totalFed: number;
}

export interface Settings {
  counts: Record<string, number>; // 各板块题量（key 为任务 id）
  soundOn: boolean;
}

/** 题量档位（统一 5/10/15/20），各板块默认 10 */
export const COUNT_TIERS = [5, 10, 15, 20];
export const DEFAULT_COUNTS: Record<string, number> = {
  oral: 10, mult: 10, word: 10,
  zi: 10, ci: 10, shi: 10,
  letter: 10, eword: 10, sent: 10,
};

/** 把数值吸附到最近的题量档位 */
const snapTier = (n: number): number =>
  COUNT_TIERS.reduce((best, t) => (Math.abs(t - n) < Math.abs(best - n) ? t : best), COUNT_TIERS[0]);

export interface AppState {
  stars: number; // 可花费星星
  totalStars: number; // 累计星星（决定宠物等级）
  streak: number; // 连续打卡天数
  lastActiveDate: string;
  records: QuestionRecord[];
  days: Record<string, DayLog>;
  pet: PetState;
  settings: Settings;
}

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const KEY = 'xingxing-math-v1';

export const defaultState = (): AppState => ({
  stars: 0,
  totalStars: 0,
  streak: 0,
  lastActiveDate: '',
  records: [],
  days: {},
  pet: { name: '星宝', fullness: 80, happiness: 80, lastFed: todayStr(), totalFed: 0 },
  settings: { counts: { ...DEFAULT_COUNTS }, soundOn: true },
});

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const saved = parsed.settings || {};
    // 旧版本字段迁移：oralCount/multCount → counts.oral/counts.mult
    const counts = { ...DEFAULT_COUNTS, ...(saved.counts || {}) };
    if (typeof saved.oralCount === 'number' && !saved.counts?.oral) counts.oral = saved.oralCount;
    if (typeof saved.multCount === 'number' && !saved.counts?.mult) counts.mult = saved.multCount;
    // 所有题量吸附到统一档位（5/10/15/20）
    for (const k of Object.keys(counts)) counts[k] = snapTier(counts[k]);
    return {
      ...defaultState(),
      ...parsed,
      pet: { ...defaultState().pet, ...parsed.pet },
      settings: { counts, soundOn: saved.soundOn !== false },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(s: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* 存储满或隐私模式下静默失败 */
  }
}

/** 打卡：返回更新后的 streak */
export function touchStreak(s: AppState): AppState {
  const today = todayStr();
  if (s.lastActiveDate === today) return s;
  const yesterday = new Date(Date.now() - 86400000);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const streak = s.lastActiveDate === yStr ? s.streak + 1 : 1;
  return { ...s, streak, lastActiveDate: today };
}

/** 记录一题作答 */
export function recordAnswer(s: AppState, rec: QuestionRecord): AppState {
  const day = s.days[rec.date] ?? { questions: 0, correct: 0, tasksCompleted: [] };
  const next: DayLog = {
    ...day,
    questions: day.questions + 1,
    correct: day.correct + (rec.correct ? 1 : 0),
  };
  return { ...s, records: [...s.records.slice(-2000), rec], days: { ...s.days, [rec.date]: next } };
}

/** 完成任务：奖励星星 */
export function completeTask(s: AppState, task: TaskId, bonus: number): AppState {
  const today = todayStr();
  const day = s.days[today] ?? { questions: 0, correct: 0, tasksCompleted: [] };
  const tasksCompleted = day.tasksCompleted.includes(task) ? day.tasksCompleted : [...day.tasksCompleted, task];
  return {
    ...s,
    stars: s.stars + bonus,
    totalStars: s.totalStars + bonus,
    days: { ...s.days, [today]: { ...day, tasksCompleted } },
  };
}

// ===== 宠物 =====
export const PET_LEVELS = [0, 20, 60, 120, 220, 360, 560, 840, 1200, 1700];

export function petLevel(totalStars: number): number {
  let lv = 1;
  for (let i = 0; i < PET_LEVELS.length; i++) if (totalStars >= PET_LEVELS[i]) lv = i + 1;
  return Math.min(lv, PET_LEVELS.length);
}

export function petLevelProgress(totalStars: number): { cur: number; next: number; pct: number } {
  const lv = petLevel(totalStars);
  const cur = PET_LEVELS[lv - 1];
  const next = PET_LEVELS[Math.min(lv, PET_LEVELS.length - 1)];
  const pct = lv >= PET_LEVELS.length ? 1 : (totalStars - cur) / (next - cur);
  return { cur, next, pct: Math.max(0, Math.min(1, pct)) };
}

export function feedPet(s: AppState): AppState | null {
  if (s.stars < 5) return null;
  return {
    ...s,
    stars: s.stars - 5,
    pet: {
      ...s.pet,
      fullness: Math.min(100, s.pet.fullness + 30),
      happiness: Math.min(100, s.pet.happiness + 25),
      lastFed: todayStr(),
      totalFed: s.pet.totalFed + 1,
    },
  };
}

// ===== 近 7 天统计 =====
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return out;
}

export function weakSkills(records: QuestionRecord[]): { skill: SkillTag; total: number; wrong: number; rate: number }[] {
  const map = new Map<SkillTag, { total: number; wrong: number }>();
  for (const r of records) {
    const m = map.get(r.skill) ?? { total: 0, wrong: 0 };
    m.total++;
    if (!r.firstTry) m.wrong++;
    map.set(r.skill, m);
  }
  return [...map.entries()]
    .map(([skill, v]) => ({ skill, total: v.total, wrong: v.wrong, rate: v.total ? 1 - v.wrong / v.total : 1 }))
    .sort((a, b) => a.rate - b.rate);
}

// ===== 音效（WebAudio 合成，无外部资源）=====
let audioCtx: AudioContext | null = null;
function ctx(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) {
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.06),
  correct: () => {
    tone(523.25, 0, 0.12, 'triangle', 0.12);
    tone(659.25, 0.09, 0.12, 'triangle', 0.12);
    tone(783.99, 0.18, 0.2, 'triangle', 0.12);
  },
  wrong: () => {
    tone(220, 0, 0.15, 'sine', 0.08);
    tone(196, 0.12, 0.2, 'sine', 0.08);
  },
  fanfare: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.22, 'triangle', 0.12));
    tone(1318.5, 0.42, 0.35, 'triangle', 0.1);
  },
  /** 猫叫：上滑后下滑的"喵~"，带颤音 */
  meow: () => {
    const c = ctx();
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sawtooth';
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    const g = c.createGain();
    o.frequency.setValueAtTime(540, t);
    o.frequency.linearRampToValueAtTime(820, t + 0.09);
    o.frequency.linearRampToValueAtTime(400, t + 0.45);
    const lfo = c.createOscillator();
    lfo.frequency.value = 17;
    const lfoG = c.createGain();
    lfoG.gain.value = 24;
    lfo.connect(lfoG).connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.05);
    g.gain.setValueAtTime(0.14, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);
    o.connect(lp).connect(g).connect(c.destination);
    o.start(t);
    lfo.start(t);
    o.stop(t + 0.6);
    lfo.stop(t + 0.6);
  },
  /** 鼓掌：三声拍手，每声由多个紧凑噪声脉冲组成 */
  clap: () => {
    const c = ctx();
    if (!c) return;
    const clapOnce = (t: number, vol: number) => {
      const dur = 0.09;
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2);
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1700 + Math.random() * 700;
      bp.Q.value = 1.1;
      const g = c.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(bp).connect(g).connect(c.destination);
      src.start(t);
    };
    const t = c.currentTime;
    [0, 0.24, 0.5].forEach((base, ci) => {
      const pulses = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < pulses; i++) clapOnce(t + base + i * 0.035 + Math.random() * 0.012, 0.5 - ci * 0.07);
    });
  },
};
