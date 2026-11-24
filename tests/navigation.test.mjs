import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const output = path.resolve("out");
const routes = ["/", "/galeria", "/sobre", "/contato"];
const routeFiles = new Map([
  ["/", "index.html"],
  ["/galeria", "galeria.html"],
  ["/sobre", "sobre.html"],
  ["/contato", "contato.html"],
]);

async function page(route) {
  const filename = routeFiles.get(route);
  assert.ok(filename, `Rota sem arquivo esperado: ${route}`);
  return readFile(path.join(output, filename), "utf8");
}

function anchors(html) {
  return [...html.matchAll(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g)].map((match) => ({
    attributes: `${match[1]} ${match[3]}`,
    href: match[2],
  }));
}

test("todas as rotas principais são exportadas", async () => {
  for (const filename of routeFiles.values()) {
    await access(path.join(output, filename));
  }
});

test("cada página oferece navegação global e rodapé com os quatro destinos", async () => {
  for (const route of routes) {
    const html = await page(route);
    assert.match(html, /Navegação principal/i, route);
    assert.match(html, /Navegação do rodapé/i, route);
    for (const destination of routes) {
      assert.ok(
        anchors(html).some((link) => link.href === destination || link.href === `${destination}/`),
        `${route}: destino interno ausente ${destination}`,
      );
    }
  }
});

test("menu responsivo mantém controles acessíveis no HTML exportado", async () => {
  for (const route of routes) {
    const html = await page(route);
    assert.match(html, /aria-controls="site-navigation"/, route);
    assert.match(html, /aria-expanded="false"/, route);
    assert.match(html, /Abrir menu/, route);
    assert.match(html, /Pular para o conteúdo/, route);
  }
});

test("CTAs da Home conduzem à galeria e à apresentação institucional", async () => {
  const html = await page("/");
  const links = anchors(html);
  assert.ok(links.some((link) => link.href === "/galeria"), "CTA da galeria ausente");
  assert.ok(links.some((link) => link.href === "#sobre-elenco"), "CTA de apresentação ausente");
  assert.match(html, /Encontre suas fotos/);
  assert.match(html, /Descubra o ELENCO/);
});

test("chamadas entre Sobre e Contato mantêm caminhos internos válidos", async () => {
  const about = await page("/sobre");
  const contact = await page("/contato");
  assert.ok(anchors(about).some((link) => link.href === "/contato"));
  assert.ok(anchors(contact).some((link) => link.href === "/"));
  assert.match(about, /Converse com o ELENCO/);
  assert.match(contact, /Voltar ao início/);
});

test("destinos externos oficiais abrem com proteção de nova aba", async () => {
  const external = [
    "https://www.instagram.com/tonoelenco/",
    "https://banlek.com/tonoelenco",
  ];
  for (const route of routes) {
    const html = await page(route);
    const links = anchors(html);
    for (const destination of external) {
      const link = links.find((item) => item.href === destination);
      if (!link) continue;
      assert.match(link.attributes, /target="_blank"/, `${route}: target ausente para ${destination}`);
      assert.match(link.attributes, /rel="[^"]*noopener[^"]*"/, `${route}: noopener ausente`);
      assert.match(link.attributes, /rel="[^"]*noreferrer[^"]*"/, `${route}: noreferrer ausente`);
    }
  }
  const contact = await page("/contato");
  for (const destination of external) {
    assert.ok(anchors(contact).some((link) => link.href === destination), `Contato sem ${destination}`);
  }
});

test("não há links internos apontando para rotas fora do mapa principal", async () => {
  const allowed = new Set(routes);
  for (const route of routes) {
    for (const link of anchors(await page(route))) {
      if (!link.href.startsWith("/") || link.href.startsWith("//") || link.href.startsWith("/#")) continue;
      const normalized = link.href.replace(/\/$/, "") || "/";
      assert.ok(allowed.has(normalized), `${route}: rota interna sem página ${link.href}`);
    }
  }
});
