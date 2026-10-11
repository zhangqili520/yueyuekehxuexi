import type { ChoiceQ, ChoiceTask } from './taskTypes';

// ================= 英语题库（人教版二年级口径）=================
// 单词：{ en 英文, cn 中文, emoji 图片 }, 按主题分类
interface Word { en: string; cn: string; emoji: string; cat: string }

const W = (en: string, cn: string, emoji: string, cat: string): Word => ({ en, cn, emoji, cat });

export const WORDS: Word[] = [
  // 动物
  W('cat', '猫', '🐱', '动物'), W('dog', '狗', '🐶', '动物'), W('bird', '鸟', '🐦', '动物'),
  W('fish', '鱼', '🐟', '动物'), W('rabbit', '兔子', '🐰', '动物'), W('tiger', '老虎', '🐯', '动物'),
  W('monkey', '猴子', '🐵', '动物'), W('panda', '熊猫', '🐼', '动物'), W('duck', '鸭子', '🦆', '动物'),
  W('bear', '熊', '🐻', '动物'), W('elephant', '大象', '🐘', '动物'), W('lion', '狮子', '🦁', '动物'),
  W('pig', '猪', '🐷', '动物'), W('frog', '青蛙', '🐸', '动物'), W('bee', '蜜蜂', '🐝', '动物'),
  W('chicken', '小鸡', '🐔', '动物'),
  // 颜色
  W('red', '红色', '🔴', '颜色'), W('yellow', '黄色', '🟡', '颜色'), W('blue', '蓝色', '🔵', '颜色'),
  W('green', '绿色', '🟢', '颜色'), W('pink', '粉色', '🩷', '颜色'), W('purple', '紫色', '🟣', '颜色'),
  W('orange', '橙色', '🟠', '颜色'), W('black', '黑色', '⚫', '颜色'), W('white', '白色', '⚪', '颜色'),
  W('brown', '棕色', '🟤', '颜色'),
  // 数字
  W('one', '一', '1️⃣', '数字'), W('two', '二', '2️⃣', '数字'), W('three', '三', '3️⃣', '数字'),
  W('four', '四', '4️⃣', '数字'), W('five', '五', '5️⃣', '数字'), W('six', '六', '6️⃣', '数字'),
  W('seven', '七', '7️⃣', '数字'), W('eight', '八', '8️⃣', '数字'), W('nine', '九', '9️⃣', '数字'),
  W('ten', '十', '🔟', '数字'),
  // 食物水果
  W('apple', '苹果', '🍎', '食物'), W('banana', '香蕉', '🍌', '食物'), W('pear', '梨', '🍐', '食物'),
  W('peach', '桃子', '🍑', '食物'), W('watermelon', '西瓜', '🍉', '食物'), W('grapes', '葡萄', '🍇', '食物'),
  W('strawberry', '草莓', '🍓', '食物'), W('milk', '牛奶', '🥛', '食物'), W('bread', '面包', '🍞', '食物'),
  W('egg', '鸡蛋', '🥚', '食物'), W('rice', '米饭', '🍚', '食物'), W('cake', '蛋糕', '🍰', '食物'),
  W('juice', '果汁', '🧃', '食物'), W('water', '水', '💧', '食物'), W('ice cream', '冰淇淋', '🍦', '食物'),
  // 家人
  W('father', '爸爸', '👨', '家人'), W('mother', '妈妈', '👩', '家人'), W('brother', '兄弟', '👦', '家人'),
  W('sister', '姐妹', '👧', '家人'), W('grandpa', '爷爷/外公', '👴', '家人'), W('grandma', '奶奶/外婆', '👵', '家人'),
  // 身体
  W('face', '脸', '😀', '身体'), W('eye', '眼睛', '👁️', '身体'), W('ear', '耳朵', '👂', '身体'),
  W('nose', '鼻子', '👃', '身体'), W('mouth', '嘴巴', '👄', '身体'), W('hand', '手', '✋', '身体'),
  W('foot', '脚', '🦶', '身体'), W('leg', '腿', '🦵', '身体'), W('arm', '手臂', '💪', '身体'),
  W('hair', '头发', '💇', '身体'),
  // 文具学校
  W('book', '书', '📖', '文具'), W('bag', '书包', '🎒', '文具'), W('pen', '钢笔', '🖊️', '文具'),
  W('pencil', '铅笔', '✏️', '文具'), W('ruler', '尺子', '📏', '文具'), W('crayon', '蜡笔', '🖍️', '文具'),
  W('chair', '椅子', '🪑', '文具'), W('school', '学校', '🏫', '文具'), W('teacher', '老师', '🧑‍🏫', '文具'),
  W('student', '学生', '🧑‍🎓', '文具'),
  // 自然与玩具
  W('sun', '太阳', '☀️', '自然'), W('moon', '月亮', '🌙', '自然'), W('star', '星星', '⭐', '自然'),
  W('flower', '花', '🌸', '自然'), W('tree', '树', '🌳', '自然'), W('rain', '雨', '🌧️', '自然'),
  W('snow', '雪', '❄️', '自然'), W('cloud', '云', '☁️', '自然'), W('rainbow', '彩虹', '🌈', '自然'),
  W('ball', '球', '⚽', '自然'), W('kite', '风筝', '🪁', '自然'), W('balloon', '气球', '🎈', '自然'),
];

