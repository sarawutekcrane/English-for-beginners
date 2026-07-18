import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { ALT_TRANSCRIPTIONS } from "../data/altTranscriptions";

let cachedVoice = null;

// Default to US English; the source app defaulted to a single locale (ja-JP)
// the same way, so we pick one sensible default rather than letting the
// learner's target accent vary by device. British English speakers can swap
// this for "en-GB" without touching any other file.
const TARGET_LANG_PREFIX = "en";
const PREFERRED_LOCALE = "en-US";

/** Higher score = clearer/more natural-sounding voice, based on name hints and service type. */
function voiceQualityScore(voice) {
  const name = voice.name?.toLowerCase() || "";
  let score = 0;
  if (voice.lang?.toLowerCase() === PREFERRED_LOCALE.toLowerCase()) score += 4;
  if (/google/.test(name)) score += 3;
  if (/natural|neural|premium|enhanced/.test(name)) score += 2;
  if (!voice.localService) score += 1; // network voices are usually higher fidelity
  return score;
}

function pickEnglishVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  const enVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith(TARGET_LANG_PREFIX));
  if (enVoices.length === 0) return null;
  cachedVoice = enVoices.reduce((best, v) => (voiceQualityScore(v) > voiceQualityScore(best) ? v : best));
  return cachedVoice;
}

/** Speaks English text aloud using the Web Speech API (speechSynthesis). No audio files needed. */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const { speechRate } = useSettings();
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    // Voice lists load async in some browsers.
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = null;
      pickEnglishVoice();
    };
    pickEnglishVoice();
  }, [supported]);

  const speak = useCallback(
    (text, { rate = speechRate } = {}) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = PREFERRED_LOCALE;
      utter.rate = rate;
      const voice = pickEnglishVoice();
      if (voice) utter.voice = voice;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [supported, speechRate]
  );

  return { speak, speaking, supported };
}

// The recognizer commonly prepends a filler article before the target word
// ("a car" for "car"). Stripping these before normalizing lets short targets
// still match that common case via the exact-match branch below, instead of
// needing the (riskier, for short words) "contains" fallback to catch it.
const LEADING_FILLERS = new Set(["a", "an", "the", "um", "uh"]);

function stripLeadingFillers(str) {
  const words = str.trim().split(/\s+/);
  while (words.length > 1 && LEADING_FILLERS.has(words[0].toLowerCase().replace(/[.,!?'";:()-]/g, ""))) {
    words.shift();
  }
  return words.join(" ");
}

function normalizeEn(str = "") {
  return stripLeadingFillers(str)
    .normalize("NFKC")
    .replace(/[\s.,!?'";:()-]/g, "")
    .toLowerCase();
}

// Below this length, "contains" matching is too dangerous to allow: real
// English words routinely contain short target words as substrings by pure
// coincidence (target "car" is a substring of "scarf"; target "bus" is a
// substring of "business"; target "hat" is a substring of "what"). Below
// this length on *either* side, only an exact match after normalization is
// accepted -- see matchesEnglish() bug 4(a) fix in the Phase 8 notes.
const MIN_LEN_FOR_CONTAINS = 4;

function looselyEqual(a, b) {
  if (a === b) return true;
  return a.length >= MIN_LEN_FOR_CONTAINS && b.length >= MIN_LEN_FOR_CONTAINS && (a.includes(b) || b.includes(a));
}

/**
 * Forgiving match, not exact-string equality: normalized strings equal, or
 * (for targets/transcripts both long enough that a coincidental substring
 * match is unlikely) either one contains the other -- handles filler words
 * the recognizer adds beyond a leading article, or the target being a
 * substring of a longer utterance. Falls back to a small alternate-
 * transcription table for known homophone/near-homophone confusions when
 * the direct match fails. Deliberately has no script-folding step (the
 * source app's katakana-to-hiragana equivalent) -- English has a single
 * script, so there's nothing to fold.
 */
export function matchesEnglish(transcript, target) {
  const a = normalizeEn(transcript);
  const b = normalizeEn(target);
  if (!a || !b) return false;
  if (looselyEqual(a, b)) return true;
  const alts = ALT_TRANSCRIPTIONS[target];
  if (alts) {
    return alts.some((alt) => looselyEqual(a, normalizeEn(alt)));
  }
  return false;
}

const SpeechRecognitionCtor =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

// Bug 4(b) fix: 8s was firing before recognition finished on slower
// devices/connections, producing a false "no speech detected" for an
// attempt that was actually still in progress. 12s gives cloud-backed
// recognizers (what most mobile browsers use) more room while still
// bounding the worst case so the UI can't hang indefinitely.
const RECOGNITION_TIMEOUT_MS = 12000;

/** Wraps the Web Speech API's SpeechRecognition for English speaking practice. */
export function useSpeechRecognition() {
  const supported = !!SpeechRecognitionCtor;
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const settledRef = useRef(false);

  const start = useCallback(
    ({ onResult, onError, onEnd } = {}) => {
      if (!supported) return;
      recognitionRef.current?.abort();
      clearTimeout(timeoutRef.current);
      settledRef.current = false;

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = PREFERRED_LOCALE;
      recognition.interimResults = false;
      // Bug 4(c) audit: these 5 alternatives are consumed ONLY inside
      // matchesEnglish()-style comparisons by the caller's onResult callback
      // (see SpeakingPractice.jsx) -- try-each-alternative for matching, one
      // top transcript for the "we heard: X" display. Nothing in this app
      // renders `alternatives` as a list of tappable options; if a future
      // change ever passes this array into a rendering path (e.g. by
      // copy-pasting Listening Quiz's option-grid pattern), that would be the
      // bug to look for.
      recognition.maxAlternatives = 5;

      const finish = () => {
        clearTimeout(timeoutRef.current);
        settledRef.current = true;
      };

      recognition.onstart = () => setListening(true);
      recognition.onresult = (event) => {
        finish();
        const results = event.results?.[0];
        const alternatives = results ? Array.from(results).map((alt) => alt.transcript) : [];
        onResult?.(alternatives[0] || "", alternatives);
      };
      recognition.onerror = (event) => {
        finish();
        onError?.(event.error);
      };
      recognition.onend = () => {
        setListening(false);
        clearTimeout(timeoutRef.current);
        // Some browsers end the session without ever firing onresult/onerror
        // (e.g. permission hiccups). Without this, the UI looks "frozen".
        if (!settledRef.current) {
          settledRef.current = true;
          onError?.("no-speech");
        }
        onEnd?.();
      };
      recognitionRef.current = recognition;
      recognition.start();

      // Defensive timeout in case no browser event ever fires.
      timeoutRef.current = setTimeout(() => {
        if (settledRef.current) return;
        settledRef.current = true;
        recognition.abort();
        onError?.("timeout");
      }, RECOGNITION_TIMEOUT_MS);
    },
    [supported]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
      recognitionRef.current?.abort();
    },
    []
  );

  return { supported, listening, start, stop };
}
