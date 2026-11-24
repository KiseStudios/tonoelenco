# PR 03 — Shell global e navegação funcional

## Objetivo
Adicionar a estrutura compartilhada de navegação ao redor das páginas, sem reimplementar os componentes de identidade criados na PR 02.

## Entregas
- Cabeçalho global com wordmark tipográfico provisório e navegação para Home e Galeria.
- Menu mobile expansível, com estado acessível e fechamento após selecionar um destino.
- Indicação visual e semântica da rota atual.
- Rodapé global.
- Link para pular diretamente ao conteúdo, foco visível e suporte a preferência por movimento reduzido.
- Rota inicial de Galeria como espaço reservado, sem inventar conteúdo fotográfico ou duplicar a Home.

## Integração com a PR 02
Esta PR parte da branch `feat/pr-002-design-foundation` e deve ser revisada/mesclada depois da PR 02. Reutiliza `Container` e `Eyebrow`; não copia nem recria os componentes da fundação visual.

O wordmark textual é provisório. Não substitui os SVGs oficiais pendentes da PR 02.

## Escopo preservado
A página Home existente não foi reescrita. O shell foi integrado pelo layout global e os estilos novos foram acrescentados ao CSS compartilhado.

## Checklist de revisão
- [ ] Conferir navegação Home/Galeria em desktop.
- [ ] Conferir abertura, fechamento e seleção no menu mobile.
- [ ] Conferir foco por teclado, link “Pular para o conteúdo” e estado ativo.
- [ ] Validar em larguras mobile, tablet e desktop.
- [ ] Executar lint, typecheck e build no ambiente do projeto.

**Draft para revisão. Não mesclar antes da aprovação da PR 02 e desta PR.**
