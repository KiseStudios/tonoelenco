import { expect, test } from "@playwright/test";

test("a Home preserva o cabeçalho branco e a composição integral da Hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const hero = page.getByRole("region", { name: /aqui todo/i });
  const image = hero.getByRole("img");
  const photo = await image.evaluate(async (element) => {
    await element.decode();
    const { width, height } = element.getBoundingClientRect();
    return {
      fit: getComputedStyle(element).objectFit,
      src: new URL(element.currentSrc).pathname,
      width, height,
      naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight,
    };
  });
  const wide = await page.evaluate(() => matchMedia("(min-width: 48rem)").matches);
  expect(photo.src).toBe(wide ? "/images/motocross-hero-horizontal.webp" : "/images/motocross-hero-original.jpg");
  expect(photo.fit).toBe("contain");
  expect(photo.width).toBeCloseTo(await hero.evaluate(el => el.clientWidth), 0);
  expect(photo.width / photo.height).toBeCloseTo(photo.naturalWidth / photo.naturalHeight, 2);
  await expect(hero.getByRole("link", { name: "Encontre suas fotos" })).toHaveAttribute("href", "/galeria");
  await expect(hero.getByRole("link")).toHaveCount(1);
});

test("navegação, acervo e lightbox funcionam do início ao fim", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto("/");
  const hero = page.getByRole("region", { name: /aqui todo/i });
  await hero.getByRole("link", { name: "Encontre suas fotos" }).click();
  await expect(page).toHaveURL(/\/galeria$/);
  const photo = page.getByRole("button", { name: /Ampliar fotografia/ }).first();
  await photo.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Fechar" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Próxima" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  const initial = await dialog.getByRole("heading").textContent();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).not.toHaveText(initial);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(photo).toBeFocused();

  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Abrir menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(header.getByRole("button", { name: "Fechar menu" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await menu.click();
  }
  await header.getByRole("link", { name: "Sobre", exact: true }).click();
  await expect(page).toHaveURL(/\/sobre$/);
  if (await menu.isVisible()) await menu.click();
  await header.getByRole("link", { name: "Contato", exact: true }).click();
  await expect(page).toHaveURL(/\/contato$/);

  for (const url of ["https://banlek.com/tonoelenco", "https://www.instagram.com/tonoelenco/"]) {
    const link = page.locator(`a[href="${url}"]`).filter({ visible: true }).first();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/sobre$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/contato$/);
  await header.getByRole("link", { name: /página inicial/ }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
});

test("as rotas diretas não excedem a largura útil", async ({ page }) => {
  for (const url of ["/", "/galeria", "/sobre", "/contato"]) {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
  }
  expect((await page.goto("/pagina-inexistente") )?.status()).toBe(404);
});

test("a fotografia da galeria continua identificável quando seu arquivo falha", async ({ page }) => {
  await page.route("**/images/*.webp", (route) => route.abort("failed"));
  await page.goto("/galeria");
  const photo = page.getByRole("button", { name: /Ampliar fotografia/ }).first();
  await expect(photo.getByRole("img")).toHaveAttribute("alt", /\S/);
  await photo.click();
  await expect(page.getByRole("dialog").getByRole("heading")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(photo).toBeFocused();
});

test("a navegação principal funciona sem JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("region", { name: /aqui todo/i }).getByRole("link", { name: "Encontre suas fotos" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/\/galeria$/);
  } finally {
    await context.close();
  }
});
