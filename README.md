# ELENCO — Fotografia Esportiva

Site da ELENCO desenvolvido pela Kise Studios, com Home editorial e rota provisória de galeria.

## Executar localmente

Use Node.js 24 LTS e o npm incluído. Com nvm, execute `nvm install 24` e `nvm use 24`. Na raiz do repositório, execute:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000 para conferir a Home e /galeria. Encerre o servidor com Ctrl+C.

## Validar a entrega

```sh
npm run lint
npm run typecheck
npm run build
```

A CI executa esses comandos, após `npm ci`, em cada pull request. O build exporta os arquivos estáticos para `out/`. Para conferir essa saída, use um servidor de arquivos estáticos com suporte a URLs sem extensão, como o Cloudflare Pages. O comando `npm start` usa o servidor Next.js e é incompatível com o modo de exportação estática.

## Organização

O App Router fica em `src/app`. O arquivo `layout.tsx` define o idioma e o título, `page.tsx` atende a rota inicial e `globals.css` importa o Tailwind CSS. O TypeScript usa modo estrito e o alias `@/*` aponta para `src/*`. O comando de tipagem gera os tipos das rotas antes de executar o compilador.


## Cloudflare Pages

Configure a branch de produção como `main`, o preset como **Next.js (Static HTML Export)**, o comando de build como `npm run build` e o diretório de saída como `out`. A raiz é a raiz do repositório. Use Node.js 24 conforme `.nvmrc`.

A configuração `output: "export"` gera o diretório esperado pelo Pages. As imagens são servidas diretamente dos arquivos oficiais de `public/` com `images.unoptimized`, dispensando o serviço de otimização de imagens do servidor Next.js.