// ================= 字母 =================
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
// 易混淆大写字母（作干扰项）
const MIX_UP: Record<string, string[]> = {
  A: ['H', 'R'], B: ['D', 'P'], C: ['G', 'O'], D: ['B', 'P'], E: ['F', 'B'], F: ['E', 'T'],
  G: ['C', 'Q'], H: ['N', 'M'], I: ['L', 'J'], J: ['I', 'L'], K: ['R', 'X'], L: ['I', 'J'],
  M: ['N', 'W'], N: ['M', 'H'], O: ['Q', 'C'], P: ['B', 'D'], Q: ['O', 'G'], R: ['P', 'B'],
  S: ['Z', 'C'], T: ['F', 'I'], U: ['V', 'W'], V: ['U', 'W'], W: ['M', 'V'], X: ['K', 'Y'],
  Y: ['V', 'X'], Z: ['S', 'N'],
};

// ================= 句子 =================
// 看图选句：emoji → 正确句 + 2 个错误句
const SCENE_SENT: { emoji: string; en: string; dis: [string, string] }[] = [
  { emoji: '🐱', en: "It's a cat.", dis: ["It's a dog.", "It's a bird."] },
  { emoji: '🐶', en: "It's a dog.", dis: ["It's a cat.", "It's a pig."] },
  { emoji: '🍎', en: "It's an apple.", dis: ["It's a banana.", "It's an egg."] },
  { emoji: '🐯', en: "It's a tiger.", dis: ["It's a lion.", "It's a monkey."] },
  { emoji: '🍌', en: "It's a banana.", dis: ["It's an apple.", "It's a pear."] },
  { emoji: '🌧️', en: "It's rainy.", dis: ["It's sunny.", "It's snowy."] },
  { emoji: '☀️', en: "It's sunny.", dis: ["It's rainy.", "It's cloudy."] },
  { emoji: '📖', en: 'This is my book.', dis: ['This is my bag.', 'This is my pen.'] },
  { emoji: '🎒', en: 'This is my bag.', dis: ['This is my book.', 'This is my chair.'] },
  { emoji: '👩', en: 'This is my mother.', dis: ['This is my father.', 'This is my sister.'] },
  { emoji: '👨', en: 'This is my father.', dis: ['This is my mother.', 'This is my brother.'] },
  { emoji: '⚽', en: 'I like balls.', dis: ['I like kites.', 'I like books.'] },
  { emoji: '🪁', en: 'I like kites.', dis: ['I like balls.', 'I like balloons.'] },
  { emoji: '🥛', en: 'I like milk.', dis: ['I like juice.', 'I like water.'] },
  { emoji: '🐟', en: 'I have a fish.', dis: ['I have a cat.', 'I have a bird.'] },
  { emoji: '✏️', en: 'I have a pencil.', dis: ['I have a pen.', 'I have a ruler.'] },
];

// 翻译选择：英文 → 中文
const TRANS_SENT: { en: string; cn: string }[] = [
  { en: "What's this?", cn: '这是什么？' },
  { en: "It's a cat.", cn: '它是一只猫。' },
  { en: 'How are you?', cn: '你好吗？' },
  { en: "I'm fine, thank you.", cn: '我很好，谢谢。' },
  { en: 'Good morning!', cn: '早上好！' },
  { en: 'Good afternoon!', cn: '下午好！' },
  { en: 'Good night!', cn: '晚安！' },
  { en: "What's your name?", cn: '你叫什么名字？' },
  { en: 'My name is Lily.', cn: '我的名字叫莉莉。' },
  { en: 'How old are you?', cn: '你几岁了？' },
  { en: "I'm seven.", cn: '我七岁了。' },
  { en: 'I like apples.', cn: '我喜欢苹果。' },
  { en: 'I have a ruler.', cn: '我有一把尺子。' },
  { en: 'This is my father.', cn: '这是我的爸爸。' },
  { en: 'Nice to meet you.', cn: '见到你很高兴。' },
  { en: "Let's go to school.", cn: '我们去上学吧。' },
  { en: 'Stand up, please.', cn: '请起立。' },
  { en: 'Sit down, please.', cn: '请坐下。' },
  { en: 'Open your book.', cn: '打开你的书。' },
  { en: 'Close your book.', cn: '合上你的书。' },
];

