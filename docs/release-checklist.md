# ELENCO — PR-014 · Homologação final

## Candidato

- Base consolidada `d74baa42a8df9cf2e0163ba52e6aef6dd7b77d86` da `main`, com os PRs #17, #18, #19, #20, #21 e #22 integrados.
- Branch candidata `release/pr-014-homologacao-final`. O SHA remoto do candidato, a execução da CI e o pacote identificado por commit constam na descrição do PR. A alteração desta fase é documental. Código, testes, workflows, imagens e lockfile são idênticos à base homologada.
- Revisadas a [auditoria do PR-011](qa-performance.md), as referências e o [quadro sem aceite do PR-012](pr-012-visual-review.md) e a sequência editorial do PR #22. As evidências anteriores serviram de referência histórica. As capturas desta homologação vieram do export atual.

## Resultado por área

| Área | Estado | Evidência e limite |
| --- | --- | --- |
| Técnica | Pendente | Instalação limpa, lint, typecheck, build, 15 testes de conteúdo e navegação e 76 E2E passaram localmente. 24 casos ignorados por perfil. LCP móvel acima da referência e dados de campo indisponíveis. |
| Visual | Pendente | Seções conferidas no Chromium em 390, 820 e 1440 px. Hero usa fotografia inteira, na proporção original. Em desktop permanece uma coluna editorial ampla e escura atrás do texto. A ausência de um bloco escuro ocupando aproximadamente metade do quadro não foi marcada como aprovada. Tipografia oficial e comparação com frames finais aprovados seguem para revisão de Eduardo. |
| Funcional | Aprovado nos ambientes testados | Home, Galeria, Sobre e Contato, CTAs, coberturas editoriais, lightbox, navegação touch e por teclado, âncoras, histórico, recarga intermediária e erros simulados. A busca de fotos dentro da Banlek permanece para homologação humana. |
| Conteúdo | Pendente | Manifesto com autorização e créditos pendentes para oito fotografias. Os textos institucionais e os canais aguardam aceite registrado. |
| Publicação | Bloqueada | Plano de deploy e rollback documentado. Publicação exige solução dos bloqueios, revisão e autorização explícita. Configuração e ID real do deploy de retorno devem ser conferidos no painel. |
| Aceite do cliente | Pendente | Roteiro abaixo. Nenhuma decisão foi preenchida em nome do cliente, de Eduardo ou de Luan. |

## Checklist técnico, visual e funcional

