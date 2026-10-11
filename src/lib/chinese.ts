// ===== 二年级语文（人教版）内容库 =====
import type { ChoiceQ, ChoiceTask } from './taskTypes';

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[rnd(0, arr.length - 1)];
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
let uid = 0;
const nid = () => `cq${Date.now()}_${uid++}`;

// ===== 生字库：人教版二年级写字表/识字表常见字（239 字，含拼音）=====
export const CHAR_BANK: { ch: string; py: string }[] = [
  { ch: '两', py: 'liǎng' }, { ch: '就', py: 'jiù' }, { ch: '哪', py: 'nǎ' }, { ch: '宽', py: 'kuān' },
  { ch: '顶', py: 'dǐng' }, { ch: '眼', py: 'yǎn' }, { ch: '睛', py: 'jīng' }, { ch: '肚', py: 'dù' },
  { ch: '皮', py: 'pí' }, { ch: '孩', py: 'hái' }, { ch: '跳', py: 'tiào' }, { ch: '变', py: 'biàn' },
  { ch: '极', py: 'jí' }, { ch: '片', py: 'piàn' }, { ch: '傍', py: 'bàng' }, { ch: '海', py: 'hǎi' },
  { ch: '洋', py: 'yáng' }, { ch: '作', py: 'zuò' }, { ch: '坏', py: 'huài' }, { ch: '给', py: 'gěi' },
  { ch: '带', py: 'dài' }, { ch: '法', py: 'fǎ' }, { ch: '如', py: 'rú' }, { ch: '脚', py: 'jiǎo' },
  { ch: '娃', py: 'wá' }, { ch: '她', py: 'tā' }, { ch: '毛', py: 'máo' }, { ch: '更', py: 'gèng' },
  { ch: '知', py: 'zhī' }, { ch: '识', py: 'shí' }, { ch: '处', py: 'chù' }, { ch: '园', py: 'yuán' },
  { ch: '桥', py: 'qiáo' }, { ch: '群', py: 'qún' }, { ch: '队', py: 'duì' }, { ch: '旗', py: 'qí' },
  { ch: '铜', py: 'tóng' }, { ch: '号', py: 'hào' }, { ch: '领', py: 'lǐng' }, { ch: '巾', py: 'jīn' },
  { ch: '杨', py: 'yáng' }, { ch: '壮', py: 'zhuàng' }, { ch: '桐', py: 'tóng' }, { ch: '枫', py: 'fēng' },
  { ch: '松', py: 'sōng' }, { ch: '柏', py: 'bǎi' }, { ch: '棉', py: 'mián' }, { ch: '杉', py: 'shān' },
  { ch: '化', py: 'huà' }, { ch: '桂', py: 'guì' }, { ch: '歌', py: 'gē' }, { ch: '写', py: 'xiě' },
  { ch: '丛', py: 'cóng' }, { ch: '深', py: 'shēn' }, { ch: '熊', py: 'xióng' }, { ch: '猫', py: 'māo' },
  { ch: '九', py: 'jiǔ' }, { ch: '朋', py: 'péng' }, { ch: '友', py: 'yǒu' }, { ch: '季', py: 'jì' },
  { ch: '吹', py: 'chuī' }, { ch: '肥', py: 'féi' }, { ch: '农', py: 'nóng' }, { ch: '忙', py: 'máng' },
  { ch: '归', py: 'guī' }, { ch: '戴', py: 'dài' }, { ch: '辛', py: 'xīn' }, { ch: '苦', py: 'kǔ' },
  { ch: '称', py: 'chēng' }, { ch: '柱', py: 'zhù' }, { ch: '底', py: 'dǐ' }, { ch: '杆', py: 'gān' },
  { ch: '秤', py: 'chèng' }, { ch: '做', py: 'zuò' }, { ch: '岁', py: 'suì' }, { ch: '站', py: 'zhàn' },
  { ch: '船', py: 'chuán' }, { ch: '然', py: 'rán' }, { ch: '画', py: 'huà' }, { ch: '幅', py: 'fú' },
  { ch: '评', py: 'píng' }, { ch: '奖', py: 'jiǎng' }, { ch: '纸', py: 'zhǐ' }, { ch: '报', py: 'bào' },
  { ch: '另', py: 'lìng' }, { ch: '及', py: 'jí' }, { ch: '拿', py: 'ná' }, { ch: '并', py: 'bìng' },
  { ch: '封', py: 'fēng' }, { ch: '信', py: 'xìn' }, { ch: '今', py: 'jīn' }, { ch: '支', py: 'zhī' },
  { ch: '圆', py: 'yuán' }, { ch: '珠', py: 'zhū' }, { ch: '笔', py: 'bǐ' }, { ch: '灯', py: 'dēng' },
  { ch: '电', py: 'diàn' }, { ch: '影', py: 'yǐng' }, { ch: '哄', py: 'hǒng' }, { ch: '先', py: 'xiān' },
  { ch: '闭', py: 'bì' }, { ch: '脸', py: 'liǎn' }, { ch: '沉', py: 'chén' }, { ch: '发', py: 'fā' },
  { ch: '窗', py: 'chuāng' }, { ch: '沙', py: 'shā' }, { ch: '依', py: 'yī' }, { ch: '尽', py: 'jǐn' },
  { ch: '黄', py: 'huáng' }, { ch: '层', py: 'céng' }, { ch: '照', py: 'zhào' }, { ch: '炉', py: 'lú' },
  { ch: '烟', py: 'yān' }, { ch: '挂', py: 'guà' }, { ch: '川', py: 'chuān' }, { ch: '南', py: 'nán' },
  { ch: '部', py: 'bù' }, { ch: '些', py: 'xiē' }, { ch: '巨', py: 'jù' }, { ch: '真', py: 'zhēn' },
  { ch: '位', py: 'wèi' }, { ch: '每', py: 'měi' }, { ch: '升', py: 'shēng' }, { ch: '闪', py: 'shǎn' },
  { ch: '狗', py: 'gǒu' }, { ch: '湾', py: 'wān' }, { ch: '名', py: 'míng' }, { ch: '胜', py: 'shèng' },
  { ch: '迹', py: 'jì' }, { ch: '央', py: 'yāng' }, { ch: '丽', py: 'lì' }, { ch: '展', py: 'zhǎn' },
  { ch: '现', py: 'xiàn' }, { ch: '产', py: 'chǎn' }, { ch: '份', py: 'fèn' }, { ch: '坡', py: 'pō' },
  { ch: '枝', py: 'zhī' }, { ch: '起', py: 'qǐ' }, { ch: '客', py: 'kè' }, { ch: '老', py: 'lǎo' },
  { ch: '收', py: 'shōu' }, { ch: '城', py: 'chéng' }, { ch: '市', py: 'shì' }, { ch: '井', py: 'jǐng' },
  { ch: '观', py: 'guān' }, { ch: '沿', py: 'yán' }, { ch: '答', py: 'dá' }, { ch: '渴', py: 'kě' },
  { ch: '喝', py: 'hē' }, { ch: '话', py: 'huà' }, { ch: '际', py: 'jì' }, { ch: '阵', py: 'zhèn' },
  { ch: '朗', py: 'lǎng' }, { ch: '枯', py: 'kū' }, { ch: '却', py: 'què' }, { ch: '将', py: 'jiāng' },
  { ch: '纷', py: 'fēn' }, { ch: '夜', py: 'yè' }, { ch: '棵', py: 'kē' }, { ch: '谢', py: 'xiè' },
  { ch: '想', py: 'xiǎng' }, { ch: '盯', py: 'dīng' }, { ch: '言', py: 'yán' }, { ch: '邻', py: 'lín' },
  { ch: '治', py: 'zhì' }, { ch: '怪', py: 'guài' }, { ch: '楼', py: 'lóu' }, { ch: '年', py: 'nián' },
  { ch: '披', py: 'pī' }, { ch: '轻', py: 'qīng' }, { ch: '利', py: 'lì' }, { ch: '穿', py: 'chuān' },
  { ch: '扁', py: 'biǎn' }, { ch: '担', py: 'dān' }, { ch: '志', py: 'zhì' }, { ch: '伍', py: 'wǔ' },
  { ch: '军', py: 'jūn' }, { ch: '战', py: 'zhàn' }, { ch: '士', py: 'shì' }, { ch: '怎', py: 'zěn' },
  { ch: '忘', py: 'wàng' }, { ch: '泼', py: 'pō' }, { ch: '度', py: 'dù' }, { ch: '龙', py: 'lóng' },
  { ch: '炮', py: 'pào' }, { ch: '始', py: 'shǐ' }, { ch: '帮', py: 'bāng' }, { ch: '忽', py: 'hū' },
  { ch: '由', py: 'yóu' }, { ch: '于', py: 'yú' }, { ch: '蛙', py: 'wā' }, { ch: '诗', py: 'shī' },
  { ch: '村', py: 'cūn' }, { ch: '童', py: 'tóng' }, { ch: '碧', py: 'bì' }, { ch: '妆', py: 'zhuāng' },
  { ch: '绿', py: 'lǜ' }, { ch: '丝', py: 'sī' }, { ch: '剪', py: 'jiǎn' }, { ch: '冲', py: 'chōng' },
  { ch: '寻', py: 'xún' }, { ch: '姑', py: 'gū' }, { ch: '娘', py: 'niáng' }, { ch: '吐', py: 'tǔ' },
  { ch: '柳', py: 'liǔ' }, { ch: '荡', py: 'dàng' }, { ch: '桃', py: 'táo' }, { ch: '杏', py: 'xìng' },
  { ch: '鲜', py: 'xiān' }, { ch: '邮', py: 'yóu' }, { ch: '递', py: 'dì' }, { ch: '员', py: 'yuán' },
  { ch: '原', py: 'yuán' }, { ch: '叔', py: 'shū' }, { ch: '局', py: 'jú' }, { ch: '堆', py: 'duī' },
  { ch: '礼', py: 'lǐ' }, { ch: '植', py: 'zhí' }, { ch: '格', py: 'gé' }, { ch: '引', py: 'yǐn' },
  { ch: '注', py: 'zhù' }, { ch: '满', py: 'mǎn' }, { ch: '休', py: 'xiū' }, { ch: '息', py: 'xī' },
  { ch: '迎', py: 'yíng' }, { ch: '扑', py: 'pū' }, { ch: '导', py: 'dǎo' }, { ch: '永', py: 'yǒng' },
  { ch: '碰', py: 'pèng' }, { ch: '特', py: 'tè' }, { ch: '积', py: 'jī' }, { ch: '湖', py: 'hú' },
  { ch: '莲', py: 'lián' }, { ch: '穷', py: 'qióng' }, { ch: '荷', py: 'hé' }, { ch: '绝', py: 'jué' },
  { ch: '含', py: 'hán' }, { ch: '岭', py: 'lǐng' }, { ch: '吴', py: 'wú' },
];

