// ===== 二年级出题引擎（人教版二年级口径：100以内加减法、表内乘除法、两步内应用题）=====
import type { Question, NumpadTask, TaskDef } from './taskTypes';
import { ZI_TASK, CI_TASK, SHI_TASK } from './chinese';
import { LETTER_TASK, EWORD_TASK, SENT_TASK } from './english';

export type { Question, ChoiceQ, TaskDef } from './taskTypes';

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[rnd(0, arr.length - 1)];
let uid = 0;
const nid = () => `q${Date.now()}_${uid++}`;

/** 进位加法：38 + 47，个位相加 ≥ 10，和 ≤ 100 */
function genCarryAdd(): Question {
  for (;;) {
    const a = rnd(15, 79);
    const b = rnd(15, 99 - a);
    if ((a % 10) + (b % 10) >= 10 && a + b <= 100) {
      const ones = (a % 10) + (b % 10);
      return {
        id: nid(),
        skill: '进位加法',
        prompt: `${a} + ${b}`,
        suffix: ' = ?',
        answer: a + b,
        hint: `先算个位：${a % 10} + ${b % 10} = ${ones}，满十啦，要向十位进 1；再算十位：${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 进的 1 = ?`,
      };
    }
  }
}

/** 退位减法：72 - 38，个位不够减 */
function genBorrowSub(): Question {
  for (;;) {
    const a = rnd(30, 99);
    const b = rnd(15, a - 5);
    if (a % 10 < b % 10) {
      return {
        id: nid(),
        skill: '退位减法',
        prompt: `${a} − ${b}`,
        suffix: ' = ?',
        answer: a - b,
        hint: `个位 ${a % 10} 减 ${b % 10} 不够，向十位借 1 当十：${10 + (a % 10)} − ${b % 10} = ? 十位别忘了少 1 哦`,
      };
    }
  }
}

/** 表内乘法：2~9 */
function genMult(): Question {
  const a = rnd(2, 9);
  const b = rnd(2, 9);
  const mnemonic = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return {
    id: nid(),
    skill: '乘法口诀',
    prompt: `${a} × ${b}`,
    suffix: ' = ?',
    answer: a * b,
    hint: `背一背口诀：${mnemonic[Math.min(a, b)]}${mnemonic[Math.max(a, b)]}……？`,
  };
}

/** 表内除法：整除 */
function genDiv(): Question {
  const b = rnd(2, 9);
  const q = rnd(2, 9);
  return {
    id: nid(),
    skill: '表内除法',
    prompt: `${b * q} ÷ ${b}`,
    suffix: ' = ?',
    answer: q,
    hint: `想一想：${b} 乘几等于 ${b * q}？`,
  };
}

// ===== 应用题模板 =====
const NAMES = ['小明', '小红', '小华', '小丽', '小军', '小芳', '小刚', '小雪'];

type WordGen = () => { text: string; answer: number; hint: string; unit: string };

const wordGens: WordGen[] = [
  // 加法
  () => {
    const n = pick(NAMES);
    const a = rnd(15, 40);
    const b = rnd(12, 99 - a - 5);
    return {
      text: `${n}原来有 ${a} 张贴纸，过生日又得到 ${b} 张。现在${n}一共有多少张贴纸？`,
      answer: a + b,
      unit: '张',
      hint: `“又得到”表示变多了，应该用加法还是减法呢？`,
    };
  },
  // 减法
  () => {
    const n = pick(NAMES);
    const a = rnd(40, 95);
    const b = rnd(12, a - 10);
    return {
      text: `盒子里有 ${a} 块饼干，${n}和好朋友一起吃掉了 ${b} 块。盒子里还剩多少块饼干？`,
      answer: a - b,
      unit: '块',
      hint: `“吃掉了”表示变少了，想一想该用加法还是减法？`,
    };
  },
  // 乘法
  () => {
    const per = rnd(3, 8);
    const groups = rnd(3, 7);
    const item = pick(['铅笔', '苹果', '气球', '星星贴纸']);
    const box = item === '气球' ? '束' : '盒';
    return {
      text: `每${box}有 ${per} ${item === '气球' ? '个' : '支'}${item}，${groups} ${box}一共有多少${item === '气球' ? '个' : '支'}${item}？`,
      answer: per * groups,
      unit: item === '气球' ? '个' : '支',
      hint: `每${box}一样多，有 ${groups} 个 ${per}，可以用乘法：${per} × ${groups} = ?`,
    };
  },
  // 除法（平均分）
  () => {
    const q = rnd(3, 8);
    const b = rnd(3, 7);
    return {
      text: `老师把 ${q * b} 本故事书平均分给 ${b} 个小组，每个小组分到几本？`,
      answer: q,
      unit: '本',
      hint: `“平均分”要用除法：${q * b} ÷ ${b} = ?`,
    };
  },
  // 两步：比多比少
  () => {
    const n1 = pick(NAMES);
    let n2 = pick(NAMES);
    while (n2 === n1) n2 = pick(NAMES);
    const a = rnd(20, 50);
    const d = rnd(5, 18);
    return {
      text: `${n1}收集了 ${a} 颗玻璃珠，${n2}比${n1}多收集 ${d} 颗。${n2}收集了多少颗玻璃珠？`,
      answer: a + d,
      unit: '颗',
      hint: `${n2}比${n1}“多”，就是在 ${a} 的基础上加 ${d}`,
    };
  },
  // 两步：剩下再分
  () => {
    const price = rnd(4, 9);
    const count = rnd(2, 6);
    const paid = Math.ceil((price * count) / 10) * 10 + rnd(0, 2) * 10;
    return {
      text: `一本漫画书 ${price} 元，${pick(NAMES)}买了 ${count} 本，付给售货员 ${paid} 元，应找回多少元？`,
      answer: paid - price * count,
      unit: '元',
      hint: `先算一共花了多少：${price} × ${count} = ? 再用 ${paid} 元减去它`,
    };
  },
];

