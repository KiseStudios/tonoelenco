import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/galeria", "/sobre", "/contato"]) {
  test(`axe WCAG A/AA em ${route}`, async ({ page }, info) => {
    await page.goto(route);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    await info.attach("axe.json", { body: JSON.stringify(scan, null, 2), contentType: "application/json" });
    expect(scan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
  });
}

test("o primeiro Tab revela o atalho e transfere foco para o conteúdo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("#conteudo")).toBeFocused();
});

test("texto ampliado a 200% mantém as rotas dentro de 390 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/galeria", "/sobre", "/contato"]) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, route).toBe(390);
  }
});