// ===== 选字组词库 =====
const WORD_FILLS: { text: string; ans: string; dis: [string, string] }[] = [
  { text: '（ ）艳', ans: '鲜', dis: ['先', '仙'] },
  { text: '国（ ）', ans: '旗', dis: ['其', '棋'] },
  { text: '长（ ）', ans: '城', dis: ['成', '诚'] },
  { text: '眼（ ）', ans: '睛', dis: ['晴', '情'] },
  { text: '松（ ）', ans: '柏', dis: ['伯', '拍'] },
  { text: '英（ ）', ans: '雄', dis: ['熊', '凶'] },
  { text: '办（ ）', ans: '法', dis: ['发', '罚'] },
  { text: '（ ）后', ans: '然', dis: ['燃', '染'] },
  { text: '作（ ）', ans: '业', dis: ['叶', '夜'] },
  { text: '带（ ）', ans: '领', dis: ['岭', '铃'] },
  { text: '（ ）现', ans: '展', dis: ['斩', '盏'] },
  { text: '丰（ ）', ans: '收', dis: ['手', '守'] },
  { text: '扁（ ）', ans: '担', dis: ['但', '胆'] },
  { text: '（ ）水', ans: '泼', dis: ['波', '拨'] },
  { text: '活（ ）', ans: '泼', dis: ['波', '坡'] },
  { text: '知（ ）', ans: '识', dis: ['时', '实'] },
  { text: '写（ ）', ans: '信', dis: ['心', '辛'] },
  { text: '圆（ ）笔', ans: '珠', dis: ['猪', '蛛'] },
  { text: '电（ ）', ans: '灯', dis: ['丁', '盯'] },
  { text: '评（ ）', ans: '奖', dis: ['讲', '桨'] },
  { text: '报（ ）', ans: '纸', dis: ['只', '指'] },
  { text: '（ ）照', ans: '依', dis: ['衣', '医'] },
  { text: '楼（ ）', ans: '层', dis: ['成', '曾'] },
  { text: '（ ）火', ans: '烟', dis: ['淹', '咽'] },
  { text: '山（ ）', ans: '川', dis: ['穿', '船'] },
  { text: '南（ ）', ans: '部', dis: ['不', '步'] },
  { text: '一（ ）', ans: '些', dis: ['写', '歇'] },
  { text: '（ ）起', ans: '升', dis: ['生', '声'] },
  { text: '闪（ ）', ans: '亮', dis: ['两', '辆'] },
  { text: '名（ ）', ans: '胜', dis: ['圣', '盛'] },
  { text: '古（ ）', ans: '迹', dis: ['机', '鸡'] },
  { text: '中（ ）', ans: '央', dis: ['秧', '殃'] },
  { text: '山（ ）', ans: '坡', dis: ['波', '披'] },
  { text: '树（ ）', ans: '枝', dis: ['只', '支'] },
  { text: '（ ）人', ans: '客', dis: ['课', '刻'] },
  { text: '城（ ）', ans: '市', dis: ['是', '事'] },
  { text: '口（ ）', ans: '渴', dis: ['可', '喝'] },
  { text: '回（ ）', ans: '答', dis: ['大', '达'] },
  { text: '晴（ ）', ans: '朗', dis: ['狼', '郎'] },
  { text: '枯（ ）', ans: '黄', dis: ['皇', '蝗'] },
  { text: '夜（ ）', ans: '晚', dis: ['万', '玩'] },
  { text: '感（ ）', ans: '谢', dis: ['些', '歇'] },
  { text: '邻（ ）', ans: '居', dis: ['句', '局'] },
  { text: '奇（ ）', ans: '怪', dis: ['快', '块'] },
  { text: '难（ ）', ans: '忘', dis: ['望', '网'] },
  { text: '战（ ）', ans: '士', dis: ['是', '事'] },
  { text: '（ ）么', ans: '怎', dis: ['咱', '赞'] },
  { text: '花（ ）', ans: '炮', dis: ['泡', '跑'] },
  { text: '开（ ）', ans: '始', dis: ['史', '使'] },
  { text: '（ ）球', ans: '皮', dis: ['疲', '坡'] },
];