// 补全句子：语法型干扰项
const FILL_SENT: { text: string; ans: string; dis: [string, string]; hint: string }[] = [
  { text: 'I like __.', ans: 'apples', dis: ['apple', 'an apple'], hint: 'like 后面接复数 apples' },
  { text: 'I like __.', ans: 'bananas', dis: ['banana', 'a banana'], hint: 'like 后面接复数 bananas' },
  { text: 'I have a __.', ans: 'ruler', dis: ['rulers', 'an ruler'], hint: 'a 后面接单数 ruler' },
  { text: 'I have an __.', ans: 'egg', dis: ['eggs', 'a egg'], hint: 'an 后面接单数 egg' },
  { text: 'This is my __.', ans: 'mother', dis: ['mothers', 'mother is'], hint: 'my 后面接一个人：mother' },
  { text: "It's __ cat.", ans: 'a', dis: ['an', 'two'], hint: 'cat 前面用 a' },
  { text: "It's __ apple.", ans: 'an', dis: ['a', 'two'], hint: 'apple 前面用 an' },
  { text: 'How __ you?', ans: 'are', dis: ['is', 'am'], hint: 'How are you? 你好吗？' },
  { text: 'I __ fine.', ans: 'am', dis: ['is', 'are'], hint: 'I am fine. 我很好。' },
  { text: '__ is my book.', ans: 'This', dis: ['These', 'Those'], hint: '一本书用 This' },
  { text: '__ up, please.', ans: 'Stand', dis: ['Stands', 'Standing'], hint: 'Stand up 起立' },
  { text: "Let's __ to school.", ans: 'go', dis: ['goes', 'going'], hint: "Let's 后面用 go" },
];

// ================= 出题引擎 =================
let qid = 0;
const rid = () => `en${qid++}`;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

function makeChoices(correct: string, distractors: string[]): { choices: string[]; answerIndex: number } {
  const pool = [...new Set(distractors.filter((d) => d !== correct))];
  const dis: string[] = [];
  while (dis.length < 2 && pool.length) dis.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  const choices = shuffle([correct, ...dis]);
  return { choices, answerIndex: choices.indexOf(correct) };
}

const otherWords = (w: Word, sameCat: boolean): Word[] =>
  shuffle(WORDS.filter((x) => x.en !== w.en && (!sameCat || x.cat === w.cat))).slice(0, 6);

// ---------- 字母乐园 ----------
// 听音选字母：自动播放字母音，选听到的字母
function genListenLetter(): ChoiceQ {
  const i = Math.floor(Math.random() * 26);
  const ans = UPPER[i];
  const { choices, answerIndex } = makeChoices(ans, [...(MIX_UP[ans] || []), ...shuffle(UPPER.filter((x) => x !== ans)).slice(0, 4)]);
  return {
    id: rid(), skill: '字母', main: '🔊', prompt: '听一听，选出你听到的字母',
    choices, answerIndex, hint: `答案是字母 ${ans}`,
    audio: ans, autoAudio: true,
  };
}

// 大小写配对：给小写选大写
function genCaseMatch(): ChoiceQ {
  const i = Math.floor(Math.random() * 26);
  const ans = UPPER[i];
  const { choices, answerIndex } = makeChoices(ans, [...(MIX_UP[ans] || []), ...shuffle(UPPER.filter((x) => x !== ans)).slice(0, 4)]);
  return {
    id: rid(), skill: '字母', main: LOWER[i], prompt: '选出它的大写字母',
    choices, answerIndex, hint: `${LOWER[i]} 的大写是 ${ans}`,
    audio: ans,
  };
}

// 字母邻居：B __ D 中间是谁
function genLetterNeighbor(): ChoiceQ {
  const i = 1 + Math.floor(Math.random() * 24); // B..Y
  const ans = UPPER[i];
  const dis = [UPPER[i - 2] || 'Z', UPPER[i + 2] || 'A', ...shuffle(UPPER.filter((x) => x !== ans)).slice(0, 3)];
  const { choices, answerIndex } = makeChoices(ans, dis);
  return {
    id: rid(), skill: '字母', main: `${UPPER[i - 1]}  __  ${UPPER[i + 1]}`, prompt: '选出中间缺少的字母',
    choices, answerIndex, hint: `按顺序：${UPPER[i - 1]}、${ans}、${UPPER[i + 1]}`,
    audio: ans,
  };
}

