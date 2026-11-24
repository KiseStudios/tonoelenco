import { expect, test } from "@playwright/test";

function scene(page) {
  return page.locator(".lens-transition").evaluate((lens) => {
    const stage = lens.querySelector(".lens-transition__stage");
    return {
      top: Math.round(lens.getBoundingClientRect().top + scrollY),
      range: lens.offsetHeight - stage.offsetHeight,
      pinnedTop: Math.round(stage.getBoundingClientRect().top),
      gallery: Math.round(document.querySelector(".coverage-section").getBoundingClientRect().top + scrollY),
      zoom: new DOMMatrix(getComputedStyle(lens.querySelector(".lens-transition__fallback")).transform).a,
      scroll: Math.round(scrollY),
    };
  });
}

function scrollTo(page, top) {
  return page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
}

test("Hero → lente → galeria é estável e reversível em fallback 2D", async ({ page }) => {
  await page.addInitScript(() => { delete HTMLCanvasElement.prototype.transferControlToOffscreen; });
  await page.goto("/");
  const initial = await scene(page);
  const amount = Math.round(initial.top - page.viewportSize().height * 0.45);
  await page.mouse.move(90, 180);
  await page.mouse.wheel(0, amount);
  await expect.poll(async () => (await scene(page)).scroll).toBeCloseTo(amount, -1);
  expect((await scene(page)).gallery).toBe(initial.gallery);

  const middle = initial.top + Math.round(initial.range * 0.62);
  await page.mouse.wheel(0, middle - (await scene(page)).scroll);
  await expect.poll(async () => (await scene(page)).scroll).toBeCloseTo(middle, -1);
  await expect.poll(async () => (await scene(page)).zoom).toBeGreaterThan(1.4);
  expect((await scene(page)).pinnedTop).toBe(0);
  // WebKit commits the restored scroll position to the history entry after scrolling settles.
  await page.waitForTimeout(600);
  await page.reload();
  await expect.poll(async () => (await scene(page)).scroll).toBeCloseTo(middle, -1);
  await expect.poll(async () => (await scene(page)).zoom).toBeGreaterThan(1.4);

  await scrollTo(page, initial.gallery);
  await expect(page.locator(".coverage-section")).toBeInViewport();
  await scrollTo(page, initial.top + 10);
  await expect.poll(async () => (await scene(page)).zoom).toBe(1);
  expect((await scene(page)).gallery).toBe(initial.gallery);
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "fallback");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("movimento reduzido retira a distância de scroll e conserva a câmera estática", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const initial = await scene(page);
  expect(initial.range).toBe(0);
  await expect(page.locator(".lens-transition__stage")).toHaveCSS("position", "relative");
  await scrollTo(page, initial.top);
  expect((await scene(page)).zoom).toBe(1);
  await expect(page.locator(".lens-transition canvas")).toHaveCount(0);
  await scrollTo(page, initial.gallery);
  await expect(page.locator(".coverage-section")).toBeInViewport();
});

test("worker sem resposta é liberado e a animação 2D continua", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "Exercita o caminho desktop com OffscreenCanvas.");
  await page.addInitScript(() => {
    window.qaWorkerTerminations = 0;
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      postMessage() {
        // Simulates a worker that loads but never acknowledges its first frame.
      }
      terminate() {
        window.qaWorkerTerminations++;
        super.terminate();
      }
    };
  });
  await page.goto("/");
  const initial = await scene(page);
  await scrollTo(page, initial.top);
  const canvas = page.locator(".lens-transition canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveCount(0, { timeout: 7_000 });
  expect(await page.evaluate(() => window.qaWorkerTerminations)).toBe(1);
  await scrollTo(page, initial.top + Math.round(initial.range * 0.63));
  await expect.poll(async () => (await scene(page)).zoom).toBeGreaterThan(1.4);
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "fallback");
});

test("gestos de toque movem e revertem a lente 2D", async ({ page, context }, info) => {
  test.skip(info.project.name !== "android-emulado", "Entrada de toque nativa do Chromium via CDP.");
  await page.goto("/");
  const initial = await scene(page);
  await scrollTo(page, initial.top - 30);
  const cdp = await context.newCDPSession(page);
  async function swipe(from, to) {
    const send = (type, y) => cdp.send("Input.dispatchTouchEvent", {
      type, touchPoints: y === undefined ? [] : [{ x: 270, y }],
    });
    await send("touchStart", from);
    for (let step = 1; step <= 12; step++) {
      await send("touchMove", Math.round(from + (to - from) * step / 12));
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
    await send("touchEnd");
  }

  try {
    await swipe(660, 380);
    await expect.poll(async () => (await scene(page)).zoom).toBeGreaterThan(1.15);
    expect((await scene(page)).gallery).toBe(initial.gallery);
    await swipe(240, 570);
    await expect.poll(async () => (await scene(page)).zoom).toBe(1);
  } finally {
    await cdp.detach();
  }
});