- [x] Header branco, logo preto oficial, navegação, CTA do acervo e menu mobile. Links e foco testados. Rodapé, logo compartilhado e retorno ao Início conferidos.
- [x] JPEG original da Hero validado pelos testes de hash e dimensões, com `object-fit: contain`, proporção nativa, sem zoom forçado ou cortes na imagem. Slogan, degradê, fotografias e destinos existentes preservados.
- [x] Export estático das quatro rotas, 404 local, imagens decodificadas, títulos das páginas e carregamento direto. Regressão de imagem indisponível mantém identificação e lightbox operável.
- [x] Home, Galeria, Sobre e Contato testados sem overflow horizontal e com proporções preservadas em 320, 375, 390, 430, 768, 820, 844 × 390 (paisagem), 1024, 1440 e 1920 px no Chromium. Firefox em 820 px, WebKit em 390 px e Pixel 7 emulado em 390 px pela suíte. Sem iOS, Safari comercial ou Android físicos disponíveis.
- [x] Primeira rolagem com contexto novo, avanço lento e rápido, reversão com quadro idêntico, restauração após recarga, toque emulado, rotação de retrato para paisagem e retorno a Home. A galeria manteve a posição na primeira rolagem. O teste mobile usou RTT de 150 ms, download de 205.000 bytes/s e CPU 4× mais lenta.
- [x] Canvas suspende desenho fora da viewport, com zero quadros fora da tela no percurso medido. Código inspecionado para listeners, cancelamento do quadro agendado e desconexão dos dois observadores ao desmontar. A saída da Home removeu o Canvas e o retorno criou apenas um. Dependências da câmera legada continuam ausentes.
- [x] Assinatura oficial aparece mesmo com preferência de movimento reduzido, Canvas indisponível ou JavaScript desativado. Sem bloqueio programático da rolagem nos percursos verificados. O screenshot completo registra a extensão estática do palco sticky. Os vídeos e as capturas por fase mostram a composição durante a rolagem.
- [x] Navegação por teclado, tecla Escape, foco visível, retorno de foco no lightbox, alt, nome acessível, landmarks e ampliação de texto a 200%. Axe sem violações nos cenários A/AA das quatro rotas. Teste automatizado e inspeção visual são evidência amostral, com contraste sobre foto, leitores de tela e áreas de toque físicas ainda para revisão humana. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [x] `npm audit` retornou zero vulnerabilidades conhecidas no levantamento, tanto em runtime quanto com desenvolvimento. Busca superficial de padrões de chaves e tokens em arquivos rastreados teve zero correspondências. O levantamento tem escopo limitado ao checkout e às fontes consultadas.
- [ ] Revisão de consistência visual com Eduardo e Luan, incluindo coluna escura da Hero, hierarquia, tipografia, recortes, legibilidade e ritmo Hero → galeria.
- [ ] Autorizações de publicação, créditos, retrato institucional e aprovação dos textos e canais. Revisão cruzada de Luan e aceite técnico e visual de Eduardo. Aceite do cliente e autorização de publicação.

## Conteúdo, destinos e SEO

O manifesto registra oito fotografias fornecidas para desenvolvimento, com publicação pendente e créditos individuais em branco. O JPG da Hero tem 692 × 993 px e o PNG institucional tem 710 × 200 px. Os originais da Hero e da marca estão preservados. O retrato continua com a identificação de origem registrada no manifesto. Nenhum álbum de evento foi confirmado; a galeria é uma seleção editorial e encaminha para o acervo geral. [Inventário e autorizações](assets.md)

Banlek devolveu HTTP 200 com título **Banlek | ELENCO FOTOGRAFIAS**. O CTA abre o perfil oficial em nova aba. Instagram direcionou ao login ao testar o destino oficial sem sessão; a titularidade e a disponibilidade interna permanecem para verificação humana. O domínio público respondeu HTTP 200 nas quatro rotas.

As quatro páginas têm title e description. Sobre e Contato incluem Open Graph, sem imagem social identificada. Home e Galeria não têm Open Graph. O export não inclui canonical, favicon, sitemap ou robots próprio. No domínio público, favicon e sitemap retornaram 404, e robots.txt respondeu 200 como texto. Não foi confirmado um domínio canônico definitivo ou ativo social aprovado para preencher essas lacunas.

## Performance

Medianas de três execuções locais do Lighthouse 13.6.0 na Home com Chrome for Testing 158.0.8127.88, Linux, build estático, cache limpo e throttling simulado. O perfil móvel usa 150 ms de RTT, 1.638,4 kbps e CPU 4×, e desktop usa 40 ms, 10.240 kbps e CPU 1×. O teste local não usa CDN ou compressão de transferência. Valores de comparação saíram do [PR-011](qa-performance.md).

| Perfil | FCP | LCP | CLS | TBT | JavaScript | Imagens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| PR-011 · mobile | 1,05 s | 6,44 s | 0,000 | 44 ms | 594 KiB | 479 KiB |
| PR-014 · mobile | 0,90 s | 5,35 s | 0,000 | 61 ms | 484,4 KiB | 281,5 KiB |
| PR-011 · desktop | 0,28 s | 1,22 s | 0,000 | 0 ms | 594 KiB | 479 KiB |
| PR-014 · desktop | 0,24 s | 1,09 s | 0,000 | 0 ms | 484,4 KiB | 419,1 KiB |

