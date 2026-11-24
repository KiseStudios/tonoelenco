# PR-006 — Galeria editorial

## Implementação

A Home apresenta uma seleção de três fotografias após a Hero e a faixa editorial. A página /galeria apresenta as sete fotografias esportivas do manifesto. O retrato institucional permanece reservado. Os links oficiais usam src/lib/links.ts e o acervo geral está identificado como Banlek.

CoverageSection é um Server Component. CoverageGrid e PhotoLightbox concentram as interações. O diálogo nativo usa showModal, fechamento por botão e Escape, setas com navegação circular, ciclo de Tab/Shift+Tab, bloqueio de rolagem e retorno do foco. As imagens mantêm suas proporções, usam dimensões explícitas e carregamento lazy, com exceção da Hero prioritária já existente.

## Referência visual

ELENCO-gallery-preview.png foi inspecionado. A composição utiliza o fundo neutro, a headline em três linhas, o itálico expressivo, os tons preto e cinza e a seleção de corrida, areia e motocross.

As proporções completas das fotos foram mantidas. As legendas ficam fora das imagens para legibilidade. Os três módulos possuem larguras distintas, adequadas aos enquadramentos disponíveis. A imagem na areia utiliza “Esporte na areia”, corrigindo a classificação não confirmada do preview. A tipografia utiliza o sistema existente, cuja família oficial segue pendente no design foundation. O aceite visual definitivo pertence ao cliente.

## Validação técnica executada

Node 24.22.3, npm 11.19.1. npm ci, npm run test:content (7 testes), npm run lint, npm run typecheck e npm run build aprovados. A saída out contém index.html, galeria.html e todos os assets referenciados. O HTML exportado contém três botões de ampliação na Home e sete na galeria. A fotografia institucional está ausente dessas interfaces.

## Revisão no navegador

A prévia real do Cloudflare foi aberta em Chromium. Para validar as larguras exatas, a aplicação foi carregada em quadros do mesmo domínio com viewports de 390 × 900, 820 × 900 e 1440 × 900. innerWidth confirmou cada largura. O auxiliar público de revisão foi removido na entrega final.

As capturas são renderizações reais do site. As margens externas dos quadros foram recortadas, sem reconstruir a interface. O viewport de 1440 foi exibido com zoom externo de 90% para caber na janela disponível. Os testes não substituem a revisão em aparelhos físicos.

| Verificação | Resultado observado |
| --- | --- |
| Home em 390, 820 e 1440 | Sem overflow horizontal |
| Galeria em 390, 820 e 1440 | Sem overflow horizontal, sete fotos |
| Menu mobile | Abre, fecha e recolhe ao selecionar Galeria |
| Navegação interna | Home → Galeria, indicação ativa atualizada |
| Abrir e fechar ampliação | Botões e Escape funcionam |
| Navegação entre fotos | Botões, setas e retorno circular funcionam |
| Tab e Shift+Tab no diálogo | Foco circula entre os controles |
| Fechamento | Foco retorna à fotografia de origem, overflow restaurado |
| Imagens e hover | Decodificadas, proporções preservadas e feedback de hover |
| Destinos externos | href, target e rel conferidos, sem teste de disponibilidade remota |

O teste inicial de Shift+Tab motivou o reforço explícito do ciclo de foco antes das capturas finais. As transições CSS respeitam prefers-reduced-motion. A navegação por toque utiliza botões nativos de ao menos 44 px, sem simular teste em dispositivo físico.

## Capturas

- [Home 1440](evidence/pr-006/home-1440.jpg)
- [Home 820](evidence/pr-006/home-820.jpg)
- [Home 390](evidence/pr-006/home-390.jpg)
- [Seção editorial 1440](evidence/pr-006/section-1440.jpg)
- [Seção editorial 820](evidence/pr-006/section-820.jpg)
- [Seção editorial 390](evidence/pr-006/section-390.jpg)
- [Transição mobile](evidence/pr-006/transition-390.jpg)
- [Galeria desktop](evidence/pr-006/gallery-1440.jpg)
- [Galeria mobile](evidence/pr-006/gallery-390.jpg)
- [Lightbox desktop](evidence/pr-006/lightbox-1440.jpg)
- [Lightbox mobile](evidence/pr-006/lightbox-390.jpg)
- [Foco](evidence/pr-006/focus-1440.jpg)
- [Hover](evidence/pr-006/hover-1440.jpg)

## Pendências editoriais

Créditos individuais, autorização definitiva de publicação e modalidade específica na areia continuam pendentes conforme o manifesto. Não existem eventos ou álbuns comerciais cadastrados. A aprovação visual definitiva depende de Eduardo e do cliente.
