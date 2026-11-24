# PR 02 — Design Foundation e Ativos Oficiais

## Objetivo
Traduzir o manual visual da ELENCO Fotografia Esportiva em tokens, componentes reutilizáveis e diretrizes para as próximas interfaces.

## Fonte visual consultada
Manual **APRESENTAÇÃO DE LOGO elenco.pdf**:
- Página 4: assinatura principal empilhada.
- Página 5: assinatura horizontal.
- Página 6: sub-marca / símbolo E.
- Página 7: versões monocromáticas e negativas.

O manual descreve unidade entre formas pontiagudas e arredondadas, linhas inclinadas, cortes e formas angulares para comunicar movimento e velocidade. Também descreve a tipografia como robusta e de fácil leitura.

Os mockups são referências de aplicação. Não devem ser tratados como banco de fotografias nem como arquivos-fonte dos logotipos.

## Ativos oficiais
Os SVGs originais não estavam entre os arquivos disponíveis. Os componentes definem os caminhos esperados, mas os arquivos precisam ser fornecidos antes de considerar este requisito concluído.

| Variante | Fundo claro | Fundo escuro |
| --- | --- | --- |
| Principal empilhado | `/brand/logo-primary-black.svg` | `/brand/logo-primary-white.svg` |
| Horizontal | `/brand/logo-horizontal-black.svg` | `/brand/logo-horizontal-white.svg` |
| Símbolo E | `/brand/symbol-e-black.svg` | `/brand/symbol-e-white.svg` |

Não redesenhar, esticar, reconstruir por texto ou alterar proporções. Usar os arquivos vetoriais originais e preservar a proporção intrínseca.

## Tokens
### Cores
Base oficial estritamente monocromática: `#000000` e `#FFFFFF`. Cores auxiliares não foram introduzidas; qualquer expansão depende de aprovação.

### Espaçamento
Escala baseada em unidade de 4 px: 4, 8, 12, 16, 24, 32, 48, 64 e 96 px.

### Tipografia
Escala de 12 px a display fluido. O manual determina uma tipografia robusta, mas o nome da família e os arquivos da fonte não estavam disponíveis. Arial/Helvetica é somente fallback técnico, não declaração de fonte oficial.

### Grid
Grid fluido com 4 colunas em telas pequenas, 8 em telas médias e 12 em telas amplas. Viewports de aceite: 390 px, 820 px e 1440 px.

## Linguagem gráfica
- Usar cortes inclinados e formas angulares em elementos editoriais de apoio.
- Priorizar hierarquia tipográfica robusta e legível.
- Não aplicar clip-path, skew, filtros ou máscaras sobre os arquivos de logotipo.
- Não criar assinaturas alternativas nem redesenhar o símbolo.

## Componentes
- `BrandLogo`: escolhe variante e contraste; aceita `src` explícito para SVG oficial.
- `Eyebrow`: rótulo editorial compacto em caixa alta.
- `Container`: largura de conteúdo, ampla ou total.
- Tokens compartilhados em `src/styles/tokens.css`.

## Relação com referências do preview
- **Home:** hierarquia editorial e assinatura de marca.
- **Galeria:** Container e grid para estruturar imagens sem competir com elas.
- **Mobile:** margens e colunas responsivas para preservar leitura em telas estreitas.

Os previews específicos não estavam no repositório consultado. Esta relação registra o direcionamento sem afirmar que os layouts foram reproduzidos.

## Pendências para aceite
- [ ] Receber os SVGs originais das três assinaturas, em preto e branco/negativo.
- [ ] Confirmar família tipográfica oficial e incluir fonte licenciada.
- [ ] Conectar ou validar os previews de Home, Galeria e Mobile.
- [ ] Conferir visualmente 390 px, 820 px e 1440 px em navegador.
- [ ] Registrar capturas desktop e mobile após ativos oficiais serem adicionados.
- [ ] Comparar SVGs recebidos com páginas 4–7 do manual.
