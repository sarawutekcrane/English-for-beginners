import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const BASE = "http://localhost:5173/English-for-beginners/";
const errors = [];
const findings = [];
function log(msg) {
  findings.push(msg);
  console.log(msg);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(20000);

async function goHome() {
  await page.goto(BASE, { waitUntil: "load" });
}

// 1. Home page
await goHome();
log(`home tiles found: ${await page.locator(".module-tile, button", { hasText: /./ }).count()}`);

// 2. Flashcards
async function testFlashcards(categoryLabel) {
  await goHome();
  await page.getByText("แฟลชการ์ด").first().click();
  await page.waitForTimeout(200);
  const catBtn = page.locator("button", { hasText: categoryLabel }).first();
  if ((await catBtn.count()) === 0) {
    log(`FLASHCARDS: category "${categoryLabel}" not found`);
    return;
  }
  await catBtn.click();
  await page.waitForTimeout(300);
  const svgCount = await page.locator("svg").count();
  const bodyText = await page.locator("body").innerText();
  log(`FLASHCARDS[${categoryLabel}]: svgs=${svgCount}, hasThai=${/[฀-๿]/.test(bodyText)}`);
}
for (const cat of ["ตัวเลข", "สีสัน", "สภาพอากาศ", "อาชีพ"]) {
  await testFlashcards(cat);
}

// 3. Listening Quiz
async function testQuiz() {
  await goHome();
  await page.getByText("แบบทดสอบฟัง").first().click();
  await page.waitForTimeout(200);
  const catBtn = page.locator("button").first();
  await catBtn.click().catch(() => {});
  await page.waitForTimeout(400);
  const bodyText = await page.locator("body").innerText();
  log(`QUIZ: buttons=${await page.locator("button").count()}, hasThai=${/[฀-๿]/.test(bodyText)}`);
}
await testQuiz();

// 4. Conversation Practice
async function testConversation(topicSubstr) {
  await goHome();
  await page.getByText("ฝึกสนทนา").first().click();
  await page.waitForTimeout(200);
  const topicBtn = page.locator(".topic-card", { hasText: topicSubstr }).first();
  if ((await topicBtn.count()) === 0) {
    log(`CONVO: topic "${topicSubstr}" not found`);
    return;
  }
  await topicBtn.click();
  await page.waitForTimeout(300);
  let steps = 0;
  while (steps < 8) {
    if ((await page.locator(".session-complete-text").count()) > 0) {
      log(`CONVO[${topicSubstr}]: reached completion after ${steps} steps`);
      return;
    }
    const replyOpts = page.locator(".reply-option");
    if ((await replyOpts.count()) > 0) {
      await replyOpts.first().click();
      await page.waitForTimeout(400);
      steps++;
      continue;
    }
    const confirmBtn = page.locator("button", { hasText: "ดำเนินการต่อ" });
    if ((await confirmBtn.count()) > 0) {
      await confirmBtn.first().click();
      await page.waitForTimeout(400);
      continue;
    }
    const retryBtn = page.locator("button", { hasText: "ลองตอบอีกครั้ง" });
    if ((await retryBtn.count()) > 0) {
      await retryBtn.first().click();
      await page.waitForTimeout(400);
      continue;
    }
    break;
  }
  log(`CONVO[${topicSubstr}]: stopped after ${steps} steps (no completion/reply-option/confirm found)`);
}
await testConversation("hotel");
await testConversation("doctor");
await testConversation("Ordering food");

// 5. Sentence Patterns - word order (uses correctOrder from the page's own data via clicking pool items in order)
async function testWordOrder(patternTitleSubstr) {
  await goHome();
  await page.getByText("แพทเทิร์นประโยค").first().click();
  await page.waitForTimeout(200);
  const wordOrderCard = page.locator("button", { hasText: "ฝึกเรียงประโยค" }).first();
  if ((await wordOrderCard.count()) === 0) {
    log("WORDORDER: section entry not found");
    return;
  }
  await wordOrderCard.click();
  await page.waitForTimeout(200);
  const patBtn = page.locator(".pattern-list-btn", { hasText: patternTitleSubstr }).first();
  if ((await patBtn.count()) === 0) {
    log(`WORDORDER: pattern "${patternTitleSubstr}" not found`);
    return;
  }
  await patBtn.click();
  await page.waitForTimeout(300);
  // Read the Thai prompt then just tap pool chunks in DOM order (not guaranteed correct,
  // but exercises the tap-to-place mechanic and submit path without needing to know
  // the correct order ahead of time).
  const poolBtns = page.locator(".chunk-pool .chunk-pill");
  const poolCount = await poolBtns.count();
  for (let i = 0; i < poolCount; i++) {
    await page.locator(".chunk-pool .chunk-pill").first().click().catch(() => {});
    await page.waitForTimeout(80);
  }
  const submitBtn = page.locator("button", { hasText: "ตรวจคำตอบ" });
  if ((await submitBtn.count()) > 0) {
    await submitBtn.first().click();
    await page.waitForTimeout(200);
  }
  const bodyText = await page.locator("body").innerText();
  log(
    `WORDORDER[${patternTitleSubstr}]: poolChunks=${poolCount}, submitted=${(await submitBtn.count()) === 0}, hasThai=${/[฀-๿]/.test(bodyText)}`
  );
}
await testWordOrder("Present Continuous");
await testWordOrder("Will");
await testWordOrder("Zero Conditional");

// 6. Verb conjugation + adjective practice sanity
async function testSection(sectionLabel) {
  await goHome();
  await page.getByText("แพทเทิร์นประโยค").first().click();
  await page.waitForTimeout(200);
  const sectionBtn = page.locator("button", { hasText: sectionLabel }).first();
  if ((await sectionBtn.count()) === 0) {
    log(`SECTION[${sectionLabel}]: not found`);
    return;
  }
  await sectionBtn.click();
  await page.waitForTimeout(300);
  const bodyText = await page.locator("body").innerText();
  const hasNaN = /NaN|undefined/.test(bodyText);
  log(`SECTION[${sectionLabel}]: loaded, hasNaN/undefined=${hasNaN}`);
}
await testSection("ฝึกผันกริยา");
await testSection("ฝึกผันคำคุณศัพท์");

// 7. Speaking Practice loads
await goHome();
const speakEntry = page.getByText("ฝึกพูด").first();
if ((await speakEntry.count()) > 0) {
  await speakEntry.click();
  await page.waitForTimeout(400);
  log("SPEAKING: entry loaded without crash");
} else {
  log("SPEAKING: entry point not found");
}

console.log("=== ERRORS ===");
for (const e of errors.slice(0, 40)) console.log(e);
console.log(`TOTAL ERRORS: ${errors.length}`);

await browser.close();
