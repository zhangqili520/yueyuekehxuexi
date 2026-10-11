import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#ffbf2e', '#ea4464', '#47a0a0', '#7e549f', '#6dba8d', '#e48f15', '#eeaacc'];

interface Piece {
  left: number;
  delay: number;
  dur: number;
  size: number;
  color: string;
  cx: number;
  cy: number;
  cr: number;
  round: boolean;
}

/** 撒花：burst=true 满屏庆祝；否则小规模奖励 */
export default function Confetti({ burst = false, onDone }: { burst?: boolean; onDone?: () => void }) {
  const pieces = useMemo<Piece[]>(() => {
    const n = burst ? 46 : 14;
    return Array.from({ length: n }, () => ({
      left: burst ? Math.random() * 100 : 30 + Math.random() * 40,
      delay: Math.random() * 0.25,
      dur: 1.1 + Math.random() * 0.9,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      cx: (Math.random() - 0.5) * (burst ? 160 : 90),
      cy: 180 + Math.random() * 160,
      cr: (Math.random() - 0.5) * 720,
      round: Math.random() > 0.5,
    }));
  }, [burst]);

  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      onDone?.();
    }, 2300);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-[-12px]"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 0.55,
              background: p.color,
              borderRadius: p.round ? '50%' : 2,
              animationDelay: `${p.delay}s`,
              '--cx': `${p.cx}px`,
              '--cy': `${p.cy}px`,
              '--cr': `${p.cr}deg`,
              '--cd': `${p.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
