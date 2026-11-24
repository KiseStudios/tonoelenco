# PR-007 — Sobre, Contato e rodapé institucional

## Base e implementação

A main foi atualizada para 3b6e59b860d200c939fa895a7e0dc69b78b5eb37 após confirmação do merge do GitHub PR #8. A branch feat/pr-007-sobre-contato foi criada a partir dessa main.

As páginas /sobre e /contato são Server Components. Sobre possui abertura tipográfica, apresentação da proposta, retrato do fundador consumido do manifesto e encerramento com CTA para Contato. Contato apresenta os dois canais oficiais em ações acessíveis e uma rota de retorno à Home.

SiteFooter é renderizado no servidor e entregue ao SiteShell por um slot. O ano dos direitos autorais é calculado durante o build estático. O PNG oficial permanece intacto, com a versão clara obtida por inversão CSS no fundo preto. A navegação interna compartilhada fica em src/lib/navigation.ts. Os destinos externos continuam em src/lib/links.ts.

A chamada institucional existente da Home leva à página Sobre. ContactClosing é reutilizado na Home e em Sobre. Hero, galeria, contratos, fotografias e configuração de exportação estática foram preservados.

## Validações executadas

- npm ci aprovado com Node 24.22.3 e npm 11.19.1.
- npm run test:content aprovado, 7 testes.
- npm run lint, npm run typecheck e npm run build aprovados.
- Exportação de out/index.html, out/galeria.html, out/sobre.html e out/contato.html confirmada.
- Auditoria do HTML das quatro rotas verificou um h1, um Header global e um rodapé por página, descrição, existência dos links internos e assets, alt das imagens, URLs oficiais e proteções de nova aba.
- Open Graph textual foi conferido nas novas páginas.
- Fotografia institucional presente em Sobre e ausente da galeria.
- Diff confirma preservação da Hero, componentes da galeria, assets, manifesto, tipos e next.config.ts.

## Revisão real no navegador

A prévia da branch no Cloudflare Pages foi aberta em Chromium. As larguras foram verificadas com quadros de mesmo domínio em 390 × 900, 820 × 900 e 1440 × 900. innerWidth confirmou os três valores. O quadro de desktop foi exibido com zoom externo de 90% para caber na janela. O auxiliar de revisão foi removido da entrega. As imagens de evidência são capturas reais, recortadas apenas nas margens externas dos quadros.

| Verificação | Resultado |
| --- | --- |
| Sobre e Contato em 390, 820 e 1440 px | Sem overflow horizontal |
| Header e rodapé | Presentes e navegáveis |
| Menu mobile | Abertura por Enter, seleção de rota e fechamento por Escape conferidos |
| Rota ativa | Sobre e Contato indicadas corretamente |
| Retrato oficial | Carregado, proporção nativa preservada |
| Home → Sobre | CTA Conheça o ELENCO navega corretamente |
| Sobre → Contato | CTA Converse com o ELENCO navega corretamente |
| Galeria após nova navegação | Sete fotografias, ampliação e setas funcionando |
| Escape no lightbox | Fecha, retorna foco e libera rolagem |
| Instagram e Banlek | Destinos, target e rel conferidos no DOM |

Os testes por clique e teclado não substituem testes em aparelhos físicos. A disponibilidade remota dos serviços externos não foi verificada.

## Capturas

- [Sobre desktop](evidence/pr-007/about-1440.jpg)
- [Sobre tablet](evidence/pr-007/about-820.jpg)
- [Sobre mobile](evidence/pr-007/about-390.jpg)
- [Fundador desktop](evidence/pr-007/founder-1440.jpg)
- [Fundador mobile](evidence/pr-007/founder-390.jpg)
- [Contato desktop](evidence/pr-007/contact-1440.jpg)
- [Contato tablet](evidence/pr-007/contact-820.jpg)
- [Contato mobile](evidence/pr-007/contact-390.jpg)
- [Rodapé desktop](evidence/pr-007/footer-1440.jpg)
- [Rodapé mobile](evidence/pr-007/footer-390.jpg)
- [Menu mobile](evidence/pr-007/menu-390.jpg)
- [Chamadas da Home desktop](evidence/pr-007/home-closing-1440.jpg)
- [Chamadas da Home mobile](evidence/pr-007/home-closing-390.jpg)

## Pendências editoriais

A redação apresenta o posicionamento do ELENCO. Nome e biografia do fundador seguem pendentes de aprovação. Créditos e autorização definitiva de publicação dos assets mantêm os estados existentes do manifesto. O crédito da Kise Studios aguarda aprovação para publicação. A aprovação visual definitiva cabe a Luan, Eduardo e ao cliente.