// ---------- 单词小达人 ----------
// 看图选词
function genPicWord(): ChoiceQ {
  const w = pick(WORDS);
  const { choices, answerIndex } = makeChoices(w.en, otherWords(w, true).map((x) => x.en));
  return {
    id: rid(), skill: '单词', main: w.emoji, prompt: '图上是什么？选出正确的单词',
    choices, answerIndex, hint: `${w.emoji} 是 ${w.en}（${w.cn}）`,
    audio: w.en,
  };
}

// 听音选图：自动播放单词，选对应图片
function genListenPic(): ChoiceQ {
  const w = pick(WORDS);
  const others = otherWords(w, true).slice(0, 2);
  const opts = shuffle([w, ...others]);
  return {
    id: rid(), skill: '单词', main: '🔊', prompt: '听一听，选出你听到的图片',
    choices: opts.map((x) => x.emoji), answerIndex: opts.indexOf(w),
    hint: `听到的是 ${w.en}（${w.cn}）`,
    audio: w.en, autoAudio: true,
  };
}

// 中英互选：给中文选英文
function genCnEn(): ChoiceQ {
  const w = pick(WORDS);
  const { choices, answerIndex } = makeChoices(w.en, otherWords(w, true).map((x) => x.en));
  return {
    id: rid(), skill: '单词', main: w.cn, prompt: '选出它的英文单词',
    choices, answerIndex, hint: `${w.cn} 的英文是 ${w.en}`,
    audio: w.en,
  };
}

// ---------- 句子小达人 ----------
// 翻译选择
function genTranslate(): ChoiceQ {
  const s = pick(TRANS_SENT);
  const { choices, answerIndex } = makeChoices(s.cn, shuffle(TRANS_SENT.filter((x) => x.en !== s.en)).slice(0, 4).map((x) => x.cn));
  return {
    id: rid(), skill: '句型', main: s.en, prompt: '选出这句英文的意思',
    choices, answerIndex, hint: `${s.en} 的意思是「${s.cn}」`,
    audio: s.en,
  };
}

// 补全句子
function genFillSent(): ChoiceQ {
  const s = pick(FILL_SENT);
  const { choices, answerIndex } = makeChoices(s.ans, [...s.dis]);
  return {
    id: rid(), skill: '句型', main: s.text, prompt: '选出正确的单词补全句子',
    choices, answerIndex, hint: s.hint,
    audio: s.text.replace('__', s.ans),
  };
}

// 看图选句
function genPicSent(): ChoiceQ {
  const s = pick(SCENE_SENT);
  const { choices, answerIndex } = makeChoices(s.en, [...s.dis]);
  return {
    id: rid(), skill: '句型', main: s.emoji, prompt: '看图选出正确的句子',
    choices, answerIndex, hint: `${s.emoji} 应该说：${s.en}`,
    audio: s.en,
  };
}

// ================= 任务定义 =================
export const LETTER_TASK: ChoiceTask = {
  id: 'letter', kind: 'choice', subject: '英语',
  title: '字母乐园', desc: '26个字母认读',
  gradVar: 'var(--grad-letter)', bonus: 4,
  gen: (s) => {
    const gens = [genListenLetter, genCaseMatch, genLetterNeighbor];
    return Array.from({ length: s.counts.letter ?? 10 }, (_, i) => gens[i % 3]());
  },
};

export const EWORD_TASK: ChoiceTask = {
  id: 'eword', kind: 'choice', subject: '英语',
  title: '单词小达人', desc: '主题词汇闯关',
  gradVar: 'var(--grad-eword)', bonus: 4,
  gen: (s) => {
    const gens = [genPicWord, genListenPic, genCnEn];
    return Array.from({ length: s.counts.eword ?? 10 }, (_, i) => gens[i % 3]());
  },
};

export const SENT_TASK: ChoiceTask = {
  id: 'sent', kind: 'choice', subject: '英语',
  title: '句子小达人', desc: '核心句型运用',
  gradVar: 'var(--grad-sent)', bonus: 5,
  gen: (s) => {
    const gens = [genTranslate, genFillSent, genPicSent];
    return Array.from({ length: s.counts.sent ?? 10 }, (_, i) => gens[i % 3]());
  },
};