// ===== 量词库 =====
const LIANGCI: { noun: string; ans: string; dis: [string, string] }[] = [
  { noun: '猫', ans: '只', dis: ['条', '头'] },
  { noun: '花', ans: '朵', dis: ['只', '条'] },
  { noun: '树', ans: '棵', dis: ['颗', '只'] },
  { noun: '桥', ans: '座', dis: ['条', '个'] },
  { noun: '鱼', ans: '条', dis: ['只', '头'] },
  { noun: '红旗', ans: '面', dis: ['个', '只'] },
  { noun: '书', ans: '本', dis: ['张', '只'] },
  { noun: '笔', ans: '支', dis: ['只', '本'] },
  { noun: '伞', ans: '把', dis: ['支', '个'] },
  { noun: '鞋', ans: '双', dis: ['只', '条'] },
  { noun: '衣服', ans: '件', dis: ['条', '个'] },
  { noun: '水', ans: '杯', dis: ['条', '朵'] },
  { noun: '叶子', ans: '片', dis: ['张', '条'] },
  { noun: '星星', ans: '颗', dis: ['棵', '只'] },
  { noun: '马', ans: '匹', dis: ['只', '头'] },
  { noun: '牛', ans: '头', dis: ['只', '匹'] },
  { noun: '汽车', ans: '辆', dis: ['个', '只'] },
  { noun: '信', ans: '封', dis: ['张', '本'] },
  { noun: '画', ans: '幅', dis: ['个', '本'] },
  { noun: '古诗', ans: '首', dis: ['句', '本'] },
  { noun: '鸟', ans: '只', dis: ['头', '条'] },
  { noun: '白云', ans: '朵', dis: ['只', '颗'] },
  { noun: '椅子', ans: '把', dis: ['张', '条'] },
  { noun: '桌子', ans: '张', dis: ['把', '条'] },
  { noun: '教室', ans: '间', dis: ['座', '条'] },
  { noun: '石头', ans: '块', dis: ['棵', '只'] },
  { noun: '米', ans: '粒', dis: ['棵', '条'] },
  { noun: '井', ans: '口', dis: ['个', '座'] },
  { noun: '大象', ans: '头', dis: ['条', '颗'] },
  { noun: '铅笔', ans: '支', dis: ['本', '张'] },
];

