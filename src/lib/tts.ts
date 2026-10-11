// ===== 英语发音 =====
// 主通道：本地真人发音音频（打包在应用内，不依赖网络与浏览器语音包）
// 兜底通道：浏览器语音合成（修复了 utterance 被垃圾回收导致静默的已知问题）
import { AUDIO_CLIPS } from './audioManifest';

/** 发音文本 → 本地音频文件名 */
function slugOf(text: string): string {
  const t = text.trim();
  if (/^[A-Za-z]$/.test(t)) return `letter-${t.toLowerCase()}`; // 单字母 → letter-x
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null; // 必须保留引用，否则浏览器会静默中断播放
let unlocked = false;

// ---------- 浏览器语音合成（兜底） ----------
let voices: SpeechSynthesisVoice[] = [];
function refreshVoices() {
  try {
    voices = window.speechSynthesis?.getVoices() ?? [];
  } catch {
    voices = [];
  }
}

function speakBySynth(text: string, rate: number) {
  try {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    setTimeout(() => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        currentUtterance = u; // 保留引用防回收
        u.onend = () => {
          if (currentUtterance === u) currentUtterance = null;
        };
        u.lang = 'en-US';
        u.rate = rate;
        u.pitch = 1.05;
        u.volume = 1;
        if (!voices.length) refreshVoices();
        const v =
          voices.find((x) => x.lang.replace('_', '-').startsWith('en-US')) ||
          voices.find((x) => x.lang.startsWith('en')) ||
          voices[0]; // 没有英语语音包时用任意可用语音，保证能出声
        if (v) {
          u.voice = v;
          if (!v.lang.startsWith('en')) u.lang = v.lang;
        }
        synth.resume();
        synth.speak(u);
      } catch {
        /* ignore */
      }
    }, 60);
  } catch {
    /* ignore */
  }
}

// ---------- 首次交互解锁（自动播放策略） ----------
if (typeof window !== 'undefined') {
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    try {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        currentUtterance = u;
        window.speechSynthesis.speak(u);
      }
    } catch {
      /* ignore */
    }
    window.removeEventListener('pointerdown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  if ('speechSynthesis' in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

/** 朗读英文文本：优先本地真人发音，失败自动回退语音合成 */
export function speak(text: string, rate = 0.9) {
  const slug = slugOf(text);
  if (AUDIO_CLIPS.has(slug)) {
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      currentAudio?.pause();
      const audio = new Audio(`/audio/en/${slug}.mp3`);
      currentAudio = audio;
      audio.playbackRate = rate;
      audio.play().catch(() => speakBySynth(text, rate));
      return;
    } catch {
      /* fall through to synth */
    }
  }
  speakBySynth(text, rate);
}
