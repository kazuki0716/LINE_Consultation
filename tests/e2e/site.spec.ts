import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("パスワード").fill("sampleueda");
  await Promise.all([
    page.waitForURL(url => !url.pathname.startsWith("/login")),
    page.getByRole("button", { name: /サイトを見る/ }).click(),
  ]);
});

test("top page presents the core journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /手術の前に/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /先に決めなくても/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /診察前によく/ })).toBeVisible();
  expect(await page.locator("body").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
});

test("comparison tabs update content", async ({ page }) => {
  await page.goto("/comparison");
  await page.getByRole("tab", { name: /入れ歯/ }).click();
  await expect(page.getByRole("tabpanel").getByRole("heading", { name: "入れ歯" })).toBeVisible();
  await expect(page.getByRole("tabpanel")).toContainText("日々の着脱・清掃が必要");
});

test("faq is keyboard accessible", async ({ page }) => {
  await page.goto("/faq");
  const question = page.getByRole("button", { name: /治療期間はどれくらいですか/ });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/顎の骨や歯ぐきの状態/)).toBeVisible();
});

test("mobile navigation opens and links work", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "メニューを開く" }).click();
  await expect(page.getByRole("navigation", { name: "モバイルナビゲーション" })).toBeVisible();
  await page.getByRole("navigation", { name: "モバイルナビゲーション" }).getByRole("link", { name: /費用とリスク/ }).click();
  await expect(page).toHaveURL(/\/cost$/);
});
