import { expect, test } from "@playwright/test";

function scene(page) {
  return page.locator(".lens-transition").evaluate((lens) => {
    const stage = lens.querySelector(".lens-transition__stage");
    return {
      top: Math.round(lens.getBoundingClientRect().top + scrollY),
      range: lens.offsetHeight - stage.offsetHeight,
      pinnedTop: Math.round(stage.getBoundingClientRect().top),
      gallery: Math.round(document.querySelector(".coverage-section").getBoundingClientRect().top + scrollY),
      progress: Number(lens.dataset.progress ?? 0),
      scroll: Math.round(scrollY),
    };
  });
}

function scrollTo(page, top) {
  return page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
}

test("Hero → assinatura → galeria mantém posição e scrub reversível", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "scrub");
  const initial = await scene(page);
  const amount = Math.round(initial.top - page.viewportSize().height * 0.45);
  await page.mouse.move(90, 180);
  await page.mouse.wheel(0, amount);
  await expect.poll(async () => (await scene(page)).scroll).toBeCloseTo(amount, -1);
  expect((await scene(page)).gallery).toBe(initial.gallery);

  const middle = initial.top + Math.round(initial.range * 0.62);
  await page.mouse.wheel(0, middle - (await scene(page)).scroll);
  await expect.poll(async () => (await scene(page)).scroll).toBeCloseTo(middle, -1);
  await expect.poll(async () => (await scene(page)).progress).toBeGreaterThan(.58);
  expect((await scene(page)).pinnedTop).toBe(0);
  // WebKit commits the restored scroll position to the history entry after scrolling settles.
  await page.waitForTimeout(600);
  await page.reload();
  await expect.poll(async () => (await scene(page)).scroll).toBeCloseTo(middle, -1);
  await expect.poll(async () => (await scene(page)).progress).toBeGreaterThan(.58);

  await scrollTo(page, initial.gallery);
  await expect(page.locator(".coverage-section")).toBeInViewport();
  await scrollTo(page, initial.top + 10);
  await expect.poll(async () => (await scene(page)).progress).toBeLessThan(.03);
  expect((await scene(page)).gallery).toBe(initial.gallery);
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "scrub");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("movimento reduzido retira a distância de scroll e conserva a assinatura estática", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const initial = await scene(page);
  expect(initial.range).toBe(0);
  await expect(page.locator(".lens-transition__stage")).toHaveCSS("position", "relative");
  await scrollTo(page, initial.top);
  expect((await scene(page)).progress).toBeLessThan(.03);
  await expect(page.locator(".lens-transition canvas")).toHaveCount(0);
  await scrollTo(page, initial.gallery);
  await expect(page.locator(".coverage-section")).toBeInViewport();
});

test("Fotografia indisponível conserva a assinatura e libera a galeria", async ({ page }) => {
  await page.addInitScript(() => { const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      return this.src.includes("corrida-atleta-azul") ? Promise.reject(new Error("decode")) : decode.call(this);
    }; });
  await page.goto("/");
  await expect(page.locator(".lens-transition img")).toBeVisible();
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "static");
  await page.locator(".coverage-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".coverage-section")).toBeInViewport();
});

test("gestos de toque movem e revertem a sequência editorial", async ({ page, context }, info) => {
  test.skip(info.project.name !== "android-emulado", "Entrada de toque nativa do Chromium via CDP.");
  await page.goto("/");
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "scrub");
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
    await expect.poll(async () => (await scene(page)).progress).toBeGreaterThan(.10);
    expect((await scene(page)).gallery).toBe(initial.gallery);
    await swipe(240, 570);
    await expect.poll(async () => (await scene(page)).progress).toBeLessThan(.03);
  } finally {
    await cdp.detach();
  }
});

