# ELENCO — Fotografia Esportiva

Site editorial da ELENCO, desenvolvido pela Kise Studios. A Home reúne a fotografia principal e uma transição de ícones esportivos para a assinatura oficial, controlada pela rolagem. A galeria editorial, Sobre e Contato usam rotas próprias. A busca de fotos do acervo abre a Banlek.

A aplicação usa Next.js App Router, React, TypeScript e Tailwind CSS. A transição usa Canvas 2D com fallback estático. A entrega é um export estático para o Cloudflare Pages.

## Executar localmente

Use Node.js 24 LTS e o npm incluído. Com nvm, execute `nvm install 24` e `nvm use 24`.

```sh
npm ci
npm run dev
```

Acesse [localhost:3000](http://localhost:3000). As rotas são `/`, `/galeria`, `/sobre` e `/contato`.

## Validar a entrega

```sh
npm run lint
npm run test:content
npm run typecheck
npm run build
npm run test:navigation
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

O build exporta o site para `out/`. Os testes E2E usam o servidor estático incluído, que também pode ser iniciado com `node tests/e2e/static-server.mjs` após o build. Abra [localhost:4173](http://localhost:4173). `npm start` usa o servidor Next.js e é incompatível com o export estático.

## Documentação

- [Checklist de homologação e roteiro do cliente](docs/release-checklist.md)
- [Configuração do Pages, deploy e rollback](docs/deploy.md)
- [Manifesto de ativos e autorizações](docs/assets.md)
- [Auditoria de desempenho e acessibilidade do PR-011](docs/qa-performance.md)
- [Quadro de revisão visual do PR-012](docs/pr-012-visual-review.md)