// ===== 近义词库 =====
const JINYI: { word: string; ans: string; dis: [string, string] }[] = [
  { word: '美丽', ans: '漂亮', dis: ['难看', '普通'] },
  { word: '高兴', ans: '快乐', dis: ['难过', '生气'] },
  { word: '仔细', ans: '认真', dis: ['马虎', '粗心'] },
  { word: '连忙', ans: '急忙', dis: ['缓慢', '犹豫'] },
  { word: '著名', ans: '有名', dis: ['平凡', '普通'] },
  { word: '想念', ans: '思念', dis: ['忘记', '讨厌'] },
  { word: '忽然', ans: '突然', dis: ['渐渐', '慢慢'] },
  { word: '特别', ans: '非常', dis: ['一般', '普通'] },
  { word: '好像', ans: '仿佛', dis: ['肯定', '确实'] },
  { word: '温暖', ans: '暖和', dis: ['寒冷', '凉快'] },
  { word: '明亮', ans: '光亮', dis: ['黑暗', '昏暗'] },
  { word: '朋友', ans: '伙伴', dis: ['敌人', '对手'] },
  { word: '伤心', ans: '难过', dis: ['开心', '得意'] },
  { word: '喜欢', ans: '喜爱', dis: ['讨厌', '厌恶'] },
  { word: '帮助', ans: '帮忙', dis: ['破坏', '捣乱'] },
  { word: '商量', ans: '讨论', dis: ['争吵', '独断'] },
  { word: '奇怪', ans: '奇特', dis: ['平常', '普通'] },
  { word: '称赞', ans: '夸奖', dis: ['批评', '责怪'] },
  { word: '办法', ans: '方法', dis: ['困难', '问题'] },
  { word: '依然', ans: '仍然', dis: ['不再', '从不'] },
];

