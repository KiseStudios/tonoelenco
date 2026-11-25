# PR-012 — Revisão visual final e quadro de aprovação

## Objetivo
Gerar evidência reproduzível das cinco áreas: Hero, transição, galeria, Sobre e Footer, em 390, 820 e 1440 px. A suíte captura a aplicação real no Chromium, anexa imagens ao relatório Playwright e grava a rolagem integral desktop.

## Referências existentes
| Área | Capturas já versionadas |
|---|---|
| Hero | [Antes/depois 390](evidence/hero-refinement/before-390.jpg) · [Depois 390](evidence/hero-refinement/after-390.jpg) · [Antes/depois 820](evidence/hero-refinement/before-820.jpg) · [Depois 820](evidence/hero-refinement/after-820.jpg) · [Antes/depois 1440](evidence/hero-refinement/before-1440.jpg) · [Depois 1440](evidence/hero-refinement/after-1440.jpg) |
| Transição | [Início 1440](evidence/hero-refinement/camera-start-1440.jpg) · [Progresso 1440](evidence/hero-refinement/camera-progress-1440.jpg) · [Fallback 390](evidence/hero-refinement/camera-fallback-390.jpg) · [PR-006 mobile](evidence/pr-006/transition-390.jpg) |
| Galeria | [Home 390](evidence/pr-006/section-390.jpg) · [Home 820](evidence/pr-006/section-820.jpg) · [Home 1440](evidence/pr-006/section-1440.jpg) · [Galeria 390](evidence/pr-006/gallery-390.jpg) · [Galeria 1440](evidence/pr-006/gallery-1440.jpg) |
| Sobre | [390](evidence/pr-007/about-390.jpg) · [820](evidence/pr-007/about-820.jpg) · [1440](evidence/pr-007/about-1440.jpg) |
| Footer | [390](evidence/pr-007/footer-390.jpg) · [1440](evidence/pr-007/footer-1440.jpg) |

As novas capturas e o vídeo ficam nos artefatos da execução de CI (`pr-012-visual-review`). O Footer não tinha referência histórica arquivada em 820 px. As capturas automatizadas são estados renderizados, não substituem os frames aprovados do Figma.

## Diferenças já tratadas no histórico
- Hero: JPEG original 692 × 993 px, proporção nativa e `object-fit: contain`; sem recorte artificial.
- Transição: percurso reversível ligado ao scroll; fallback estático para movimento reduzido/mobile.
- Galeria: proporções das fotografias preservadas e legendas fora das imagens.
- Sobre/Footer: componentes compartilhados mantidos e logo oficial preservado.
- QA-04 do PR-011: overflow a 200% em 390 px corrigido nas quatro rotas.
- QA-02/03 do PR-011 (LCP móvel e SEO/publicação) continuam pendências não visuais e não são mascaradas aqui.

## Identidade e escopo
Sem textos, fotografias, créditos ou logos inventados. Sem trocar família tipográfica, paleta, imagem ou direção criativa sem frame aprovado. Sem alterar contratos de dados, manifesto, rotas ou arquitetura. A família tipográfica oficial segue aguardando confirmação.

## Matriz automatizada
| Área | 390 | 820 | 1440 |
|---|---|---|---|
| Hero | Captura CI | Captura CI | Captura CI |
| Transição | Captura CI | Captura CI | Captura CI |
| Galeria | Captura CI | Captura CI | Captura CI |
| Sobre (página) | Captura CI | Captura CI | Captura CI |
| Footer | Captura CI | Captura CI | Captura CI |

A CI verifica overflow horizontal nos três viewports. Chromium/CI não equivale a Safari nem a aparelhos físicos.

## Aceite visual — Eduardo
- [ ] Comparativos lado a lado conferidos contra os frames aprovados.
- [ ] Espaçamento, tipografia, recortes, alinhamento e hierarquia aprovados.
- [ ] Fotografia e logos preservam arquivos e identidade original.
- [ ] Hero, transição, galeria, Sobre e Footer revisados em 390/820/1440 px.
- [ ] Nenhum desvio visual aberto sem justificativa e aceite.
- [ ] Vídeo integral conferido.
- [ ] Aceite assinado por Eduardo.

**Status:** aguardando revisão humana. Não declarar aceite assinado nem aprovação do cliente antes do registro de Eduardo.

## Limites
Se a comparação com o Figma indicar mudança criativa, abrir decisão para aceite antes de implementar. Capturas e testes automatizados não certificam alinhamento/crop visual contra uma referência não fornecida.
