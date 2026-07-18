import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const BASE = "http://localhost:5173/English-for-beginners/";
const errors = [];
const findings = [];
function log(msg) { findings.push(msg); console.log(msg); }

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

async function goHome() {
  await page.goto(BASE, { waitUntil: "load" });
}

// 1. Home page
await goHome();
const tiles = await page.locator("button, a").allTextContents();
log(`home tiles found: ${tiles.filter((t) => t.trim()).length}`);

// 2. Flashcards: numbers, colors, weather, jobs
async function testFlashcards(categoryLabelSubstr) {
  await goHome();
  await page.getByText("แฟลชการ์ด").first().click();
  await page.waitForTimeout(300);
  const catBtn = page.locator("button", { hasText: categoryLabelSubstr }).first();
  if ((await catBtn.count()) === 0) {
    log(`FLASHCARDS: category "${categoryLabelSubstr}" not found on picker`);
    return;
  }
  await catBtn.click();
  await page.waitForTimeout(400);
  const svgCount = await page.locator("svg").count();
  const bodyText = await page.locator("body").innerText();
  log(
    `FLASHCARDS[${categoryLabelSubstr}]: svgs=${svgCount}, hasThai=${/[฀-๿]/.test(bodyText)}`
  );
  // cycle a couple cards if a next/nav control exists
  const nextBtn = page.locator("button", { hasText: /Next|ถัดไป|>/i }).first();
  if ((await nextBtn.count()) > 0) {
    await nextBtn.click().catch(() => {});
    await page.waitForTimeout(200);
  }
}

for (const cat of ["ตัวเลข", "สีสัน", "สภาพอากาศ", "อาชีพ"]) {
  await testFlashcards(cat);
}

// 3. Listening Quiz
async function testQuiz() {
  await goHome();
  const quizEntry = page.getByText("แบบทดสอบฟัง").first();
  if ((await quizEntry.count()) === 0) {
    log("QUIZ: entry point not found");
    return;
  }
  await quizEntry.click();
  await page.waitForTimeout(300);
  const catBtn = page.locator("button").filter({ hasText: /./ }).first();
  await catBtn.click().catch(() => {});
  await page.waitForTimeout(500);
  const optionButtons = await page.locator("button").count();
  const bodyText = await page.locator("body").innerText();
  log(`QUIZ: buttons=${optionButtons}, hasThai=${/[฀-๿]/.test(bodyText)}`);
}
await testQuiz();

// 4. Conversation Practice - test branching
async function testConversation(topicLabelSubstr, followBranch) {
  await goHome();
  const entry = page.getByText("ฝึกสนทนา").first();
  await entry.click();
  await page.waitForTimeout(300);
  const topicBtn = page.locator("button", { hasText: topicLabelSubstr }).first();
  if ((await topicBtn.count()) === 0) {
    log(`CONVO: topic "${topicLabelSubstr}" not found`);
    return;
  }
  await topicBtn.click();
  await page.waitForTimeout(400);
  let steps = 0;
  while (steps < 6) {
    const optBtns = page.locator("button");
    const count = await optBtns.count();
    if (count === 0) break;
    // pick first clickable option (heuristic)
    const idx = followBranch && steps === 0 ? Math.min(1, count - 1) : 0;
    const target = optBtns.nth(idx);
    const txt = await target.innerText().catch(() => "");
    await target.click().catch(() => {});
    await page.waitForTimeout(300);
    // confirm step if there's a confirm button
    const confirmBtn = page.locator("button", { hasText: /Confirm|ยืนยัน|Say it|Next/i }).first();
    if ((await confirmBtn.count()) > 0) {
      await confirmBtn.click().catch(() => {});
      await page.waitForTimeout(300);
    }
    steps++;
  }
  const bodyText = await page.locator("body").innerText();
  log(
    `CONVO[${topicLabelSubstr}]: steps=${steps}, hasThai=${/[฀-๿]/.test(bodyText)}`
  );
}
await testConversation("hotel", false);
await testConversation("doctor", true);
await testConversation("food", false);

// 5. Sentence Patterns - word order
async function testWordOrder(patternLabelSubstr) {
  await goHome();
  const entry = page.getByText("แพทเทิร์นประโยค").first();
  await entry.click();
  await page.waitForTimeout(300);
  const wordOrderSection = page.locator("button", { hasText: /Word.?Order|เรียงคำ/i }).first();
  if ((await wordOrderSection.count()) > 0) {
    await wordOrderSection.click();
    await page.waitForTimeout(300);
  }
  const patBtn = page.locator("button", { hasText: patternLabelSubstr }).first();
  if ((await patBtn.count()) === 0) {
    log(`WORDORDER: pattern "${patternLabelSubstr}" not found`);
    return;
  }
  await patBtn.click();
  await page.waitForTimeout(400);
  const chunkBtns = page.locator("button");
  const count = await chunkBtns.count();
  log(`WORDORDER[${patternLabelSubstr}]: clickable elements=${count}`);
}
await testWordOrder("Present Continuous");
await testWordOrder("Will");

// 6. Speaking Practice loads
await goHome();
const speakEntry = page.getByText("ฝึกพูด").first();
if ((await speakEntry.count()) > 0) {
  await speakEntry.click();
  await page.waitForTimeout(500);
  log("SPEAKING: entry loaded without crash");
} else {
  log("SPEAKING: entry point not found");
}

console.log("=== FINDINGS ===");
for (const f of findings) console.log(f);
console.log("=== ERRORS ===");
for (const e of errors.slice(0, 40)) console.log(e);
console.log(`TOTAL ERRORS: ${errors.length}`);

await browser.close();
