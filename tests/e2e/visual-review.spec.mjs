import { expect, test } from "@playwright/test";
import { stat } from "node:fs/promises";

const sections = [
  ["hero", ".home-hero"],
  ["transicao", ".lens-transition__stage"],
  ["galeria-home", ".coverage-section"],
  ["sobre-home", ".home-about"],
  ["footer", "footer"],
];

async function prepare(section) {
  await section.scrollIntoViewIfNeeded({ timeout: 5000 });
  await expect(section).toBeVisible();
  await section.evaluate(async element => {
    const images = [...element.querySelectorAll("img")].filter(img => img.getClientRects().length);
    const pending = new Set();
    async function track(label, promise) {
      pending.add(label);
      try { await promise; }
      catch (error) { throw new Error(label + ": " + error.message); }
      finally { pending.delete(label); }
    }
    const fonts = document.fonts.ready.then(set => {
      for (const face of set) {
        if (face.status === "error") throw new Error(face.family);
      }
    });
    let timer;
    try {
      await Promise.race([
        Promise.all([track("fontes", fonts), ...images.map(img => {
          img.loading = "eager";
          return track(img.currentSrc || img.src, img.decode());
        })]),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("Recursos pendentes em " + location.pathname + ": " + [...pending].join(", "))), 10000);
        }),
      ]);
    } finally { clearTimeout(timer); }
  });
}

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "chromium", "Um conjunto de evidências no Chromium.");
});

for (const [width, height] of [[390, 844], [820, 1024], [1440, 900]]) {
  test("capturas em " + width + " px", async ({ page }, info) => {
    test.setTimeout(150000);
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const [name, selector] of [...sections, ["sobre-pagina", ".about-page"]]) {
      if (name === "sobre-pagina") await page.goto("/sobre", { waitUntil: "domcontentloaded" });
      await test.step(name, async () => {
        const section = page.locator(selector);
        await prepare(section);
        const filename = name + "-" + width + ".png";
        const file = info.outputPath(filename);
        await section.screenshot({ path: file, animations: "disabled", caret: "hide", timeout: 10000 });
        await info.attach(filename, { path: file, contentType: "image/png" });
      });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

test("grava a rolagem integral da Home", async ({ browser }, info) => {
  test.setTimeout(120000);
  const viewport = { width: 1440, height: 900 };
  const context = await browser.newContext({
    baseURL: info.project.use.baseURL, viewport, deviceScaleFactor: 1,
    recordVideo: { dir: info.outputPath("video"), size: viewport }, reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const [, selector] of sections) {
      await prepare(page.locator(selector));
      await page.waitForTimeout(450); // Tempo de exposição de cada seção no vídeo.
    }
  } finally { await context.close(); }
  const file = info.outputPath("rolagem-integral-desktop.webm");
  await video.saveAs(file);
  expect((await stat(file)).size).toBeGreaterThan(0);
  await info.attach("rolagem-integral-desktop.webm", { path: file, contentType: "video/webm" });
});
