import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const BASE = "http://localhost:5173/English-for-beginners/";
const WIDTHS = [375, 390, 428, 480];
const HEIGHT = 800;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const results = [];

function log(msg) {
  results.push(msg);
  console.log(msg);
}

async function checkOverflow(page, label) {
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const overflowing = await page.evaluate(() => {
    const vw = window.innerWidth;
    const els = Array.from(document.querySelectorAll("*"));
    const bad = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 && r.width > 0) {
        bad.push(`${el.tagName}.${(el.className || "").toString().slice(0, 40)} right=${Math.round(r.right)} vw=${vw}`);
      }
    }
    return bad.slice(0, 5);
  });
  if (bodyWidth > viewportWidth + 2) {
    log(`  [OVERFLOW] ${label}: bodyScrollWidth=${bodyWidth} > viewport=${viewportWidth}`);
    for (const b of overflowing) log(`    -> ${b}`);
  }
}

async function checkTapTargets(page, label, selector) {
  const small = await page.evaluate((sel) => {
    const els = Array.from(document.querySelectorAll(sel));
    const bad = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && (r.width < 36 || r.height < 36)) {
        bad.push(`${el.className || el.tagName} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return bad.slice(0, 8);
  }, selector);
  if (small.length) {
    log(`  [SMALL TAP TARGET] ${label}: ${small.join(" | ")}`);
  }
}

async function checkToggleWrap(page, label) {
  const info = await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll(".toggle-group"));
    return groups.map((g) => {
      const rows = Array.from(g.querySelectorAll(".toggle-row"));
      const tops = new Set(rows.map((r) => Math.round(r.getBoundingClientRect().top)));
      return { count: rows.length, lines: tops.size, groupWidth: Math.round(g.getBoundingClientRect().width) };
    });
  });
  for (const g of info) {
    log(`  [TOGGLES] ${label}: ${g.count} toggles across ${g.lines} line(s), group width=${g.groupWidth}`);
  }
}

const page = await browser.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(20000);

async function visit(path_fn, label) {
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: HEIGHT });
    await page.goto(BASE, { waitUntil: "load" });
    await path_fn(page);
    await page.waitForTimeout(200);
    const tag = `${label} @ ${w}px`;
    await checkOverflow(page, tag);
    await checkTapTargets(page, tag, "button, a, .reply-option, .chunk-pill, .quiz-option");
    await checkToggleWrap(page, tag);
  }
}

// Home
await visit(async () => {}, "HOME");

// Flashcards -> pick a category
await visit(async (page) => {
  await page.getByText("แฟลชการ์ด").first().click();
  await page.waitForTimeout(200);
  await page.locator("button").first().click().catch(() => {});
}, "FLASHCARDS");

// Listening quiz
await visit(async (page) => {
  await page.getByText("แบบทดสอบฟัง").first().click();
  await page.waitForTimeout(200);
  await page.locator("button").first().click().catch(() => {});
}, "QUIZ");

// Speaking practice
await visit(async (page) => {
  await page.getByText("ฝึกพูด").first().click();
  await page.waitForTimeout(200);
  await page.locator("button").first().click().catch(() => {});
}, "SPEAKING");

// Conversation - topic grid + inside a topic
await visit(async (page) => {
  await page.getByText("ฝึกสนทนา").first().click();
}, "CONVERSATION-TOPICGRID");

await visit(async (page) => {
  await page.getByText("ฝึกสนทนา").first().click();
  await page.waitForTimeout(200);
  await page.locator(".topic-card").first().click().catch(() => {});
}, "CONVERSATION-INSIDE");

// Sentence Patterns sub-sections
async function openSPSection(page, sectionLabel) {
  await page.getByText("แพทเทิร์นประโยค").first().click();
  await page.waitForTimeout(200);
  await page.locator("button", { hasText: sectionLabel }).first().click().catch(() => {});
  await page.waitForTimeout(200);
}

await visit(async (page) => {
  await openSPSection(page, "แพทเทิร์นประโยค");
  await page.locator(".pattern-list-btn").first().click().catch(() => {});
}, "SP-LESSON");

await visit(async (page) => {
  await openSPSection(page, "ฝึกเรียงประโยค");
  await page.locator(".pattern-list-btn").first().click().catch(() => {});
}, "SP-WORDORDER");

await visit(async (page) => {
  await openSPSection(page, "ฝึกผันกริยา");
}, "SP-CONJUGATION-PRACTICE");

await visit(async (page) => {
  await openSPSection(page, "ฝึกผันคำคุณศัพท์");
}, "SP-ADJECTIVE-PRACTICE");

await browser.close();
console.log("=== DONE ===");
