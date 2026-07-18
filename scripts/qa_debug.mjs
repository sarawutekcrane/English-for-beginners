import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const BASE = "http://localhost:5173/English-for-beginners/";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
page.setDefaultTimeout(15000);
await page.goto(BASE, { waitUntil: "load" });
await page.getByText("ฝึกสนทนา").first().click();
await page.waitForTimeout(300);
const topicBtn = page.locator(".topic-card", { hasText: "hotel" }).first();
await topicBtn.click();
await page.waitForTimeout(300);
console.log("before click, reply-options:", await page.locator(".reply-option").count());
await page.locator(".reply-option").first().click();
await page.waitForTimeout(400);
console.log("after click, reply-options:", await page.locator(".reply-option").count());
console.log("body text snippet:", (await page.locator(".conversation-card").innerText()).slice(0, 500));
await browser.close();
