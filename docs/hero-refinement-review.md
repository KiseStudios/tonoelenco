# Refinamento da Hero do ELENCO

As capturas comparam a `main` em `95d9741` com a branch `feat/hero-refinement`, ambas exportadas para `out` e abertas no Chromium nos mesmos tamanhos de janela.

| Janela | Antes | Depois |
| --- | --- | --- |
| 390 × 844 | [Captura](evidence/hero-refinement/before-390.jpg) | [Captura](evidence/hero-refinement/after-390.jpg) |
| 820 × 1024 | [Captura](evidence/hero-refinement/before-820.jpg) | [Captura](evidence/hero-refinement/after-820.jpg) |
| 1440 × 900 | [Captura](evidence/hero-refinement/before-1440.jpg) | [Captura](evidence/hero-refinement/after-1440.jpg) |
| 1920 × 1080 | [Captura](evidence/hero-refinement/before-1920.jpg) | [Captura](evidence/hero-refinement/after-1920.jpg) |

Em desktop, o terreno da própria foto preenche o fundo e a imagem do piloto se integra a ele por degradê. O enquadramento principal limita a largura a 736 px CSS. Em mobile, o piloto fica acima do texto, com o degradê escurecendo a área dos botões. As quatro janelas exibiram o título e os dois CTAs por inteiro, sem overflow horizontal.

## Fotografia e carregamento

O JPEG oficial progressivo tem 692 × 993 px e 141.892 bytes. O hash permanece igual ao do manifesto. O WebP do acervo tem as mesmas dimensões e 116.710 bytes. A Hero serve o JPEG no desktop para evitar nova compressão na ampliação. Em telas estreitas, o navegador pode escolher um WebP de 480 × 689 px e 85.532 bytes, derivado do JPEG com qualidade 86 e sem sharpening. A 390 px, o teste em DPR 1 selecionou o WebP, com redução de cerca de 40% em bytes. Em DPR 2, selecionou o original. As quatro janelas em DPR 1 fizeram uma única requisição pela fotografia da Hero.

Em uma rodada de medição local, a resposta da fotografia terminou entre 16 e 37 ms após o início da navegação no refinamento e entre 18 e 28 ms na versão anterior. A medição foi feita em localhost e não estima o desempenho em produção ou em rede móvel. Na verificação inicial a 390 px em DPR 2 e a 1440 px com movimento reduzido, o Chromium não registrou layout shift.

A resolução disponível limita a nitidez em telas grandes ou de alta densidade. Para aumentar o detalhe real, é necessário o arquivo original da mesma fotografia em resolução maior, preferencialmente anterior ao envio por WhatsApp.

## Transição e galeria

A faixa Modalidade, Olhar e Registro foi removida. A transição começa onde termina a Hero. No desktop, o poster e a cena ocupam a mesma altura. O carregamento da cena passa a ocorrer quando a seção entra na janela. A animação continua ligada ao início da própria seção com o mesmo percurso de 1.450 px. No Chromium com WebGL via SwiftShader, a câmera permaneceu fixada durante a aproximação, retornou ao início ao rolar para trás e liberou a página para a galeria. Em 390 px e com movimento reduzido, o poster permaneceu estático, sem pinning, e foi possível avançar até a galeria e voltar à Hero. A renderização por software confirma o fluxo e não mede FPS em uma GPU física.

[Início da câmera](evidence/hero-refinement/camera-start-1440.jpg) · [Aproximação](evidence/hero-refinement/camera-progress-1440.jpg) · [Galeria](evidence/hero-refinement/gallery-1440.jpg) · [Fallback mobile](evidence/hero-refinement/camera-fallback-390.jpg)

O botão “Descubra o ELENCO” leva diretamente à seção institucional. Esse salto evita que a inicialização do ScrollTrigger interrompa a navegação ao carregar a cena durante a rolagem.

## Testes

| Comando | Resultado |
| --- | --- |
| `npm ci` | Aprovado |
| `npm run lint` | Aprovado |
| `npm run test:content` | 8 aprovados |
| `npm run typecheck` | Aprovado |
| `npm run build` | Aprovado |
| `npm run test:navigation` | 7 aprovados |

O build exportou a Home, Galeria, Sobre e Contato para `out`.
