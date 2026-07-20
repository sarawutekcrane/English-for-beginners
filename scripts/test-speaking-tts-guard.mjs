#!/usr/bin/env node
/**
 * Regression test for the confirmed TTS/mic feedback-loop bug in Speaking
 * Practice: recognition.start() was never gated against speechSynthesis
 * still being audible, so a fast tap on the mic while "hear example" or the
 * post-answer reveal audio was playing let the mic pick up the device's own
 * TTS output (root cause of the "we heard: Play" / "red" -> "black"
 * misrecognition and the "mic flickers as if tapped" reports).
 *
 * Mocks both `speechSynthesis` and `SpeechRecognition`, drives a real
 * Chromium instance against the built app, and asserts the mocked
 * recognition's `start()` is NEVER invoked while the mocked
 * `speechSynthesis.speaking` is true -- for both trigger points ("hear
 * example" and the post-answer reveal). Clicks are dispatched as raw DOM
 * `.click()` calls (bypassing Playwright's actionability wait, which would
 * itself refuse to click a `disabled` button) specifically to exercise the
 * "queued click / programmatic bypass" race the fix's synchronous guard
 * (not just the `disabled` attribute) is meant to close.
 *
 * Run with: npm run test:speaking-tts-guard
 * (starts its own preview server on a fixed port and tears it down after).
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 5183;
const BASE = `http://localhost:${PORT}/English-for-beginners/`;

function startServer() {
  // Spawn vite's own bin directly (not via `npx vite`) so `proc` IS the
  // server process -- killing it in the `finally` block below actually
  // terminates it. Going through npx leaves an orphaned grandchild vite
  // process behind, since killing the npx wrapper doesn't kill its child.
  const proc = spawn(new URL("../node_modules/.bin/vite", import.meta.url).pathname, [
    "preview",
    "--port",
    String(PORT),
    "--strictPort",
  ], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  return new Promise((resolve, reject) => {
    let out = "";
    const onData = (d) => {
      out += d.toString();
      if (/Local:/.test(out)) {
        proc.stdout.off("data", onData);
        resolve(proc);
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", (d) => (out += d.toString()));
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code !== 0 && code !== null) reject(new Error(`vite preview exited ${code}\n${out}`));
    });
    setTimeout(() => reject(new Error(`vite preview did not start in time\n${out}`)), 20000);
  });
}

const MOCK_SPEECH_INIT_SCRIPT = `
(() => {
  window.__recognitionStartCalls = [];

  class MockUtterance {
    constructor(text) { this.text = text; }
  }
  window.SpeechSynthesisUtterance = MockUtterance;

  let speaking = false;
  const mockSynth = {
    get speaking() { return speaking; },
    getVoices: () => [{ name: "Mock Voice", lang: "en-US", localService: true }],
    onvoiceschanged: null,
    cancel: () => { speaking = false; },
    speak: (utter) => {
      speaking = true;
      // Simulated TTS duration long enough for a same-tick/near-tick raw
      // click to land while still "speaking", the exact window the fix
      // must close.
      setTimeout(() => { utter.onstart && utter.onstart(); }, 15);
      setTimeout(() => {
        speaking = false;
        utter.onend && utter.onend();
      }, 250);
    },
  };
  Object.defineProperty(window, "speechSynthesis", { value: mockSynth, writable: true, configurable: true });

  class MockSpeechRecognition {
    start() {
      window.__recognitionStartCalls.push({
        time: Date.now(),
        speakingAtCallTime: window.speechSynthesis.speaking,
      });
      setTimeout(() => this.onstart && this.onstart(), 10);
      setTimeout(() => {
        const alt = { transcript: "red", confidence: 0.9 };
        const results = [[alt]];
        results[0].item = (i) => results[0][i];
        this.onresult && this.onresult({ results });
      }, 40);
    }
    abort() {}
    stop() {}
  }
  window.SpeechRecognition = MockSpeechRecognition;
  window.webkitSpeechRecognition = MockSpeechRecognition;
})();
`;

async function main() {
  console.log("Starting vite preview server...");
  const server = await startServer();
  let browser;
  let failures = [];
  try {
    browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
    const page = await browser.newPage();
    await page.addInitScript(MOCK_SPEECH_INIT_SCRIPT);
    await page.goto(BASE, { waitUntil: "networkidle" });

    await page.getByText("ฝึกพูด", { exact: true }).click();
    await page.locator(".category-chip").first().click();

    const hearBtn = page.getByRole("button", { name: "ฟังตัวอย่างเสียง" });
    const micBtn = page.getByRole("button", { name: "พูดออกเสียง" });
    await hearBtn.waitFor({ state: "visible" });
    await micBtn.waitFor({ state: "visible" });

    // --- Test A: "hear example" TTS in progress, race a raw click on the mic ---
    await hearBtn.click();
    await micBtn.evaluate((el) => el.click()); // raw DOM click, bypasses disabled-aware actionability wait
    await sleep(350); // past the mock TTS's 250ms duration

    // --- Test B: drive a full attempt to reach the post-answer reveal TTS, then race it too ---
    await micBtn.evaluate((el) => el.click());
    await sleep(80); // let the mocked recognition's onresult fire (status -> match/nomatch)
    // The reveal audio is scheduled 500ms after the result; race a raw click
    // on the mic right as it should be starting.
    await sleep(450);
    await micBtn.evaluate((el) => el.click());
    await sleep(350);

    const calls = await page.evaluate(() => window.__recognitionStartCalls);
    console.log(`recognition.start() was called ${calls.length} time(s):`, calls);

    const violations = calls.filter((c) => c.speakingAtCallTime);
    if (violations.length > 0) {
      failures.push(
        `FAIL: recognition.start() was called ${violations.length} time(s) while speechSynthesis.speaking was true -- the TTS/mic feedback-loop guard did not hold.`
      );
    } else if (calls.length === 0) {
      failures.push("FAIL: recognition.start() was never called at all -- test setup is broken, not validating anything.");
    } else {
      console.log("PASS: every recognition.start() call happened with speechSynthesis.speaking === false.");
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }

  if (failures.length > 0) {
    for (const f of failures) console.error(f);
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