function genWord(): Question {
  const w = pick(wordGens)();
  return { id: nid(), skill: '应用题', prompt: w.text, suffix: '', answer: w.answer, hint: w.hint, unit: w.unit };
}

// ===== 数学任务定义 =====
const ORAL_TASK: NumpadTask = {
  id: 'oral',
  kind: 'numpad',
  subject: '数学',
  title: '口算小达人',
  desc: '100以内加减法',
  gradVar: 'var(--grad-oral)',
  bonus: 5,
  gen: (s) => {
    const n = s.counts.oral ?? 10;
    const out: Question[] = [];
    for (let i = 0; i < n; i++) out.push(i % 2 === 0 ? genCarryAdd() : genBorrowSub());
    return out;
  },
};

const MULT_TASK: NumpadTask = {
  id: 'mult',
  kind: 'numpad',
  subject: '数学',
  title: '乘除法闯关',
  desc: '表内乘除法',
  gradVar: 'var(--grad-mult)',
  bonus: 4,
  gen: (s) => {
    const n = s.counts.mult ?? 10;
    const out: Question[] = [];
    for (let i = 0; i < n; i++) out.push(i % 3 === 2 ? genDiv() : genMult());
    return out;
  },
};

const WORD_TASK: NumpadTask = {
  id: 'word',
  kind: 'numpad',
  subject: '数学',
  title: '应用题挑战',
  desc: '动动小脑筋',
  gradVar: 'var(--grad-word)',
  bonus: 6,
  gen: (s) => Array.from({ length: s.counts.word ?? 10 }, () => genWord()),
};

// ===== 全部任务 + 每日轮换（数学 2 个 + 语文 2 个 + 英语 2 个）=====
export const ALL_TASKS: TaskDef[] = [ORAL_TASK, MULT_TASK, WORD_TASK, ZI_TASK, CI_TASK, SHI_TASK, LETTER_TASK, EWORD_TASK, SENT_TASK];

/** 今日任务：口算每天必有；乘除/应用题隔天轮换；语文、英语三板块各按天轮换其二 */
export function getTodayTasks(): TaskDef[] {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const mathSecond = dayIndex % 2 === 0 ? MULT_TASK : WORD_TASK;
  const cnPairs: [TaskDef, TaskDef][] = [
    [ZI_TASK, SHI_TASK],
    [CI_TASK, ZI_TASK],
    [SHI_TASK, CI_TASK],
  ];
  const enPairs: [TaskDef, TaskDef][] = [
    [LETTER_TASK, EWORD_TASK],
    [EWORD_TASK, SENT_TASK],
    [SENT_TASK, LETTER_TASK],
  ];
  const [c1, c2] = cnPairs[dayIndex % 3];
  const [e1, e2] = enPairs[dayIndex % 3];
  return [ORAL_TASK, mathSecond, c1, c2, e1, e2];
}

export const PRAISES = ['太棒了！', '算得真快！', '完全正确！', '小脑袋真灵！', '这道题可难不倒你！', '星星能量 +1！'];
export const COMFORTS = ['差一点点，再试一次！', '别灰心，想一想提示', '错误是成功的垫脚石哦', '慢慢来，你可以的'];