// ===== 反义词库 =====
const FANYI: { word: string; ans: string; dis: [string, string] }[] = [
  { word: '高', ans: '矮', dis: ['胖', '瘦'] },
  { word: '快', ans: '慢', dis: ['急', '速'] },
  { word: '多', ans: '少', dis: ['大', '重'] },
  { word: '长', ans: '短', dis: ['高', '细'] },
  { word: '黑', ans: '白', dis: ['灰', '暗'] },
  { word: '冷', ans: '热', dis: ['冻', '寒'] },
  { word: '轻', ans: '重', dis: ['薄', '小'] },
  { word: '远', ans: '近', dis: ['长', '高'] },
  { word: '笑', ans: '哭', dis: ['乐', '喜'] },
  { word: '开', ans: '关', dis: ['张', '启'] },
  { word: '上', ans: '下', dis: ['天', '前'] },
  { word: '前', ans: '后', dis: ['左', '先'] },
  { word: '好', ans: '坏', dis: ['棒', '优'] },
  { word: '甜', ans: '苦', dis: ['甘', '蜜'] },
  { word: '深', ans: '浅', dis: ['长', '高'] },
  { word: '粗', ans: '细', dis: ['大', '壮'] },
  { word: '进', ans: '出', dis: ['入', '来'] },
  { word: '弯', ans: '直', dis: ['曲', '斜'] },
  { word: '早', ans: '晚', dis: ['晨', '朝'] },
  { word: '新', ans: '旧', dis: ['鲜', '亮'] },
];

// ===== 词语搭配库 =====
const DAPEI: { adj: string; ans: string; dis: [string, string] }[] = [
  { adj: '温暖的', ans: '阳光', dis: ['冰块', '北风'] },
  { adj: '弯弯的', ans: '月亮', dis: ['高楼', '巨石'] },
  { adj: '蓝蓝的', ans: '天空', dis: ['草地', '稻田'] },
  { adj: '绿绿的', ans: '草地', dis: ['云朵', '火焰'] },
  { adj: '红红的', ans: '苹果', dis: ['香蕉', '葡萄'] },
  { adj: '明亮的', ans: '教室', dis: ['山洞', '夜晚'] },
  { adj: '可爱的', ans: '小猫', dis: ['石头', '机器'] },
  { adj: '美丽的', ans: '花朵', dis: ['垃圾', '污水'] },
  { adj: '清清的', ans: '小河', dis: ['泥浆', '沙漠'] },
  { adj: '雪白的', ans: '云朵', dis: ['泥土', '黑夜'] },
  { adj: '金黄的', ans: '稻田', dis: ['草原', '森林'] },
  { adj: '高大的', ans: '树木', dis: ['蚂蚁', '小草'] },
  { adj: '快乐的', ans: '孩子', dis: ['石头', '影子'] },
  { adj: '鲜艳的', ans: '国旗', dis: ['灰尘', '乌云'] },
  { adj: '碧绿的', ans: '荷叶', dis: ['火焰', '柿子'] },
  { adj: '凶猛的', ans: '老虎', dis: ['绵羊', '白兔'] },
];

