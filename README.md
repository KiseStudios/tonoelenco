# ELENCO — Fotografia Esportiva

Site da ELENCO desenvolvido pela Kise Studios. O PR-001 disponibiliza uma rota técnica em `/` para verificar o ambiente.

## Executar localmente

Use Node.js 24 LTS e o npm incluído. Com nvm, execute `nvm install 24` e `nvm use 24`. Na raiz do repositório, execute:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000 e confira o título “ELENCO — Fundação técnica”. Encerre o servidor com Ctrl+C.

## Validar a entrega

```sh
npm run lint
npm run typecheck
npm run build
```

A CI executa esses comandos, após `npm ci`, em cada pull request. Para conferir o build localmente, execute `npm start` depois de encerrar o servidor de desenvolvimento.

## Organização

O App Router fica em `src/app`. O arquivo `layout.tsx` define o idioma e o título, `page.tsx` atende a rota inicial e `globals.css` importa o Tailwind CSS. O TypeScript usa modo estrito e o alias `@/*` aponta para `src/*`. O comando de tipagem gera os tipos das rotas antes de executar o compilador.
