/**
 * Tiny UI sound effects synthesized with the Web Audio API (no audio files
 * needed). Kept deliberately quiet/short so they read as feedback, not noise.
 */
let ctx;

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(audio, freq, start, duration, gain) {
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(g).connect(audio.destination);
  const t0 = audio.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Soft blip for button/mode taps. */
export function playClick() {
  const audio = getCtx();
  if (!audio) return;
  tone(audio, 680, 0, 0.05, 0.06);
}

/** Cheerful rising two-note chime for a correct answer. */
export function playCorrect() {
  const audio = getCtx();
  if (!audio) return;
  tone(audio, 880, 0, 0.12, 0.1);
  tone(audio, 1175, 0.1, 0.18, 0.1);
}

/** Gentle falling two-note tone for an incorrect answer. */
export function playIncorrect() {
  const audio = getCtx();
  if (!audio) return;
  tone(audio, 320, 0, 0.16, 0.09);
  tone(audio, 220, 0.13, 0.22, 0.09);
}
