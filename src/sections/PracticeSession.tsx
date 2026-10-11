import { useEffect, useMemo, useRef, useState } from 'react';
import { PRAISES, COMFORTS } from '../lib/questions';
import type { Question, TaskDef } from '../lib/questions';
import { sfx, todayStr } from '../lib/store';
import type { QuestionRecord } from '../lib/store';
import Confetti from '../components/Confetti';
import SessionSummary from '../components/SessionSummary';

interface Props {
  task: TaskDef;
  genQuestions: () => Question[];
  soundOn: boolean;
  petLevel: number;
  onFinish: (records: QuestionRecord[], firstTryCount: number) => void;
  onExit: () => void;
}

type Phase = 'run' | 'summary';

export default function PracticeSession({ task, genQuestions, soundOn, petLevel, onFinish, onExit }: Props) {
  const questions = useMemo(genQuestions, [genQuestions]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('run');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [tried, setTried] = useState(false);
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const [praise, setPraise] = useState('');
  const [comfort, setComfort] = useState('');
  const [confettiKey, setConfettiKey] = useState(0);
  const startRef = useRef(Date.now());

  const q = questions[idx];
  const play = (fn: () => void) => {
    if (soundOn) fn();
  };

  useEffect(() => {
    startRef.current = Date.now();
  }, [idx]);

  const submit = () => {
    if (feedback === 'correct' || input === '') return;
    const val = parseInt(input, 10);
    if (val === q.answer) {
      if (soundOn) {
        sfx.clap();
        setTimeout(() => sfx.correct(), 380);
      }
      setPraise(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
      setFeedback('correct');
      setConfettiKey((k) => k + 1);
      const rec: QuestionRecord = {
        date: todayStr(),
        skill: q.skill,
        correct: true,
        firstTry: !tried,
        timeMs: Date.now() - startRef.current,
      };
      const next = [...records, rec];
      setRecords(next);
      setTimeout(() => {
        if (idx + 1 >= questions.length) {
          setPhase('summary');
          play(sfx.fanfare);
          onFinish(next, next.filter((r) => r.firstTry).length);
        } else {
          setIdx((i) => i + 1);
          setInput('');
          setFeedback('idle');
          setShowHint(false);
          setTried(false);
        }
      }, 1100);
    } else {
      play(sfx.wrong);
      setComfort(COMFORTS[Math.floor(Math.random() * COMFORTS.length)]);
      setFeedback('wrong');
      setTried(true);
      setShowHint(true);
      setInput('');
      setTimeout(() => setFeedback('idle'), 700);
    }
  };

  const pressKey = (k: string) => {
    play(sfx.tap);
    if (k === 'del') setInput((s) => s.slice(0, -1));
    else if (k === 'ok') submit();
    else if (input.length < 3) setInput((s) => s + k);
  };

  if (phase === 'summary') {
    const firstTry = records.filter((r) => r.firstTry).length;
    const acc = Math.round((records.filter((r) => r.correct).length / records.length) * 100);
    return (
      <SessionSummary
        starsEarned={firstTry + task.bonus}
        accuracy={acc}
        firstTry={firstTry}
        total={records.length}
        petLevel={petLevel}
        onExit={onExit}
      />
    );
  }

  const progress = idx / questions.length;

  return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{ background: 'var(--bg)' }}>
      {feedback === 'correct' && <Confetti key={confettiKey} />}

      <div className="w-full max-w-[430px] md:max-w-[600px] mx-auto flex-1 flex flex-col min-h-0">
        {/* 顶部：退出 + 进度 */}
        <div className="flex items-center gap-3 px-4 pt-4">
          <button onClick={onExit} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg shadow-sm" style={{ color: 'var(--ink-soft)' }} aria-label="退出练习">
            ✕
          </button>
          <div className="flex-1 h-3.5 rounded-full bg-white overflow-hidden shadow-inner">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(progress * 100, 6)}%`, background: task.gradVar }} />
          </div>
          <span className="font-num font-bold text-sm" style={{ color: 'var(--ink-soft)' }}>
            {idx + 1}/{questions.length}
          </span>
        </div>

        {/* 题目区 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0" key={q.id}>
          <span className="text-xs font-bold rounded-full px-3 py-1 text-white mb-4 pop-in" style={{ background: task.gradVar }}>{q.skill}</span>

          {q.suffix ? (
            <div className={`font-num font-extrabold text-center leading-none ${feedback === 'wrong' ? 'shake-no' : ''}`} style={{ fontSize: 'clamp(2.6rem, 9vw, 4.4rem)', letterSpacing: '0.02em' }}>
              {q.prompt}
              <span style={{ color: 'var(--ink-soft)' }}>{q.suffix.slice(0, -1)}</span>
              <span className="inline-block min-w-[1.6em] rounded-2xl px-2 mx-1" style={{ background: feedback === 'correct' ? '#d9f2c9' : '#fff', boxShadow: 'inset 0 2px 6px rgba(20,38,27,0.12)', color: input ? 'var(--forest)' : 'var(--ink-soft)' }}>
                {input || '?'}
              </span>
            </div>
          ) : (
            <div className={`card-soft p-5 md:p-7 w-full ${feedback === 'wrong' ? 'shake-no' : ''}`}>
              <p className="text-lg md:text-xl leading-relaxed font-medium">{q.prompt}</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="font-num font-extrabold text-4xl rounded-2xl px-5 py-1 min-w-[3em] text-center" style={{ background: feedback === 'correct' ? '#d9f2c9' : 'var(--bg-deep)', color: input ? 'var(--forest)' : 'var(--ink-soft)', boxShadow: 'inset 0 2px 6px rgba(20,38,27,0.1)' }}>
                  {input || '?'}
                </span>
                {q.unit && <span className="text-lg font-bold" style={{ color: 'var(--ink-soft)' }}>{q.unit}</span>}
              </div>
            </div>
          )}

          {/* 反馈/提示气泡 */}
          <div className="h-24 mt-4 flex items-start justify-center w-full">
            {feedback === 'correct' && (
              <p className="font-kuai text-2xl pop-in" style={{ color: 'var(--gold-deep)' }}>
                {praise} <span className="font-num">+1</span>⭐
              </p>
            )}
            {showHint && feedback !== 'correct' && (
              <div className="bubble-pop card-soft px-4 py-3 flex items-start gap-2.5 max-w-full">
                <span className="text-lg shrink-0">💡</span>
                <div>
                  {comfort && <p className="text-sm font-bold" style={{ color: 'var(--coral)' }}>{comfort}</p>}
                  <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{q.hint}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 数字键盘 */}
        <div className="px-5 pb-6 pt-1">
          <div className="grid grid-cols-3 gap-2.5 md:gap-3 max-w-[330px] md:max-w-[420px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
              <button key={k} onClick={() => pressKey(k)} className="key-btn font-num font-extrabold text-2xl md:text-3xl py-3.5 md:py-4" style={{ color: 'var(--ink)' }}>
                {k}
              </button>
            ))}
            <button onClick={() => pressKey('del')} className="key-btn text-xl md:text-2xl py-3.5 md:py-4" style={{ color: 'var(--coral)' }} aria-label="删除">
              ⌫
            </button>
            <button onClick={() => pressKey('0')} className="key-btn font-num font-extrabold text-2xl md:text-3xl py-3.5 md:py-4" style={{ color: 'var(--ink)' }}>
              0
            </button>
            <button
              onClick={() => pressKey('ok')}
              className="btn-chunky text-xl md:text-2xl py-3.5 md:py-4 font-kuai text-white"
              style={{ background: input ? 'var(--forest)' : '#9fb5a7' }}
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
