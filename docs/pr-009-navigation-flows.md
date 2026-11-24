# PR-009 — Navegação, links e fluxos ponta a ponta

## Objetivo
Adicionar uma verificação automatizada dos fluxos de navegação já existentes, sem recriar o menu, o rodapé, as páginas ou os CTAs aprovados nas entregas anteriores.

## Cobertura
- Exportação estática das rotas Home, Galeria, Sobre e Contato.
- Presença da navegação global e dos quatro destinos no cabeçalho e rodapé.
- Contrato acessível do menu responsivo e do link para pular ao conteúdo.
- CTAs da Home para Galeria e apresentação institucional.
- Caminhos Sobre → Contato e Contato → Home.
- Destinos oficiais Instagram e Banlek, com `target="_blank"`, `noopener` e `noreferrer`.
- Detecção de links internos que apontem para rotas fora do mapa conhecido.

## Estratégia
A aplicação usa exportação estática para Cloudflare Pages. Para não introduzir dependência de navegador ou alterar o runtime, os testes leem o HTML efetivamente exportado em `out/` após o build. Assim, validam os destinos e os atributos entregues ao usuário sem adicionar Playwright ou outro framework ao bundle.

## Execução
`npm run build` seguido de `npm run test:navigation`. A CI executa a nova suíte depois do build.

## Limites
- Não altera visual, navegação, rotas, conteúdo editorial ou destinos oficiais.
- Não faz requisições aos serviços externos; valida apenas os URLs configurados e os atributos dos links.
- Não substitui testes interativos reais de teclado, toque ou disponibilidade dos serviços externos. Os comportamentos interativos existentes permanecem cobertos pelas verificações manuais registradas na PR-007.
