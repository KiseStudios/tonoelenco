# ELENCO — PR-011 · Auditoria técnica

## Resumo executivo

A auditoria partiu da `main` em `ec2309a2be0bf317975978dcfe52ebc1ddac90cc`, com PR-010 (#17), correção da transição (#16) e ajuste de enquadramento (#18) integrados. O histórico, as quatro rotas e as configurações de build foram verificados antes das alterações.

O PR também corrige overflow de texto ampliado a 200% nas quatro rotas. A correção de runtime limita o tempo de espera por um frame do worker da câmera. Se o worker ficar sem responder com a aba visível, a aplicação encerra o worker, desconecta os observadores, remove o canvas e continua no fallback 2D. A identidade visual, as imagens, os textos e os destinos externos continuam os mesmos.

## Ambiente e configuração

- Linux x86_64, Node 24.22.3, Next.js 16.4.6, TypeScript 5.9, Tailwind 4, GSAP 3 e Three.js r180. A auditoria usa `npm run build` e serve a saída `out/`, com resolução de rotas sem extensão.
- Playwright 1.65.1, Chrome for Testing Headless 158.0.8127.88, Firefox 159 e WebKit 27.2 do Playwright no Linux. O perfil Android é um Pixel 7 emulado com entrada touch via CDP.
- Lighthouse 13.6.0, Chrome for Testing 158.0.8127.88, localhost, cache limpo, três execuções por perfil. Os artefatos HTML e JSON preservam as configurações de throttling e as execuções individuais.
- Sem medição em Safari comercial ou dispositivos físicos. SwiftShader exercitou WebGL2, worker e OffscreenCanvas por software. Seus tempos não estimam FPS, consumo de GPU ou bateria em hardware real.

## Execução reproduzível

```bash
npm ci
npm run lint
npm run test:content
npm run typecheck
npm run build
npm run test:navigation
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

O HTML do Playwright é gerado em `playwright-report/`. O relatório JSON fica em `test-results/e2e.json`. Para usar outro build estático, definir `ELENCO_EXPORT_DIR`. A execução padrão usa o `out/` local.

Para repetir o Lighthouse, manter o servidor estático em execução e usar o mesmo Chrome nas duas builds. A ausência de `--preset=desktop` seleciona o perfil móvel.

```bash
ELENCO_QA_PORT=4220 node tests/e2e/static-server.mjs
npx --yes lighthouse@13.6.0 http://127.0.0.1:4220/ --throttling-method=simulate --only-categories=performance,accessibility,seo --output=json --output=html --output-path=./lighthouse-mobile
```

## Testes técnicos

| Verificação | Linha de base | Versão do PR |
| --- | --- | --- |
| Lint, typecheck, build estático | Passaram | Passaram |
| Conteúdo e manifesto de assets | 8/8 | 8/8 |
| Integração de rotas e links no HTML exportado | 7/7 | 7/7 |
| Playwright | A regressão de worker pendurado foi reproduzida | 54 aprovados, 6 ignorados por perfil, nenhuma falha |

O build exporta Home, Galeria, Sobre, Contato e 404. Também foram verificados os caminhos dos recursos estáticos e o carregamento direto das rotas. A publicação em produção segue o fluxo do repositório após aprovação e merge. [Como o Cloudflare Pages serve as rotas](https://developers.cloudflare.com/pages/configuration/serving-pages/)

## Matriz funcional

| Ambiente | Viewport | Verificações |
| --- | --- | --- |
| Chrome for Testing | 1440 × 900 | Jornada, teclado, lightbox, responsividade, 2D, Three.js e descarte do worker |
| Firefox | 820 × 1024 | Jornada, teclado, lightbox, responsividade, scroll e fallback 2D |
| WebKit em Linux | 390 × 844 | Jornada, menu, teclado, lightbox, responsividade, scroll e fallback 2D |
| Chrome com Pixel 7 emulado | 390 × 844 | Jornada, menu, lightbox, acessibilidade automatizada e gestos touch de avanço e retorno |
| Chrome complementar | 320 × 740, 768 × 1024, 844 × 390, 1024 × 768, 1920 × 1080 | Reflow e overflow nas quatro rotas |

A jornada cobriu os dois CTAs da Hero, galeria, navegação no lightbox, Sobre, Contato, histórico, retorno à Home e destinos oficiais. Banlek e Instagram mantiveram URLs e abertura protegida em nova aba. As duas URLs responderam HTTP 200 neste ambiente. A resposta da plataforma não comprova disponibilidade de álbuns ou funções autenticadas. Imagens bloqueadas de propósito tiveram nome acessível e o lightbox continuou operável. Os testes esperavam 404 para uma rota desconhecida. A disponibilidade de coberturas e estados do manifesto continua coberta pelos testes de conteúdo.

## Acessibilidade por caso

| Caso | Resultado e alcance |
| --- | --- |
| Landmarks, títulos, estado do menu e nomes acessíveis | Um `main` e um `h1` por rota; links e botões foram encontrados por nome; navegação atual marcada. |
| Primeiro Tab e atalho | Foco visível no atalho e transferido para o conteúdo depois de Enter. |
| Teclado e foco no lightbox | Enter abre, setas mudam a foto, Escape fecha e devolve o foco ao acionador. Menu mobile fecha via Escape e devolve o foco ao botão. |
| Contraste e imagens | Axe sem violações nas quatro rotas nos quatro perfis; alt conferido em caso de falha da imagem; Hero revisada nas capturas. O axe não mede sozinho o contraste em todas as combinações de foto e texto. |
| Ampliação/reflow | Em 390 px, a ampliação da raiz a 200% produzia larguras de 460/466/574/432 px na base (Home/Galeria/Sobre/Contato). Após as correções as quatro ficaram em 390 px. A verificação altera o tamanho de fonte raiz e não equivale a todas as modalidades de zoom de navegador. |
| Áreas de toque | Botões testados em perfil touch; menu, CTAs e controles do lightbox com área de interação prevista no CSS. |
| Movimento reduzido e conteúdo estático | Câmera estática, sem worker nem distância extra. O CTA principal navega sem JavaScript; conteúdo da galeria e textos aparecem na exportação. |

Escopo baseado em [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/). Os testes cobriram casos selecionados e não constituem certificação de conformidade ou teste com leitores de tela em aparelhos físicos.

## Fotografia e transição

- A Hero manteve o JPEG original de 692 × 993 px, verificado por hash. `object-fit: contain`, dimensões intrínsecas e proporção foram testados; a imagem não é ampliada acima da largura nativa. O desktop ainda reserva a coluna editorial escura para o texto, com degradê radial. A composição integral do retrato no quadro aprovado é diferente do recorte ampliado anterior.
- Dos 11 arquivos de imagem em `public/images/`, os WebP usados ficam entre 25,7 e 137,4 KiB. O JPEG da Hero tem 138,6 KiB, o pôster da câmera tem 59,3 KiB e mede 1440 × 1000 px. Galeria e editoriais usam os WebP locais com dimensões reservadas e lazy loading. A Hero tem carregamento prioritário. O derivado de Hero de 480 px permanece no export sem referências na página inicial. Não há fontes externas solicitadas na Home.
- Na primeira rolagem gravada, a posição absoluta da galeria ficou em 2746 px no desktop e 2146 px no mobile, sem mudança da altura da página. A carga inicial e a primeira passagem produziram tarefas principais acima de 50 ms de 53 ms no desktop e 51/103 ms no mobile, em uma gravação local. Não houve salto para o fim; esses valores não medem INP nem garantem ausência de perda de quadros em aparelhos físicos.
- Exercitados avanço, retorno, recarga no meio, gesto touch, ausência de OffscreenCanvas e movimento reduzido. O palco permaneceu sticky até o limite previsto. Em Chrome/SwiftShader, a perda de contexto induzida removeu o canvas e acionou o 2D. A remontagem criou um único worker; não houve frames adicionais em repouso ou quando a cena ficou para trás do viewport. Na inspeção do código, a cena descarta geometrias, materiais, texturas e renderer no caminho de perda de contexto. Na saída da Home, o worker é terminado.
- O teste de recarga permitiu a consolidação do histórico nativo depois da rolagem. A posição reapareceu também em WebKit, em comparação entre base e candidato com JavaScript ligado e desligado.

## Lighthouse e Core Web Vitals

Medianas de três medições na Home, sem interação. O servidor local não aplica CDN nem compressão de transferência. Tamanho e latência são valores do laboratório; o comportamento da lente durante a interação foi testado separadamente.

| Versão e perfil | FCP | LCP | CLS | TBT | Speed Index | Total | JS | Imagens | Bootup JS | Performance |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Base · mobile | 1,05 s | 6,52 s | 0,000 | 54 ms | 1,73 s | 1.146 KiB | 594 KiB | 479 KiB | 503 ms | 77 |
| PR · mobile | 1,05 s | 6,44 s | 0,000 | 44 ms | 1,73 s | 1.146 KiB | 594 KiB | 479 KiB | 473 ms | 77 |
| Base · desktop | 0,28 s | 1,23 s | 0,000 | 0 ms | 0,44 s | 1.164 KiB | 594 KiB | 479 KiB | 87 ms | 97 |
| PR · desktop | 0,28 s | 1,22 s | 0,000 | 0 ms | 0,43 s | 1.164 KiB | 594 KiB | 479 KiB | 43 ms | 97 |

O perfil móvel simula RTT de 150 ms, 1.638,4 kbps e CPU 4× mais lenta. O perfil desktop simula RTT de 40 ms, 10.240 kbps e CPU 1×. As notas medianas de acessibilidade e SEO da Home foram 100 na base e no PR. A diferença nas medidas de tempo é observacional; o PR não introduz otimização que explique ganho de LCP.

Referência de campo no percentil 75: LCP até 2,5 s, CLS até 0,10 e INP até 200 ms. O CLS simulado ficou dentro do alvo. O LCP móvel de laboratório permaneceu acima do objetivo. TBT é registrado como métrica de bloqueio de laboratório, sem equivalência com INP. O pedido de dados de campo pelo PageSpeed Insights retornou HTTP 429; não há evidência suficiente aqui para aprovar os Core Web Vitals do domínio. [Web Vitals](https://web.dev/articles/vitals) · [Lighthouse TBT](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/)

O Lighthouse registrou downloads iniciais dos JavaScript da Home e de imagens abaixo da dobra que estavam dentro do limiar de lazy loading do navegador. A posição do JPEG e os recursos já eram prioritários no HTML. A auditoria preservou o arquivo original e o comportamento de navegação.

## Publicação e SEO

As quatro páginas têm título e descrição. Sobre e Contato incluem Open Graph, enquanto Home e Galeria ainda não o incluem. A build não emite sitemap, metadado de favicon, canonical ou robots próprio. No domínio público, as quatro rotas responderam HTTP 200, `robots.txt` respondeu 200 e `sitemap.xml` e `favicon.ico` retornaram 404. A auditoria não alterou metadados ou textos editoriais.

## Registro de problemas

| ID | Severidade | Ambiente, reprodução e observado | Esperado, causa e ação |
| --- | --- | --- | --- |
| QA-01 | P2 | Chrome desktop com OffscreenCanvas. Instrumentar `Worker.postMessage` para o worker carregar sem responder e rolar até a lente. Na base o canvas continuou montado após 7 s. | Liberar o worker e manter a lente 2D. Faltava expiração para um frame em voo. `camera-preview.ts` agora encerra a tentativa após 5 s visíveis; o teste prova a falha na base e a recuperação no PR. |
| QA-02 | P1 de laboratório | Chrome móvel simulado. Rodar três medições da Home exportada. O LCP mediano excede 2,5 s e os relatórios mostram o volume de scripts e recursos iniciais. | Investigar com observações de campo, perfis em hardware representativo e distribuição de carga abaixo da dobra. Medição sem CDN e limite de campo indisponível. Preservada a fotografia oficial; hipótese de rede e JS requer medição adicional. |
| QA-03 | P3 | Conferir head das quatro rotas e solicitar sitemap/favicon no domínio; recursos ausentes conforme a seção SEO. | Definir o conjunto de metadados e URLs canônicas com o domínio final. Ausência observável no layout e na saída estática; pendência de publicação. |
| QA-04 | P1 | Chrome em 390 px com fonte raiz a 200%. As quatro rotas tinham trechos fora da viewport; a Galeria ocupava 466 px e Sobre 574 px. | Conservar o conteúdo no espaço disponível. A largura mínima implícita do grid, palavras extensas e o CTA sem quebra provocavam overflow. `coverage.css` e `institutional.css` permitem quebra apenas quando necessária. As quatro rotas passaram na regressão. |
| QA-05 | P3 | Node 24 em `npm run test:content` emite aviso de classificação do módulo TypeScript. | Remover o aviso quando houver revisão do formato de módulos; a suíte já passa e o aviso não impede o build. |

## Próximas fases

- **PR-012** — Revisar o acabamento e o equilíbrio do enquadramento inteiro da Hero com as capturas de referência. Validar contraste sobre a fotografia nos estados com movimento e o layout editorial em aparelhos físicos.
- **PR-013** — Validar aparelho físico com Safari, Android e iOS, métricas de campo e publicação final. Confirmar domínio canônico, Open Graph, sitemap e ícone. Repetir o cenário de WebGL em GPU real.

Os fluxos auditados passaram no build estático, sem P0 reproduzido nos ambientes cobertos após a correção. LCP móvel de laboratório, dispositivos físicos e SEO seguem como pendências.