for (const [width, height] of [[390, 844], [820, 1024], [1440, 900]]) {
  test("registra fases e retorno em " + width, async ({ browser }, info) => {
    test.skip(info.project.name !== "chromium", "Uma gravação por largura.");
    test.setTimeout(90000);
    const viewport = { width, height };
    const context = await browser.newContext({
      baseURL: info.project.use.baseURL, viewport, reducedMotion: "no-preference",
      recordVideo: { dir: info.outputPath("video"), size: viewport },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const video = page.video();
    try {
      await page.goto("/");
      const root = page.locator(".lens-transition");
      const stage = root.locator(".lens-transition__stage");
      await expect(root).toHaveAttribute("data-mode", "scrub");
      const { top, range } = await scene(page);
      await scrollTo(page, top);
      let previous = 0;
      let first;
      for (const [phase, progress] of [["folha", .12], ["convergencia", .44], ["mascara", .77], ["marca", .97], ["retorno", .12]]) {
        for (let step = 1; step <= 20; step++) {
          await scrollTo(page, top + range * (previous + (progress - previous) * step / 20));
          await page.waitForTimeout(40); // Real scroll samples for the recording.
        }
        previous = progress;
        await expect.poll(async () => (await scene(page)).progress).toBeCloseTo(progress, 2);
        const sheet = stage.locator(".contact-sheet");
        await expect(sheet.locator("img")).toHaveCount(6);
        const pixels = await stage.screenshot();
        if (phase === "folha") first = pixels;
        if (phase === "convergencia") expect(pixels.equals(first)).toBe(false);
        if (phase === "mascara") {
          expect(Number(await stage.locator(".contact-matte").evaluate(el => getComputedStyle(el).opacity))).toBeGreaterThan(.95);
          await expect(stage.locator(".contact-brand")).toHaveCSS("opacity", "0");
        }
        if (phase === "retorno") expect(pixels.equals(first)).toBe(true);
        if (phase === "marca") await expect(stage.locator(".contact-brand")).toHaveCSS("opacity", "1");
        const name = phase + "-" + width + ".png";
        const file = info.outputPath("editorial", name);
        await stage.screenshot({ path: file });
        await info.attach(name, { path: file, contentType: "image/png" });
      }
      expect(errors).toEqual([]);
    } finally { await context.close(); }
    const name = "scrub-" + width + ".webm";
    const file = info.outputPath("editorial", name);
    await video.saveAs(file);
    await info.attach(name, { path: file, contentType: "video/webm" });
  });
}

test("a assinatura reserva a posição da galeria enquanto o logo decodifica", async ({ page }) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      if (!this.closest(".lens-transition")) return decode.call(this);
      return new Promise((resolve, reject) => {
        window.releaseEditorialLogo = () => decode.call(this).then(resolve, reject);
      });
    };
  });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => typeof window.releaseEditorialLogo)).toBe("function");
  const before = await scene(page);
  await page.evaluate(() => window.releaseEditorialLogo());
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "scrub");
  const after = await scene(page);
  expect(after.range).toBeGreaterThan(0);
  expect(after.gallery).toBe(before.gallery);
});

test("folha aguarda a entrada da seção antes de compor", async ({ page }) => {
  await page.setViewportSize({ ...page.viewportSize(), height: 400 });
  await page.goto("/");
  const initial = await scene(page);
  await expect(page.locator(".lens-transition")).toHaveAttribute("data-mode", "scrub");
  await expect(page.locator(".lens-transition__stage")).not.toBeInViewport();
  const frames = () => page.locator(".lens-transition").getAttribute("data-progress");
  // Allow the initial ResizeObserver and animation-frame callbacks to run.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await frames()).toBeNull();
  await scrollTo(page, initial.top + 120);
  await expect.poll(async () => Number(await frames())).toBeGreaterThan(0);
  await scrollTo(page, 0);
  await expect(page.locator(".lens-transition__stage")).not.toBeInViewport();
});

test("exportação sem JavaScript mantém a assinatura estática", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/");
    expect((await scene(page)).range).toBe(0);
    await expect(page.locator(".lens-transition__stage")).toHaveCSS("position", "relative");
    await expect(page.locator(".lens-transition img")).toBeVisible();
    await expect(page.locator(".lens-transition canvas")).toHaveCount(0);
  } finally {
    await context.close();
  }
});