// ===== 古诗库（人教版二年级必背 10 首）=====
interface Poem {
  title: string;
  author: string;
  lines: string[];
}
export const POEMS: Poem[] = [
  { title: '登鹳雀楼', author: '王之涣', lines: ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'] },
  { title: '望庐山瀑布', author: '李白', lines: ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'] },
  { title: '静夜思', author: '李白', lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'] },
  { title: '夜宿山寺', author: '李白', lines: ['危楼高百尺', '手可摘星辰', '不敢高声语', '恐惊天上人'] },
  { title: '村居', author: '高鼎', lines: ['草长莺飞二月天', '拂堤杨柳醉春烟', '儿童散学归来早', '忙趁东风放纸鸢'] },
  { title: '咏柳', author: '贺知章', lines: ['碧玉妆成一树高', '万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'] },
  { title: '晓出净慈寺送林子方', author: '杨万里', lines: ['毕竟西湖六月中', '风光不与四时同', '接天莲叶无穷碧', '映日荷花别样红'] },
  { title: '绝句', author: '杜甫', lines: ['两个黄鹂鸣翠柳', '一行白鹭上青天', '窗含西岭千秋雪', '门泊东吴万里船'] },
  { title: '小儿垂钓', author: '胡令能', lines: ['蓬头稚子学垂纶', '侧坐莓苔草映身', '路人借问遥招手', '怕得鱼惊不应人'] },
  { title: '赋得古原草送别', author: '白居易', lines: ['离离原上草', '一岁一枯荣', '野火烧不尽', '春风吹又生'] },
];

// 诗句填空的形近/同音干扰字
const CONFUSE: Record<string, [string, string]> = {
  尽: ['进', '近'], 流: ['留', '柳'], 穷: ['空', '究'], 河: ['何', '荷'], 烟: ['咽', '淹'],
  川: ['穿', '州'], 尺: ['迟', '斥'], 银: ['很', '根'], 光: ['广', '厂'], 霜: ['雪', '相'],
  举: ['兴', '起'], 望: ['忘', '往'], 故: ['古', '姑'], 莺: ['鹰', '英'], 拂: ['佛', '扶'],
  堤: ['提', '题'], 柳: ['聊', '榴'], 醉: ['最', '罪'], 童: ['同', '铜'], 趁: ['诊', '珍'],
  鸢: ['鸳', '鸟'], 碧: ['壁', '臂'], 妆: ['装', '状'], 绦: ['条', '涤'], 裁: ['栽', '载'],
  剪: ['前', '煎'], 竟: ['竞', '境'], 莲: ['连', '怜'], 映: ['应', '硬'], 荷: ['何', '河'],
  鹂: ['丽', '梨'], 鹭: ['路', '露'], 岭: ['领', '铃'], 泊: ['伯', '拍'], 危: ['威', '巍'],
  辰: ['晨', '尘'], 语: ['雨', '羽'], 恐: ['空', '孔'], 稚: ['智', '治'], 纶: ['轮', '论'],
  苔: ['台', '抬'], 遥: ['摇', '谣'], 荣: ['容', '融'], 烧: ['浇', '饶'], 枯: ['古', '苦'],
  依: ['衣', '医'], 黄: ['皇', '蝗'], 层: ['成', '城'], 照: ['罩', '兆'], 炉: ['庐', '芦'],
  挂: ['桂', '卦'], 明: ['名', '鸣'], 思: ['丝', '司'], 乡: ['香', '相'], 归: ['规', '龟'],
  纸: ['只', '指'], 风: ['丰', '封'], 生: ['升', '声'], 上: ['尚', '赏'], 入: ['人', '八'],
  目: ['木', '牧'], 低: ['底', '滴'], 不: ['布', '步'], 天: ['大', '夫'],
};

// ===== 工具：拼音声调变体（看汉字选拼音的干扰项）=====
const TONE_GROUPS = ['āáǎà', 'ēéěè', 'īíǐì', 'ōóǒò', 'ūúǔù', 'ǖǘǚǜ'];
function toneVariants(py: string): string[] {
  for (const g of TONE_GROUPS) {
    const i = [...py].findIndex((c) => g.includes(c));
    if (i >= 0) {
      const base = g.indexOf(py[i]);
      return [0, 1, 2, 3].filter((t) => t !== base).map((t) => py.slice(0, i) + g[t] + py.slice(i + 1));
    }
  }
  return [];
}

function makeChoices(ans: string, dis: string[]): { choices: string[]; answerIndex: number } {
  const all = shuffle([ans, ...dis.filter((d) => d && d !== ans)].slice(0, 3));
  return { choices: all, answerIndex: all.indexOf(ans) };
}

// ===== ① 生字小达人 =====
/** 看拼音选汉字 */
function genPinyinChar(): ChoiceQ {
  const c = pick(CHAR_BANK);
  // 优先取同音字做干扰，其次随机
  const samePy = shuffle(CHAR_BANK.filter((x) => x.py === c.py && x.ch !== c.ch)).map((x) => x.ch);
  const others = shuffle(CHAR_BANK.filter((x) => x.ch !== c.ch && !samePy.includes(x.ch))).map((x) => x.ch);
  const dis = [...samePy, ...others].slice(0, 2);
  const { choices, answerIndex } = makeChoices(c.ch, dis);
  return {
    id: nid(),
    skill: '生字',
    main: c.py,
    prompt: '读一读拼音，选出正确的汉字',
    choices,
    answerIndex,
    hint: `想一想这个字的偏旁，偏旁常常和字的意思有关哦`,
  };
}

/** 看汉字选拼音 */
function genCharPinyin(): ChoiceQ {
  let c = pick(CHAR_BANK);
  let tries = 0;
  while (toneVariants(c.py).length < 2 && tries++ < 20) c = pick(CHAR_BANK);
  const variants = toneVariants(c.py);
  const other = pick(CHAR_BANK.filter((x) => x.ch !== c.ch && !toneVariants(x.py).includes(c.py) && x.py !== c.py));
  const { choices, answerIndex } = makeChoices(c.py, shuffle([...variants, other.py]).slice(0, 2));
  return {
    id: nid(),
    skill: '拼音',
    main: c.ch,
    prompt: '选出这个字的正确读音',
    choices,
    answerIndex,
    hint: `注意看清楚：是第几声？声母韵母都要看准`,
  };
}

/** 选字组词 */
function genWordFill(): ChoiceQ {
  const w = pick(WORD_FILLS);
  const { choices, answerIndex } = makeChoices(w.ans, [...w.dis]);
  return {
    id: nid(),
    skill: '生字',
    main: w.text.replace('（ ）', '（　）'),
    prompt: '选出正确的字，把词语补充完整',
    choices,
    answerIndex,
    hint: `把每个字放进去读一读，哪个才是我们平时说的词？`,
  };
}

// ===== ② 词语百宝箱 =====
function genLiangci(): ChoiceQ {
  const l = pick(LIANGCI);
  const { choices, answerIndex } = makeChoices(l.ans, [...l.dis]);
  return {
    id: nid(),
    skill: '词语',
    main: `一（　）${l.noun}`,
    prompt: '选出正确的量词',
    choices,
    answerIndex,
    hint: `想一想平时说话怎么讲：一（　）${l.noun}？`,
  };
}

function genJinyi(): ChoiceQ {
  const w = pick(JINYI);
  const { choices, answerIndex } = makeChoices(w.ans, [...w.dis]);
  return {
    id: nid(),
    skill: '词语',
    main: w.word,
    prompt: '选出意思最接近的词（近义词）',
    choices,
    answerIndex,
    hint: `近义词是意思差不多的词，不是意思相反的词哦`,
  };
}

function genFanyi(): ChoiceQ {
  const w = pick(FANYI);
  const { choices, answerIndex } = makeChoices(w.ans, [...w.dis]);
  return {
    id: nid(),
    skill: '词语',
    main: w.word,
    prompt: '选出意思相反的词（反义词）',
    choices,
    answerIndex,
    hint: `反义词是意思正好相反的词，比如"大"和"小"`,
  };
}

function genDapei(): ChoiceQ {
  const d = pick(DAPEI);
  const { choices, answerIndex } = makeChoices(d.ans, [...d.dis]);
  return {
    id: nid(),
    skill: '词语',
    main: `${d.adj}（　）`,
    prompt: '选出搭配最合适的词语',
    choices,
    answerIndex,
    hint: `把每个词放进去读一读，哪个最通顺、最合理？`,
  };
}

// ===== ③ 古诗小诗人 =====
function genPoemFill(): ChoiceQ {
  const poem = pick(POEMS);
  const line = pick(poem.lines);
  // 从该行中找一个有干扰字配置的字；找不到就用任意非首字
  const chars = [...line];
  const candidates = chars.map((c, i) => ({ c, i })).filter(({ c }) => CONFUSE[c]);
  const target = candidates.length > 0 ? pick(candidates) : { c: chars[rnd(1, chars.length - 1)], i: -1 };
  const idx = target.i >= 0 ? target.i : rnd(1, chars.length - 1);
  const ans = chars[idx];
  const dis = CONFUSE[ans] ?? [pick(chars.filter((c) => c !== ans)), pick(poem.lines.join('').split('').filter((c) => c !== ans))];
  const { choices, answerIndex } = makeChoices(ans, [...dis]);
  const main = chars.map((c, i) => (i === idx ? '＿' : c)).join('');
  return {
    id: nid(),
    skill: '古诗',
    main,
    sub: `《${poem.title}》 ${poem.author}`,
    prompt: '这句诗缺了一个字，选出正确的字',
    choices,
    answerIndex,
    hint: `把这句诗背一背：《${poem.title}》里这一句是什么？`,
  };
}

function genPoemNext(): ChoiceQ {
  const poem = pick(POEMS);
  const i = rnd(0, poem.lines.length - 2);
  const ans = poem.lines[i + 1];
  const sameLen = POEMS.filter((p) => p.title !== poem.title).flatMap((p) => p.lines).filter((l) => l.length === ans.length);
  const { choices, answerIndex } = makeChoices(ans, shuffle(sameLen).slice(0, 2));
  return {
    id: nid(),
    skill: '古诗',
    main: poem.lines[i],
    sub: `《${poem.title}》 ${poem.author}`,
    prompt: '选出正确的下一句',
    choices,
    answerIndex,
    hint: `想一想《${poem.title}》这首诗的顺序，下一句接什么？`,
  };
}

function genPoemAuthor(): ChoiceQ {
  const poem = pick(POEMS);
  const others = shuffle([...new Set(POEMS.filter((p) => p.author !== poem.author).map((p) => p.author))]);
  const { choices, answerIndex } = makeChoices(poem.author, others.slice(0, 2));
  return {
    id: nid(),
    skill: '古诗',
    main: `《${poem.title}》`,
    sub: poem.lines[0] + '……',
    prompt: '这首诗的作者是谁？',
    choices,
    answerIndex,
    hint: `回忆一下课本里这首诗的作者吧`,
  };
}

// ===== 语文任务定义 =====
export const ZI_TASK: ChoiceTask = {
  id: 'zi',
  kind: 'choice',
  subject: '语文',
  title: '生字小达人',
  desc: '看拼音选字 · 组词',
  gradVar: 'var(--grad-zi)',
  bonus: 4,
  gen: (s) => {
    const n = s.counts.zi ?? 10;
    const pool = [genPinyinChar, genCharPinyin, genWordFill];
    return shuffle(Array.from({ length: n }, (_, i) => pool[i % 3])).map((f) => f());
  },
};

export const CI_TASK: ChoiceTask = {
  id: 'ci',
  kind: 'choice',
  subject: '语文',
  title: '词语百宝箱',
  desc: '量词 · 近义词 · 反义词',
  gradVar: 'var(--grad-ci)',
  bonus: 4,
  gen: (s) => {
    const n = s.counts.ci ?? 10;
    const pool = [genLiangci, genJinyi, genFanyi, genDapei];
    return shuffle(Array.from({ length: n }, (_, i) => pool[i % 4])).map((f) => f());
  },
};

export const SHI_TASK: ChoiceTask = {
  id: 'shi',
  kind: 'choice',
  subject: '语文',
  title: '古诗小诗人',
  desc: '必背古诗 10 首',
  gradVar: 'var(--grad-shi)',
  bonus: 5,
  gen: (s) => {
    const n = s.counts.shi ?? 10;
    const pool = [genPoemFill, genPoemNext, genPoemAuthor];
    return shuffle(Array.from({ length: n }, (_, i) => pool[i % 3])).map((f) => f());
  },
};
