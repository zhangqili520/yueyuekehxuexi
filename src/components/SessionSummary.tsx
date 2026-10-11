import Confetti from './Confetti';
import CatPet from './CatPet';

interface Props {
  starsEarned: number;
  accuracy: number;
  firstTry: number;
  total: number;
  petLevel: number;
  onExit: () => void;
}

/** 练习结算页：数学/语文共用 */
export default function SessionSummary({ starsEarned, accuracy, firstTry, total, petLevel, onExit }: Props) {
  return (
    <div className="fixed inset-0 z-40 doodle-bg" style={{ background: 'var(--bg)' }}>
      <Confetti burst />
      <div className="h-full max-w-[430px] md:max-w-[560px] mx-auto flex flex-col items-center justify-center px-8 text-center">
        <CatPet mood="happy" level={petLevel} size={132} wagging className="breathe" />
        <p className="font-kuai text-3xl mt-5 pop-in">任务完成！</p>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--ink-soft)' }}>星宝为你骄傲 ✨</p>

        <div className="card-soft w-full mt-7 p-5 grid grid-cols-3 divide-x divide-green-900/10 rise-in" style={{ animationDelay: '0.15s' }}>
          <div>
            <p className="font-num font-extrabold text-3xl" style={{ color: 'var(--gold-deep)' }}>+{starsEarned}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>⭐ 获得星星</p>
          </div>
          <div>
            <p className="font-num font-extrabold text-3xl" style={{ color: 'var(--forest)' }}>{accuracy}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>正确率</p>
          </div>
          <div>
            <p className="font-num font-extrabold text-3xl" style={{ color: '#47a0a0' }}>
              {firstTry}
              <span className="text-base">/{total}</span>
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>一次答对</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="btn-chunky w-full mt-7 py-4 text-lg font-kuai text-white rise-in"
          style={{ background: 'var(--forest)', animationDelay: '0.25s' }}
        >
          收下星星，回去找星宝
        </button>
      </div>
    </div>
  );
}
