import { useMemo, useState } from 'react';
import { lastNDays, todayStr, weakSkills, defaultState, DEFAULT_COUNTS } from '../lib/store';
import { getTodayTasks } from '../lib/questions';
import type { AppState } from '../lib/store';

interface Props {
  state: AppState;
  onChange: (s: AppState) => void;
}

const WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];

/** 各板块题量可调档位（统一 5/10/15/20） */
const COUNT_OPTIONS = [5, 10, 15, 20];
const COUNT_GROUPS: { subject: string; color: string; items: { id: string; label: string }[] }[] = [
  {
    subject: '数学', color: '#47a0a0',
    items: [
      { id: 'oral', label: '口算小达人' },
      { id: 'mult', label: '乘除法闯关' },
      { id: 'word', label: '应用题挑战' },
    ],
  },
  {
    subject: '语文', color: '#ea5150',
    items: [
      { id: 'zi', label: '生字小达人' },
      { id: 'ci', label: '词语百宝箱' },
      { id: 'shi', label: '古诗小诗人' },
    ],
  },
  {
    subject: '英语', color: '#4f86bb',
    items: [
      { id: 'letter', label: '字母乐园' },
      { id: 'eword', label: '单词小达人' },
      { id: 'sent', label: '句子小达人' },
    ],
  },
];

