import { useId } from 'react';

// 星宝（猫咪形态）：SVG 手绘橘猫，参考水彩萌宠风
// 支持表情（mood）、等级配饰（皇冠/光环/铃铛项圈）、持续眨眼、喂食时快速摇尾+连续眨眼
interface Props {
  mood?: 'happy' | 'ok' | 'hungry';
  level?: number;
  size?: number;
  wagging?: boolean; // 喂食狂欢：快速摇尾巴 + 连续眨眼
  className?: string;
}

export default function CatPet({ mood = 'happy', level = 1, size = 120, wagging = false, className = '' }: Props) {
  const uid = useId().replace(/[:]/g, '');
  const gBody = `cb${uid}`;
  const gHead = `ch${uid}`;
  const eyeCls = wagging ? 'cat-blink-fast' : 'cat-blink';
  const tailCls = wagging ? 'tail-wag' : 'tail-idle';

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-label="猫咪星宝">
      <defs>
        <radialGradient id={gBody} cx="45%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#f9cf95" />
          <stop offset="55%" stopColor="#f3b264" />
          <stop offset="100%" stopColor="#ec9f4a" />
        </radialGradient>
        <radialGradient id={gHead} cx="45%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#fad49c" />
          <stop offset="100%" stopColor="#f2ae5e" />
        </radialGradient>
      </defs>

      {/* 五级：星光光环 */}
      {level >= 5 && (
        <circle cx="100" cy="98" r="90" fill="none" stroke="#ffd75e" strokeWidth="3" strokeDasharray="5 9" strokeLinecap="round" className="spin-slow" style={{ transformOrigin: '50% 50%' }} />
      )}

      {/* 地面影子 */}
      <ellipse cx="100" cy="184" rx="54" ry="8" fill="#e9a35c" opacity="0.18" />

      {/* 尾巴（条纹，可摇动） */}
      <g className={tailCls}>
        <path d="M136,170 C168,166 190,148 186,112" fill="none" stroke="#f0a854" strokeWidth="21" strokeLinecap="round" />
        <rect x="148" y="155" width="22" height="8" rx="4" fill="#de8a34" transform="rotate(-24 159 159)" />
        <rect x="166" y="132" width="22" height="8" rx="4" fill="#de8a34" transform="rotate(-48 177 136)" />
        <rect x="173" y="106" width="20" height="8" rx="4" fill="#de8a34" transform="rotate(-70 183 110)" />
      </g>

      {/* 身体 */}
      <path
        d="M100,90 C62,90 52,126 54,158 C55,176 72,184 100,184 C128,184 145,176 146,158 C148,126 138,90 100,90 Z"
        fill={`url(#${gBody})`}
      />
      {/* 身体两侧虎斑 */}
      <path d="M58,124 q8,4 2,12" stroke="#e09a44" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M142,124 q-8,4 -2,12" stroke="#e09a44" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* 奶白色胸毛 */}
      <ellipse cx="100" cy="148" rx="33" ry="35" fill="#fff6e8" />

      {/* 前爪 */}
      <ellipse cx="81" cy="176" rx="13" ry="11" fill="#fff6e8" />
      <ellipse cx="119" cy="176" rx="13" ry="11" fill="#fff6e8" />
      <path d="M77,178 v6 M85,178 v6 M115,178 v6 M123,178 v6" stroke="#e8c9a0" strokeWidth="2" strokeLinecap="round" />

      {/* 耳朵 */}
      <path d="M64,44 L54,8 L94,27 Z" fill={`url(#${gHead})`} />
      <path d="M136,44 L146,8 L106,27 Z" fill={`url(#${gHead})`} />
      <path d="M67,37 L61,16 L86,28 Z" fill="#ffb3a7" />
      <path d="M133,37 L139,16 L114,28 Z" fill="#ffb3a7" />

      {/* 头 */}
      <circle cx="100" cy="64" r="45" fill={`url(#${gHead})`} />
      {/* 腮边绒毛 */}
      <path d="M57,66 L45,72 L57,78 Z" fill="#f2ae5e" />
      <path d="M143,66 L155,72 L143,78 Z" fill="#f2ae5e" />
      {/* 额头虎斑 */}
      <path d="M87,26 q-1,7 -2,12 M100,22 q0,8 0,13 M113,26 q1,7 2,12" stroke="#e0913d" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* 脸颊虎斑 */}
      <path d="M62,56 q-7,2 -11,6 M63,69 q-7,3 -10,7" stroke="#e0913d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M138,56 q7,2 11,6 M137,69 q7,3 10,7" stroke="#e0913d" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* 眼睛（会眨） */}
      {mood === 'happy' ? (
        <g className={eyeCls}>
          <path d="M67,64 Q79,53 91,64" stroke="#43301c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M109,64 Q121,53 133,64" stroke="#43301c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className={eyeCls}>
          <circle cx="79" cy="62" r="11" fill="#43301c" />
          <circle cx="121" cy="62" r="11" fill="#43301c" />
          <circle cx="75.5" cy="58" r="3.6" fill="#fff" />
          <circle cx="117.5" cy="58" r="3.6" fill="#fff" />
          <circle cx="82.5" cy="66" r="1.6" fill="#fff" opacity="0.85" />
          <circle cx="124.5" cy="66" r="1.6" fill="#fff" opacity="0.85" />
          {mood === 'hungry' && (
            <>
              <path d="M67,53 Q79,49 91,54" stroke="#43301c" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M109,54 Q121,49 133,53" stroke="#43301c" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>
      )}

      {/* 鼻子 + 嘴 */}
      <path d="M93,79 Q100,74.5 107,79 Q104,87 100,87 Q96,87 93,79 Z" fill="#f2828f" />
      {mood === 'happy' ? (
        <>
          <path d="M91,88 Q100,99 109,88 Q100,93.5 91,88 Z" fill="#8a4b32" />
          <path d="M96,91.5 Q100,99 104,91.5 Z" fill="#ff9aa8" />
        </>
      ) : mood === 'hungry' ? (
        <path d="M94,91.5 Q100,89 106,91.5" stroke="#b0764a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      ) : (
        <>
          <path d="M100,87 Q100,92 94,92.5" stroke="#b0764a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M100,87 Q100,92 106,92.5" stroke="#b0764a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* 腮红 + 胡须 */}
      <ellipse cx="60" cy="82" rx="8" ry="5" fill="#ffb3a7" opacity="0.5" />
      <ellipse cx="140" cy="82" rx="8" ry="5" fill="#ffb3a7" opacity="0.5" />
      <g stroke="#ead9c2" strokeWidth="2" strokeLinecap="round">
        <path d="M54,74 L22,66" />
        <path d="M54,81 L20,81" />
        <path d="M54,88 L24,96" />
        <path d="M146,74 L178,66" />
        <path d="M146,81 L180,81" />
        <path d="M146,88 L176,96" />
      </g>

      {/* 三级：小皇冠 */}
      {level >= 3 && (
        <g transform="rotate(-6 100 16)">
          <path d="M84,22 L88,8 L96,17 L100,5 L104,17 L112,8 L116,22 Z" fill="#ffdf6b" stroke="#c77f02" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="100" cy="14" r="2" fill="#ea4464" />
        </g>
      )}

      {/* 七级：金铃铛红项圈 */}
      {level >= 7 && (
        <>
          <path d="M63,101 Q100,117 137,101" stroke="#ea4464" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="113" r="7" fill="#ffd75e" stroke="#c77f02" strokeWidth="2" />
          <path d="M100,109 v7" stroke="#c77f02" strokeWidth="1.6" />
          <circle cx="100" cy="118.5" r="1.4" fill="#c77f02" />
        </>
      )}
    </svg>
  );
}
