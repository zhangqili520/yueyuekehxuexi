import { useEffect, useState } from 'react';
import TodayHome from '../sections/TodayHome';
import PetHouse from '../sections/PetHouse';
import ParentZone from '../sections/ParentZone';
import PracticeSession from '../sections/PracticeSession';
import ChoiceSession from '../sections/ChoiceSession';
import { ALL_TASKS } from '../lib/questions';
import { loadState, saveState, recordAnswer, completeTask, touchStreak, todayStr, petLevel } from '../lib/store';
import type { AppState, TaskId, QuestionRecord } from '../lib/store';

type Tab = 'home' | 'pet' | 'parent';

const TABS: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'home',
    label: '首页',
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={a ? 2.6 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    ),
  },
  {
    id: 'pet',
    label: '星宝',
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 1.6 : 2} strokeLinejoin="round">
        <path d="M12,3 L14.4,8.8 L20.5,9.3 L15.8,13 L17.4,19 L12,15.6 L6.6,19 L8.2,13 L3.5,9.3 L9.6,8.8 Z" />
      </svg>
    ),
  },
  {
    id: 'parent',
    label: '家长',
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={a ? 2.6 : 2} strokeLinecap="round">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2" />
        <path d="M16 4.5a3 3 0 0 1 0 7" />
        <path d="M17.5 14.8c1.8.7 2.9 2.3 3.2 5.2" />
      </svg>
    ),
  },
];

// 桌面端装饰：漂浮的数学符号
const DOODLES = [
  { t: '＋', x: '8%', y: '18%', s: 64, d: '0s' },
  { t: '×', x: '88%', y: '12%', s: 72, d: '0.8s' },
  { t: '÷', x: '12%', y: '72%', s: 56, d: '1.6s' },
  { t: '＝', x: '90%', y: '68%', s: 60, d: '0.4s' },
  { t: 'π', x: '6%', y: '44%', s: 48, d: '2.1s' },
  { t: '7', x: '85%', y: '42%', s: 44, d: '1.2s' },
  { t: '−', x: '18%', y: '8%', s: 52, d: '2.6s' },
];

export default function Home() {
  const [state, setState] = useState<AppState>(loadState);
  const [tab, setTab] = useState<Tab>('home');
  const [activeTask, setActiveTask] = useState<TaskId | null>(null);

  useEffect(() => saveState(state), [state]);

  const taskDef = ALL_TASKS.find((t) => t.id === activeTask);

  const finishSession = (records: QuestionRecord[], firstTryCount: number) => {
    if (!taskDef) return;
    setState((prev) => {
      let s = prev;
      for (const r of records) s = recordAnswer(s, r);
      s = completeTask(s, taskDef.id, taskDef.bonus);
      s = { ...s, stars: s.stars + firstTryCount, totalStars: s.totalStars + firstTryCount };
      s = touchStreak(s);
      return s;
    });
  };

  return (
    <div className="h-full relative" style={{ background: 'var(--bg)' }}>
      {/* 桌面端漂浮符号 */}
      {DOODLES.map((d, i) => (
        <span
          key={i}
          className="hidden md:block fixed font-num font-extrabold select-none pointer-events-none float-soft"
          style={{ left: d.x, top: d.y, fontSize: d.s, color: 'rgba(25,87,54,0.10)', animationDelay: d.d }}
        >
          {d.t}
        </span>
      ))}

      {/* 应用栏：手机 430px / 平板 700px / 桌面 920px */}
      <div className="h-full max-w-[430px] md:max-w-[700px] lg:max-w-[920px] mx-auto flex flex-col relative md:border-x md:border-green-900/10 md:shadow-[0_0_60px_-20px_rgba(25,87,54,0.15)]" style={{ background: 'var(--bg)' }}>
        <main className="flex-1 overflow-y-auto scroll-hide px-5 md:px-8 pb-4">
          {tab === 'home' && <TodayHome state={state} onStartTask={setActiveTask} />}
          {tab === 'pet' && <PetHouse state={state} onChange={setState} />}
          {tab === 'parent' && <ParentZone state={state} onChange={setState} />}
        </main>

        {/* 底部导航 */}
        <nav className="shrink-0 bg-white/95 backdrop-blur border-t border-green-900/10 px-6 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          <div className="flex justify-around">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-2xl transition-all active:scale-90"
                  style={{ color: active ? 'var(--forest)' : '#9aa89f' }}
                >
                  {t.icon(active)}
                  <span className="text-[11px] font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* 练习覆盖层：数学用数字键盘，语文用选择题 */}
      {taskDef?.kind === 'numpad' && (
        <PracticeSession
          task={taskDef}
          genQuestions={() => taskDef.gen(state.settings)}
          soundOn={state.settings.soundOn}
          petLevel={petLevel(state.totalStars)}
          onFinish={finishSession}
          onExit={() => setActiveTask(null)}
        />
      )}
      {taskDef?.kind === 'choice' && (
        <ChoiceSession
          task={taskDef}
          genQuestions={() => taskDef.gen(state.settings)}
          soundOn={state.settings.soundOn}
          petLevel={petLevel(state.totalStars)}
          onFinish={finishSession}
          onExit={() => setActiveTask(null)}
        />
      )}
      <span className="hidden">{todayStr()}</span>
    </div>
  );
}
