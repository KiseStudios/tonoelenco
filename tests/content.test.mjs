import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";
import { photographs, coverages, heroPhoto } from "../src/data/coverage.ts";
import { officialLinks, externalLinkProps } from "../src/lib/links.ts";

const publicDirectory = path.resolve("public");

test("IDs de fotografias e coberturas são únicos", () => {
  for (const items of [photographs, coverages]) {
    assert.equal(new Set(items.map((item) => item.id)).size, items.length);
    assert.ok(items.every((item) => item.id.trim().length > 0));
  }
});

test("assets existem, decodificam e têm dimensões iguais ao manifesto", async () => {
  for (const photo of photographs) {
    const filename = path.resolve(publicDirectory, "." + photo.src);
    assert.ok(filename.startsWith(publicDirectory + path.sep));
    const image = sharp(await readFile(filename));
    const metadata = await image.metadata();
    assert.equal(metadata.width, photo.width, photo.id);
    assert.equal(metadata.height, photo.height, photo.id);
    assert.ok(Number.isInteger(photo.width) && photo.width > 0);
    assert.ok(Number.isInteger(photo.height) && photo.height > 0);
    await image.raw().toBuffer();
  }
});

test("fotografias possuem descrição acessível e origem rastreável", () => {
  for (const photo of photographs) {
    assert.ok(photo.alt.trim().length >= 20, photo.id);
    assert.doesNotMatch(photo.alt, /placeholder|lorem ipsum|imagem genérica/i);
    assert.ok(photo.name.trim());
    assert.ok(photo.source.archive.endsWith(".zip"));
    assert.ok(photo.source.file.endsWith(".jpeg"));
    assert.match(photo.source.sha256, /^[a-f0-9]{64}$/);
    if (photo.authorization.publication === "confirmada") {
      assert.ok(photo.authorization.evidence?.trim());
    }
    if (photo.credit) assert.ok(photo.credit.evidence.trim());
    if (photo.kind === "institucional") assert.equal(photo.sport, null);
  }
});

function assertConfirmedAlbum(album) {
  const url = new URL(album.url);
  assert.equal(url.protocol, "https:");
  assert.ok(album.evidence.trim());
  assert.doesNotMatch(url.href, /example\.com|placeholder|evento-ficticio/i);
  assert.ok(!Object.values(officialLinks).includes(url.href));
}

test("coberturas referenciam fotos existentes e álbuns comprovados", () => {
  const ids = new Set(photographs.map((photo) => photo.id));
  for (const coverage of coverages) {
    if (coverage.coverPhotoId !== null) assert.ok(ids.has(coverage.coverPhotoId));
    for (const id of coverage.photoIds) assert.ok(ids.has(id));
    if (coverage.availability === "disponivel") assertConfirmedAlbum(coverage.album);
    else assert.equal(coverage.album, null);
  }
  for (const photo of photographs) {
    if (photo.album !== null) assertConfirmedAlbum(photo.album);
  }
});

test("acervo recebido tem oito fotos e nenhum álbum inferido", () => {
  assert.equal(photographs.length, 8);
  assert.equal(coverages.length, 0);
  assert.ok(photographs.every((photo) => photo.album === null));
  assert.equal(heroPhoto.id, "motocross-front");
});

test("links oficiais têm sintaxe e destinos fornecidos no briefing", () => {
  assert.equal(officialLinks.instagram, "https://www.instagram.com/tonoelenco/");
  assert.equal(officialLinks.archive, "https://banlek.com/tonoelenco");
  for (const link of Object.values(officialLinks)) {
    assert.equal(new URL(link).protocol, "https:");
  }
  assert.equal(externalLinkProps.target, "_blank");
  assert.match(externalLinkProps.rel, /noopener/);
  assert.match(externalLinkProps.rel, /noreferrer/);
});

test("logotipo oficial preservado continua decodificável", async () => {
  const image = sharp("public/brand/logo-horizontal.png");
  assert.equal((await image.metadata()).format, "png");
  await image.raw().toBuffer();
});
