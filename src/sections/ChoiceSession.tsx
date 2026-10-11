import { useEffect, useMemo, useRef, useState } from 'react';
import { PRAISES, COMFORTS } from '../lib/questions';
import type { ChoiceQ, ChoiceTask } from '../lib/taskTypes';
import { sfx, todayStr } from '../lib/store';
import { speak } from '../lib/tts';
import type { QuestionRecord } from '../lib/store';
import Confetti from '../components/Confetti';
import SessionSummary from '../components/SessionSummary';

interface Props {
  task: ChoiceTask;
  genQuestions: () => ChoiceQ[];
  soundOn: boolean;
  petLevel: number;
  onFinish: (records: QuestionRecord[], firstTryCount: number) => void;
  onExit: () => void;
}

/** 语文/英语选择题练习：点选作答，答错给引导提示可重试；英语题支持发音与自动播放 */
export default function ChoiceSession({ task, genQuestions, soundOn, petLevel, onFinish, onExit }: Props) {
  const questions = useMemo(genQuestions, [genQuestions]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'run' | 'summary'>('run');
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [tried, setTried] = useState(false);
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const [praise, setPraise] = useState('');
  const [comfort, setComfort] = useState('');
  const [confettiKey, setConfettiKey] = useState(0);
  const startRef = useRef(Date.now());

  const q = questions[idx];

  useEffect(() => {
    startRef.current = Date.now();
    // 听音题：进入题目自动播放发音（发音是学习内容，不受音效开关控制）
    if (q.autoAudio && q.audio) {
      const t = setTimeout(() => speak(q.audio!), 350);
      return () => clearTimeout(t);
    }
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (i: number) => {
    if (picked !== null) return; // 已答对等待跳转
    if (i === q.answerIndex) {
      if (soundOn) {
        sfx.clap();
        setTimeout(() => sfx.correct(), 380);
      }
      setPraise(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
      setPicked(i);
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
          if (soundOn) sfx.fanfare();
          onFinish(next, next.filter((r) => r.firstTry).length);
        } else {
          setIdx((v) => v + 1);
          setPicked(null);
          setWrongIdx(null);
          setShowHint(false);
          setTried(false);
        }
      }, 1100);
    } else {
      if (soundOn) sfx.wrong();
      setComfort(COMFORTS[Math.floor(Math.random() * COMFORTS.length)]);
      setWrongIdx(i);
      setTried(true);
      setShowHint(true);
      setTimeout(() => setWrongIdx(null), 700);
    }
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
  const isShort = q.choices.every((c) => c.length <= 3);

  return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{ background: 'var(--bg)' }}>
      {picked !== null && <Confetti key={confettiKey} />}

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
          <span className="text-xs md:text-sm font-bold rounded-full px-3 py-1 text-white mb-4 pop-in" style={{ background: task.gradVar }}>{q.skill}</span>
          <p className="text-base md:text-lg font-bold mb-3" style={{ color: 'var(--ink-soft)' }}>{q.prompt}</p>

          <div className="card-soft w-full px-5 py-6 md:py-8 text-center relative">
            {q.audio && q.main === '🔊' ? (
              // 听音题：整张卡片是大喇叭按钮
              <button onClick={() => speak(q.audio!)} className="w-full active:scale-95 transition-transform" aria-label="播放发音">
                <p className="leading-snug" style={{ fontSize: 'clamp(3rem, 10vw, 4.4rem)' }}>🔊</p>
                <p className="text-sm font-bold mt-1" style={{ color: 'var(--ink-soft)' }}>点我再听一遍</p>
              </button>
            ) : (
              <>
                <p className="font-kuai leading-snug" style={{ fontSize: q.main.length > 8 ? 'clamp(1.7rem, 4.5vw, 2.6rem)' : 'clamp(2.2rem, 7vw, 3.6rem)' }}>{q.main}</p>
                {q.audio && (
                  <button
                    onClick={() => speak(q.audio!)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white active:scale-95 transition-transform"
                    style={{ background: task.gradVar }}
                    aria-label="播放发音"
                  >
                    🔊 点我发音
                  </button>
                )}
              </>
            )}
            {q.sub && (
              <p className="text-xs mt-2.5" style={{ color: 'var(--ink-soft)' }}>{q.sub}</p>
            )}
          </div>

          {/* 反馈/提示 */}
          <div className="h-9 mt-4 flex items-center justify-center w-full">
            {picked !== null && (
              <p className="font-kuai text-2xl pop-in" style={{ color: 'var(--gold-deep)' }}>
                {praise} <span className="font-num">+1</span>⭐
              </p>
            )}
            {picked === null && showHint && (
              <p className="text-sm font-bold pop-in" style={{ color: 'var(--coral)' }}>{comfort}</p>
            )}
          </div>
        </div>

        {/* 选项 + 提示 */}
        <div className="px-5 pb-7 pt-1">
          {showHint && picked === null && (
            <div className="bubble-pop card-soft px-4 py-2.5 flex items-start gap-2 mb-3 max-w-[340px] mx-auto">
              <span className="text-base shrink-0">💡</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{q.hint}</p>
            </div>
          )}
          <div className={isShort ? 'grid grid-cols-3 gap-3 md:gap-4 max-w-[340px] md:max-w-[460px] mx-auto' : 'space-y-2.5 max-w-[360px] md:max-w-[500px] mx-auto'}>
            {q.choices.map((c, i) => {
              const isRight = picked === i;
              const isWrong = wrongIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={`key-btn font-kuai ${isShort ? 'text-3xl md:text-4xl py-4 md:py-5' : 'w-full text-xl md:text-2xl py-3.5 md:py-4 px-4'} ${isWrong ? 'shake-no' : ''} ${isRight ? 'pop-in' : ''}`}
                  style={{
                    color: isRight ? '#fff' : 'var(--ink)',
                    background: isRight ? '#6dba8d' : isWrong ? '#ffe3e3' : '#fff',
                    boxShadow: isRight ? '0 4px 0 #4d8a68' : undefined,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
