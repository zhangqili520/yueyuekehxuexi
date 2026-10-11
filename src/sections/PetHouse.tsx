import { useState } from 'react';
import { feedPet, petLevel, petLevelProgress, PET_LEVELS, sfx } from '../lib/store';
import type { AppState } from '../lib/store';
import CatPet from '../components/CatPet';

interface Props {
  state: AppState;
  onChange: (s: AppState) => void;
}

const PET_SAYS = ['今天也要一起加油哦！', '我最喜欢数学题啦！', '答对题目我就有星星吃～', '你算题的样子真帅！', '明天也要来看我呀', '咕噜咕噜……有点饿了'];

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5">
        <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
        <span className="font-num" style={{ color: 'var(--ink-soft)' }}>{value}</span>
      </div>
      <div className="h-3 rounded-full" style={{ background: 'var(--bg-deep)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function PetHouse({ state, onChange }: Props) {
  const [say, setSay] = useState<string | null>(null);
  const [fedFlash, setFedFlash] = useState(false);
  const lv = petLevel(state.totalStars);
  const prog = petLevelProgress(state.totalStars);
  const mood = state.pet.happiness > 60 ? 'happy' : state.pet.happiness > 30 ? 'ok' : 'hungry';

  const soundOn = state.settings.soundOn;

  const poke = () => {
    if (soundOn) sfx.tap();
    setSay(PET_SAYS[Math.floor(Math.random() * PET_SAYS.length)]);
    setTimeout(() => setSay(null), 2200);
  };

  const feed = () => {
    const next = feedPet(state);
    if (!next) {
      setSay('星星不够啦，去做题赚星星吧！');
      setTimeout(() => setSay(null), 2200);
      return;
    }
    if (soundOn) {
      sfx.meow();
      setTimeout(() => sfx.correct(), 500);
    }
    onChange(next);
    setFedFlash(true);
    setSay('喵呜～谢谢你的星星饼干！');
    setTimeout(() => {
      setFedFlash(false);
      setSay(null);
    }, 2400);
  };

  return (
    <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-5 md:items-start pb-28">
      <p className="font-kuai text-2xl md:text-3xl pt-2 px-1 md:col-span-2">宠物乐园</p>

      {/* 宠物舞台 */}
      <div className="card-soft relative overflow-hidden rise-in" style={{ background: 'linear-gradient(180deg, #fff 0%, #fdf6e3 100%)' }}>
        <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: 'var(--bg-deep)', borderRadius: '50% 50% 0 0 / 30% 30% 0 0' }} />
        <div className="relative flex flex-col items-center py-8 px-5">
          {say && (
            <div className="bubble-pop absolute top-4 right-4 bg-white rounded-2xl px-3.5 py-2 shadow-md max-w-[180px] z-10">
              <p className="text-sm font-bold" style={{ color: 'var(--forest)' }}>{say}</p>
            </div>
          )}
          <button onClick={poke} className="active:scale-90 transition-transform md:scale-110 md:my-2" aria-label="摸一摸星宝">
            <CatPet mood={fedFlash || mood === 'happy' ? 'happy' : mood} level={lv} size={158} wagging={fedFlash} className={fedFlash ? '' : 'float-soft'} />
          </button>
          <p className="font-kuai text-2xl mt-3">
            {state.pet.name}
            <span className="ml-2 text-xs font-sans font-bold align-middle rounded-full px-2.5 py-1 text-white" style={{ background: 'var(--forest)' }}>
              Lv.{lv}
            </span>
          </p>

          {/* 升级进度 */}
          <div className="w-full max-w-[260px] mt-4">
            <div className="flex justify-between text-xs font-bold mb-1.5" style={{ color: 'var(--ink-soft)' }}>
              <span>升级进度</span>
              {lv < PET_LEVELS.length ? (
                <span className="font-num">{state.totalStars}/{prog.next} ⭐</span>
              ) : (
                <span>已满级 🎉</span>
              )}
            </div>
            <div className="h-3.5 rounded-full bg-white shadow-inner overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${prog.pct * 100}%`, background: 'linear-gradient(90deg,#ffbf2e,#e48f15)' }} />
            </div>
            <p className="text-[11px] mt-1.5 text-center" style={{ color: 'var(--ink-soft)' }}>
              {lv < 3 ? `Lv.3 解锁小皇冠（还需 ${PET_LEVELS[2] - state.totalStars} ⭐）` : lv < 5 ? `Lv.5 解锁星光光环（还需 ${PET_LEVELS[4] - state.totalStars} ⭐）` : lv < 7 ? `Lv.7 解锁金铃铛项圈（还需 ${PET_LEVELS[6] - state.totalStars} ⭐）` : '星宝已经闪闪发光啦'}
            </p>
          </div>
        </div>
      </div>

      {/* 状态 + 喂食 */}
      <div className="card-soft p-5 space-y-4 rise-in" style={{ animationDelay: '0.08s' }}>
        <Bar label="饱食度" value={state.pet.fullness} color="linear-gradient(90deg,#6dba8d,#47a0a0)" />
        <Bar label="开心值" value={state.pet.happiness} color="linear-gradient(90deg,#eeaacc,#f08e4c)" />
        <button onClick={feed} className="btn-chunky w-full py-4 font-kuai text-lg" style={{ background: 'var(--gold)', color: '#5a3a00' }}>
          喂星星饼干 <span className="font-num">-5</span> ⭐
          <span className="block text-xs font-sans font-normal opacity-70 mt-0.5">当前有 {state.stars} ⭐ · 已喂 {state.pet.totalFed} 次</span>
        </button>
      </div>

      <p className="text-center text-xs px-6 md:col-span-2" style={{ color: 'var(--ink-soft)' }}>完成练习赚星星，星宝吃得饱才会长得快哦</p>
    </div>
  );
}