export default function ParentZone({ state, onChange }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [gateQ, setGateQ] = useState(() => ({ a: 3 + Math.floor(Math.random() * 7), b: 3 + Math.floor(Math.random() * 7) }));
  const [gateInput, setGateInput] = useState('');
  const [gateErr, setGateErr] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const today = todayStr();
  const dayLog = state.days[today];
  const todayTaskCount = getTodayTasks().length;
  const week = lastNDays(7);
  const skills = useMemo(() => weakSkills(state.records), [state.records]);
  const totalQ = state.records.length;
  const totalCorrect = state.records.filter((r) => r.correct).length;

  const tryUnlock = () => {
    if (parseInt(gateInput, 10) === gateQ.a * gateQ.b) {
      setUnlocked(true);
    } else {
      setGateErr(true);
      setGateInput('');
      setGateQ({ a: 3 + Math.floor(Math.random() * 7), b: 3 + Math.floor(Math.random() * 7) });
      setTimeout(() => setGateErr(false), 600);
    }
  };

  if (!unlocked) {
    return (
      <div className="pb-28 flex flex-col items-center pt-16 px-6">
        <div className="card-soft p-7 w-full max-w-[420px] text-center rise-in">
          <span className="text-4xl">🔐</span>
          <p className="font-kuai text-2xl mt-3">家长验证</p>
          <p className="text-sm mt-1.5" style={{ color: 'var(--ink-soft)' }}>这道题请爸爸妈妈来答</p>
          <p className={`font-num font-extrabold text-4xl mt-6 ${gateErr ? 'shake-no' : ''}`}>
            {gateQ.a} × {gateQ.b} = <span style={{ color: 'var(--forest)' }}>{gateInput || '?'}</span>
          </p>
          <div className="grid grid-cols-3 gap-2.5 mt-6 max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].map((k) => (
              <button
                key={k}
                onClick={() => {
                  if (k === '⌫') setGateInput((s) => s.slice(0, -1));
                  else if (k === '✓') tryUnlock();
                  else if (gateInput.length < 3) setGateInput((s) => s + k);
                }}
                className="key-btn font-num font-bold text-xl py-3"
                style={{ color: k === '✓' ? 'var(--forest)' : k === '⌫' ? 'var(--coral)' : 'var(--ink)' }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxQ = Math.max(...week.map((d) => state.days[d]?.questions ?? 0), 1);

  return (
    <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-5 md:items-start pb-28">
      <div className="flex items-center justify-between pt-2 px-1 md:col-span-2">
        <p className="font-kuai text-2xl md:text-3xl">家长中心</p>
        <button onClick={() => setUnlocked(false)} className="text-xs font-bold rounded-full px-3 py-1.5 bg-white shadow-sm" style={{ color: 'var(--ink-soft)' }}>
          退出
        </button>
      </div>

      {/* 今日简报 */}
      <div className="card-soft p-5 rise-in md:col-span-2">
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--ink-soft)' }}>今日简报 · {today.slice(5).replace('-', '/')}</p>
        {dayLog && dayLog.questions > 0 ? (
          <div className="grid grid-cols-3 divide-x divide-green-900/10 text-center">
            <div>
              <p className="font-num font-extrabold text-2xl" style={{ color: 'var(--forest)' }}>{dayLog.questions}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>完成题数</p>
            </div>
            <div>
              <p className="font-num font-extrabold text-2xl" style={{ color: 'var(--gold-deep)' }}>{Math.round((dayLog.correct / dayLog.questions) * 100)}%</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>正确率</p>
            </div>
            <div>
              <p className="font-num font-extrabold text-2xl" style={{ color: '#47a0a0' }}>{dayLog.tasksCompleted.length}/{todayTaskCount}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>任务完成</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-center py-3" style={{ color: 'var(--ink-soft)' }}>今天还没有练习记录，提醒宝贝去完成任务吧～</p>
        )}
      </div>

      {/* 近 7 天练习量 */}
      <div className="card-soft p-5 rise-in" style={{ animationDelay: '0.06s' }}>
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--ink-soft)' }}>近 7 天练习量</p>
        <div className="flex items-end justify-between gap-2 h-32 px-1">
          {week.map((d, i) => {
            const n = state.days[d]?.questions ?? 0;
            const wd = WEEK_CN[new Date(d + 'T12:00:00').getDay()];
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="font-num text-[11px] font-bold" style={{ color: 'var(--ink-soft)' }}>{n > 0 ? n : ''}</span>
                <div
                  className="w-full max-w-[34px] rounded-t-lg bar-grow"
                  style={{
                    height: `${(n / maxQ) * 78 + (n > 0 ? 6 : 0)}%`,
                    minHeight: n > 0 ? 10 : 3,
                    background: n > 0 ? 'linear-gradient(180deg,#6dba8d,#47a0a0)' : 'var(--bg-deep)',
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
                <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{wd}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-center mt-3" style={{ color: 'var(--ink-soft)' }}>
          累计 {totalQ} 题 · 总正确率 {totalQ ? Math.round((totalCorrect / totalQ) * 100) : 0}% · 连续打卡 {state.streak} 天
        </p>
      </div>

      {/* 薄弱知识点 */}
      <div className="card-soft p-5 rise-in" style={{ animationDelay: '0.12s' }}>
        <p className="text-sm font-bold mb-3" style={{ color: 'var(--ink-soft)' }}>知识点掌握（按首次正确率排序）</p>
        {skills.length === 0 ? (
          <p className="text-sm text-center py-2" style={{ color: 'var(--ink-soft)' }}>完成练习后这里会生成分析</p>
        ) : (
          <div className="space-y-3">
            {skills.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">
                    {s.skill}
                    {s.rate < 0.8 && s.total >= 5 && <span className="ml-1.5 text-[10px] rounded-full px-1.5 py-0.5 text-white align-middle" style={{ background: 'var(--coral)' }}>需加强</span>}
                  </span>
                  <span className="font-num text-xs" style={{ color: 'var(--ink-soft)' }}>
                    {Math.round(s.rate * 100)}% · {s.total}题
                  </span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-deep)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.rate * 100}%`, background: s.rate >= 0.9 ? '#6dba8d' : s.rate >= 0.75 ? 'var(--gold)' : 'var(--coral)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 设置：各板块题量 + 音效 */}
      <div className="card-soft p-5 space-y-4 rise-in md:col-span-2" style={{ animationDelay: '0.18s' }}>
        <p className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>练习设置 · 每个板块的题量</p>
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-5 md:space-y-0">
          {COUNT_GROUPS.map((g) => (
            <div key={g.subject}>
              <p className="text-xs font-bold mb-2.5 rounded-full inline-block px-2.5 py-0.5 text-white" style={{ background: g.color }}>{g.subject}</p>
              <div className="space-y-2.5">
                {g.items.map((it) => {
                  const cur = state.settings.counts[it.id] ?? DEFAULT_COUNTS[it.id];
                  return (
                    <div key={it.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold shrink-0">{it.label}</span>
                      <div className="flex gap-1.5">
                        {COUNT_OPTIONS.map((n) => (
                          <button
                            key={n}
                            onClick={() => onChange({ ...state, settings: { ...state.settings, counts: { ...state.settings.counts, [it.id]: n } } })}
                            className="w-9 h-8 rounded-xl font-num font-bold text-sm transition-all"
                            style={{
                              background: cur === n ? 'var(--forest)' : 'var(--bg-deep)',
                              color: cur === n ? '#fff' : 'var(--ink-soft)',
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-green-900/10 pt-3.5">
          <span className="text-sm font-bold">音效</span>
          <button
            onClick={() => onChange({ ...state, settings: { ...state.settings, soundOn: !state.settings.soundOn } })}
            className="w-14 h-8 rounded-full relative transition-colors"
            style={{ background: state.settings.soundOn ? '#6dba8d' : '#cbd5ce' }}
            aria-label="音效开关"
          >
            <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all" style={{ left: state.settings.soundOn ? 'calc(100% - 28px)' : 4 }} />
          </button>
        </div>
      </div>

      {/* 数据说明 + 重置 */}
      <div className="card-soft p-5 rise-in" style={{ animationDelay: '0.24s' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          数据仅保存在本设备浏览器中，不会上传。当前版本为家庭内测版（V1.0），清除浏览器数据会导致记录丢失。
        </p>
        {confirmReset ? (
          <div className="flex gap-2.5 mt-4">
            <button onClick={() => setConfirmReset(false)} className="btn-chunky flex-1 py-2.5 text-sm font-bold" style={{ background: 'var(--bg-deep)', color: 'var(--ink-soft)' }}>
              取消
            </button>
            <button
              onClick={() => {
                onChange(defaultState());
                setConfirmReset(false);
                setUnlocked(false);
              }}
              className="btn-chunky flex-1 py-2.5 text-sm font-bold text-white"
              style={{ background: 'var(--coral)' }}
            >
              确认清空
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="mt-4 text-xs font-bold underline" style={{ color: 'var(--coral)' }}>
            清空全部学习数据
          </button>
        )}
      </div>
    </div>
  );
}
