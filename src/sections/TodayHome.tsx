import { getTodayTasks } from '../lib/questions';
import { todayStr, lastNDays, petLevel } from '../lib/store';
import type { AppState, TaskId } from '../lib/store';
import CatPet from '../components/CatPet';

interface Props {
  state: AppState;
  onStartTask: (t: TaskId) => void;
}

const TASK_ICONS: Record<string, string> = {
  oral: '＋−',
  mult: '×÷',
  word: '？',
  zi: '字',
  ci: '词',
  shi: '诗',
  letter: 'Aa',
  eword: 'ab',
  sent: '💬',
};

export default function TodayHome({ state, onStartTask }: Props) {
  const today = todayStr();
  const dayLog = state.days[today];
  const tasks = getTodayTasks();
  const total = tasks.length;
  const done = dayLog?.tasksCompleted ?? [];
  const week = lastNDays(7);
  const hour = new Date().getHours();
  const greet = hour < 9 ? '早上好' : hour < 12 ? '上午好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
  const petMood = state.pet.happiness > 60 ? 'happy' : state.pet.happiness > 30 ? 'ok' : 'hungry';

  return (
    <div className="space-y-5 pb-28">
      {/* 顶部状态条 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 card-soft px-3.5 py-2">
          <span className={`text-xl ${state.streak > 0 ? 'flame-flick inline-block' : 'grayscale opacity-40'}`}>🔥</span>
          <span className="font-num font-bold text-lg" style={{ color: 'var(--ink)' }}>{state.streak}</span>
          <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>天连续</span>
        </div>
        <div className="flex items-center gap-2 card-soft px-3.5 py-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12,2 L14.6,8.6 L21.5,9.1 L16.2,13.4 L17.8,20.2 L12,16.6 L6.2,20.2 L7.8,13.4 L2.5,9.1 L9.4,8.6 Z" fill="#ffbf2e" stroke="#c77f02" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span className="font-num font-bold text-lg" style={{ color: 'var(--ink)' }}>{state.stars}</span>
          <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>星星</span>
        </div>
      </div>

      {/* 问候 + 星宝 */}
      <div className="card-soft p-5 md:p-6 flex items-center gap-4 md:gap-6 rise-in">
        <div className="shrink-0 md:scale-110 md:origin-center">
          <CatPet mood={petMood} level={petLevel(state.totalStars)} size={88} className="float-soft" />
        </div>
        <div>
          <p className="font-kuai text-2xl md:text-3xl leading-snug">{greet}，小学霸！</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
            {done.length === 0 && '今天的学习之旅要开始啦！'}
            {done.length > 0 && done.length < total && `已完成 ${done.length}/${total} 个任务，继续加油！`}
            {done.length === total && '今天任务全部完成，太厉害了！🎉'}
          </p>
        </div>
      </div>

      {/* 本周打卡 */}
      <div className="card-soft p-4 rise-in" style={{ animationDelay: '0.06s' }}>
        <p className="text-sm font-bold mb-3" style={{ color: 'var(--ink-soft)' }}>本周打卡</p>
        <div className="flex justify-between">
          {week.map((d) => {
            const log = state.days[d];
            const active = !!log && log.questions > 0;
            const isToday = d === today;
            const wd = '日一二三四五六'[new Date(d + 'T12:00:00').getDay()];
            return (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{wd}</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-num transition-all ${isToday ? 'ring-2 ring-offset-1' : ''}`}
                  style={{
                    background: active ? 'var(--gold)' : 'var(--bg-deep)',
                    color: active ? '#5a3a00' : 'var(--ink-soft)',
                    ['--tw-ring-color' as string]: 'var(--forest)',
                  }}
                >
                  {active ? '✓' : Number(d.slice(-2))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 今日任务 */}
      <div>
        <p className="font-kuai text-xl mb-3 px-1">今日任务 <span className="text-xs font-sans font-normal" style={{ color: 'var(--ink-soft)' }}>数学 2 个 + 语文 2 个 + 英语 2 个</span></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
          {tasks.map((t, i) => {
            const isDone = done.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => !isDone && onStartTask(t.id)}
                disabled={isDone}
                className="w-full text-left btn-chunky rise-in relative overflow-hidden"
                style={{ background: t.gradVar, animationDelay: `${0.12 + i * 0.07}s`, opacity: isDone ? 0.75 : 1 }}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
                    <span className="font-num font-extrabold text-2xl text-white tracking-tight">{TASK_ICONS[t.id]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-kuai text-xl text-white flex items-center gap-2 flex-wrap">
                      {t.title}
                      <span className="text-[10px] bg-black/20 rounded-full px-2 py-0.5 font-sans font-bold">{t.subject}</span>
                      {isDone && <span className="text-xs bg-white/90 text-green-800 rounded-full px-2 py-0.5 font-sans font-bold">已完成 ✓</span>}
                    </p>
                    <p className="text-white/85 text-sm mt-0.5">
                      {t.desc} · 完成得 <span className="font-num font-bold">{t.bonus}</span> ⭐
                    </p>
                  </div>
                  {!isDone && <span className="text-white text-2xl shrink-0">›</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs pt-1" style={{ color: 'var(--ink-soft)' }}>
        每天 15 分钟，和星宝一起长大 ✨
      </p>
    </div>
  );
}