Sem fontes externas baixadas na Home. O LCP móvel melhorou nesta comparação observacional, mas permanece acima da meta de 2,5 s, com TBT móvel subindo de 44 para 61 ms. CLS ficou dentro da referência de 0,10. O PageSpeed Insights respondeu HTTP 429 na consulta. INP de campo, cuja referência é 200 ms, e Core Web Vitals do domínio seguem sem validação. TBT mede bloqueio de laboratório. [Web Vitals](https://web.dev/articles/vitals)

O p95 do callback de desenho, em uma ida e volta local com instrumentação, foi de 1,1 ms em 390 px, 3,7 ms em 820 px, 2,7 ms em 1440 px e 5,7 ms em 1920 px. Medição de CPU no Chromium headless sem inferência sobre FPS, GPU ou consumo de dispositivos físicos. Foram observadas 1.000, 2.400, 4.000 e 4.000 partículas nessas larguras. O DPR foi limitado a 1,5.

## Pendências e responsáveis

| Pendência | Responsável pelo aceite |
| --- | --- |
| Autorizar a publicação das oito fotografias e fornecer evidências e créditos comprovados | Cliente, com registro de Eduardo |
| Confirmar textos, retrato e canais de contato. Exercitar a busca real na Banlek e o Instagram autenticado | Cliente e Eduardo |
| Revisar coluna escura, logo, tipografia, espaçamento, equilíbrio editorial, motion e visual em aparelhos físicos | Luan e Eduardo |
| Avaliar LCP móvel, dados de campo, contraste e desempenho em equipamentos representativos | Eduardo e Luan |
| Aprovar domínio canônico, metadados sociais, ícone e completude de indexação | Eduardo e cliente |
| Registrar deploy real de rollback e confirmar automação do Pages antes do merge | Eduardo e operador do Cloudflare |

Os testes não reproduziram falha impeditiva de navegação nos ambientes cobertos. Permissões de uso e aprovações são impeditivos de publicação. Performance móvel e identidade visual incompletamente homologadas permanecem pendentes de decisão. [Procedimentos de deploy e rollback](deploy.md)

## Evidências

O PR contém o link do pacote gerado a partir da aplicação executada, incluindo Home completa em 390, 820 e 1440 px, recortes das seções, páginas, jornadas desktop e mobile, vídeo editorial, relatórios Playwright e Lighthouse, auditoria de dependências, registro de commit e logs técnicos. O pacote identifica separadamente o commit base do runtime e o commit do candidato documental. A CI final aparece nos checks do PR.

## Roteiro de aceitação do cliente

Preencher após a sessão de revisão, com **Aprovado**, **Reprovado** ou **Pendente de validação**. Registrar observação, responsável, data e evidência de decisão.

| Item | Como avaliar | Estado |
| --- | --- | --- |
| Identidade e logotipo | Conferir assinatura no header, transição e rodapé. | Pendente de validação |
| Fotografia principal | Conferir direitos, proporção, detalhe e legibilidade dos textos. | Pendente de validação |
| Experiência da Home | Percorrer cabeçalho, CTAs, seções e rodapé. | Pendente de validação |
| Transição editorial | Rolar devagar, rápido, voltar e repetir com movimento reduzido. | Pendente de validação |
| Galeria de coberturas | Abrir fotografias, alternar e conferir títulos e modais. | Pendente de validação |
| Busca na Banlek | Abrir o perfil e localizar uma fotografia de referência fornecida pelo cliente. | Pendente de validação |
| Conteúdo institucional | Conferir textos e identificação do retrato com o cliente. | Pendente de validação |
| Canais de contato | Conferir Instagram e destinos comerciais nas rotas. | Pendente de validação |
| Experiência mobile | Repetir menu, rolagem e galeria em um telefone real. | Pendente de validação |
| Aprovação geral | Registrar aceite e autorização específica para publicar. | Pendente de validação |
