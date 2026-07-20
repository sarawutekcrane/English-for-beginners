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

function looselyEqual(a, b, allowContains = true) {
  if (a === b) return true;
  if (!allowContains) return false;
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
 *
 * Phase 10 fix: `allowContains` lets the caller disable the substring
 * fallback entirely. It defaults on, but SpeakingPractice passes it off for
 * numeric vocabulary -- "four" is a substring of "fourteen" (and six/eight/
 * nine/seven have the same relationship with their -teen forms), both of
 * which are real, separately graded entries in the numbers category, so
 * "close enough" substring matching is actively wrong for quantities.
 */
export function matchesEnglish(transcript, target, { allowContains = true } = {}) {
  const a = normalizeEn(transcript);
  const b = normalizeEn(target);
  if (!a || !b) return false;
  if (looselyEqual(a, b, allowContains)) return true;
  const alts = ALT_TRANSCRIPTIONS[target];
  if (alts) {
    return alts.some((alt) => looselyEqual(a, normalizeEn(alt), allowContains));
  }
  return false;
}

const SpeechRecognitionCtor =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

// Investigated a "we heard: Play" report that recurred across unrelated
// target words -- traced through every app-side step that touches a
// recognition result (this file's onresult handler, SpeakingPractice.jsx's
// onResult callback, and content.js's toCard()) and found no hardcoded
// fallback, no UI-label leak, and lang is set fresh on every start() call,
// so there's no app-side corruption to fix. That points to the raw
// SpeechRecognition result itself already being "play" -- a known
// characteristic of cloud speech recognizers defaulting to common,
// heavily-trained short command words ("play", "stop", "next", the
// media-control vocabulary voice assistants are full of) when given a
// short or acoustically ambiguous utterance under low confidence, not
// something this app's code produces or can fully correct for.
// Kept permanently (opt-in, not on by default) rather than stripped after
// investigation: this exact bug class -- a mysterious, consistent wrong
// transcript -- is hard to diagnose again without seeing the raw browser
// output, and future reports will want the same evidence. Enable via
// `?debugSpeech=1` in the URL or `localStorage.setItem("debugSpeech","1")`.
function debugSpeechEnabled() {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("debugSpeech") === "1") return true;
    return window.localStorage?.getItem("debugSpeech") === "1";
  } catch {
    return false;
  }
}

// Bug 4(b) fix: 8s was firing before recognition finished on slower
// devices/connections, producing a false "no speech detected" for an
// attempt that was actually still in progress. 12s gives cloud-backed
// recognizers (what most mobile browsers use) more room while still
// bounding the worst case so the UI can't hang indefinitely.
const RECOGNITION_TIMEOUT_MS = 12000;

/**
 * Wraps the Web Speech API's SpeechRecognition for English speaking practice.
 *
 * Root cause of the "immediate no-speech error" bug: the defensive timeout
 * used to start counting from the moment `recognition.start()` was CALLED,
 * not from the recognizer's genuine `onstart` signal -- so any setup
 * latency (the mic permission prompt, connecting to a cloud recognizer)
 * silently ate into the window before the user had a real chance to speak.
 * Worse, the "settled" flag and timeout handle were held in refs SHARED
 * across every start() call, not scoped to one recognition instance -- so
 * a stale instance being aborted (e.g. by a rapid re-tap re-entering
 * start()) fired its onend against the flag the NEW call had just reset to
 * false, misreporting the old instance's abort as "no speech" for an
 * attempt the user never actually got to make.
 */
export function useSpeechRecognition() {
  const supported = !!SpeechRecognitionCtor;
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const start = useCallback(
    ({ onResult, onError, onStart, onEnd } = {}) => {
      if (!supported) return;
      if (debugSpeechEnabled()) {
        // Confirms the mic is genuinely tap-initiated: this is the ONLY
        // call site of recognition.start() in the app (grep confirms it),
        // reachable only from SpeakingPractice.jsx's record() onClick
        // handler -- no effect or timer calls start(). Logged so a live
        // capture can prove that even if the source changes later.
        console.log("[SpeechRecognition] start() called", new Date().toISOString());
      }
      const previous = recognitionRef.current;
      clearTimeout(timeoutRef.current);

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

      // Own settled-flag per instance (a closure variable, not a shared
      // ref) -- fixes the cross-instance race described above. `isCurrent`
      // lets a stale instance's late-arriving events (fired after it was
      // aborted to make room for a newer start() call) no-op instead of
      // reporting a spurious error for an attempt the user never made.
      let settled = false;
      const isCurrent = () => recognitionRef.current === recognition;

      const finish = () => {
        clearTimeout(timeoutRef.current);
        settled = true;
      };

      recognition.onstart = () => {
        if (!isCurrent()) return;
        setListening(true);
        onStart?.();
        // The defensive timeout now starts counting from here -- the
        // recognizer's genuine "listening" signal -- instead of from the
        // moment start() was called, so mic-permission-prompt time or
        // cloud-recognizer connection time is never silently deducted from
        // the window the user actually gets to speak in.
        timeoutRef.current = setTimeout(() => {
          if (settled || !isCurrent()) return;
          settled = true;
          recognition.abort();
          onError?.("timeout");
        }, RECOGNITION_TIMEOUT_MS);
      };
      recognition.onresult = (event) => {
        if (!isCurrent()) return;
        finish();
        const results = event.results?.[0];
        const alternatives = results ? Array.from(results).map((alt) => alt.transcript) : [];
        if (debugSpeechEnabled()) {
          // Raw browser API output, logged before any app processing
          // touches it -- see the note above SpeechRecognitionCtor for why
          // this exists and stays gated rather than removed.
          console.log(
            "[SpeechRecognition raw]",
            Array.from(results || []).map((alt) => ({ transcript: alt.transcript, confidence: alt.confidence }))
          );
        }
        onResult?.(alternatives[0] || "", alternatives);
      };
      recognition.onerror = (event) => {
        if (!isCurrent()) return;
        finish();
        onError?.(event.error);
      };
      recognition.onend = () => {
        if (!isCurrent()) return;
        setListening(false);
        clearTimeout(timeoutRef.current);
        // Some browsers end the session without ever firing onresult/onerror
        // (e.g. permission hiccups). Without this, the UI looks "frozen".
        if (!settled) {
          settled = true;
          onError?.("no-speech");
        }
        onEnd?.();
      };
      // Point the ref at the new instance BEFORE aborting the old one --
      // some implementations fire `onend` synchronously from abort(), and
      // if that happened while the ref still pointed at the old instance,
      // its own `isCurrent()` check would (wrongly) still read true,
      // letting a stale instance report a spurious error for an attempt
      // the user never got to make. Reassigning first makes the old
      // instance's `isCurrent()` correctly read false no matter when its
      // onend actually fires.
      recognitionRef.current = recognition;
      previous?.abort();
      recognition.start();
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (debugSpeechEnabled()) {
      console.log("[SpeechRecognition] stop() called", new Date().toISOString());
    }
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
