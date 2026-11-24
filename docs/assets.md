# Acervo oficial do ELENCO

## Origem e inspeção

O ZIP `WhatsApp Unknown 2026-11-23 at 11.28.52.zip` foi fornecido pelo cliente em 23/11/2026. A inspeção visual individual encontrou oito fotografias e uma captura do Instagram. A captura repete o motocross da Hero e inclui interface do aplicativo. Ela fica registrada como referência, sem novo asset público.

Foram identificadas quatro fotografias de corrida, duas de motocross, uma de esporte na areia e um retrato institucional. A modalidade do esporte na areia permanece não confirmada. O material não comprova futebol, futsal nem o nome de eventos, datas ou locais. O retrato do fundador segue a identificação fornecida pelo cliente, sem inferência de nome.

## Inventário

Todos os créditos individuais estão pendentes. O fornecimento para desenvolvimento do site está confirmado pelo briefing. A autorização específica de publicação e os respectivos comprovantes não foram apresentados e ficam como `publication: "pendente"`. Isso documenta o estado conhecido, sem inferir autoria ou licença.

| Original | Otimizado | Modalidade | Caminho | Dimensões | Formato | Crédito | Autorização | Uso previsto |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WhatsApp Image 2026-11-23 at 11.28.32 (1).jpeg | corrida-atleta-bracos-erguidos.webp | corrida | public/images/corrida-atleta-bracos-erguidos.webp | 828 × 839 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.32 (2).jpeg | corrida-atleta-garrafa.webp | corrida | public/images/corrida-atleta-garrafa.webp | 677 × 977 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.32 (3).jpeg | corrida-atleta-rosa.webp | corrida | public/images/corrida-atleta-rosa.webp | 630 × 985 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.32.jpeg | corrida-atleta-azul.webp | corrida | public/images/corrida-atleta-azul.webp | 828 × 885 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.33 (1).jpeg | motocross-front.webp | motocross | public/images/motocross-front.webp | 692 × 993 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Hero e galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.33 (2).jpeg | esporte-areia-atleta-bola.webp | esporte-de-areia-nao-confirmado | public/images/esporte-areia-atleta-bola.webp | 702 × 1002 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.33 (3).jpeg | motocross-piloto-lateral.webp | motocross | public/images/motocross-piloto-lateral.webp | 702 × 970 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Galeria editorial |
| WhatsApp Image 2026-11-23 at 11.28.33 (4).jpeg | fundador-retrato.webp | Institucional | public/images/fundador-retrato.webp | 724 × 1052 | WebP | Pendente | Desenvolvimento fornecido, publicação pendente | Sobre (futuro) |
| WhatsApp Image 2026-11-23 at 11.28.33.jpeg | — | Referência de motocross | Fora do acervo público | 739 × 1600 | JPEG (captura) | Pendente | Desenvolvimento fornecido, publicação pendente | Referência documental |

As imagens editoriais podem ilustrar a futura página de coberturas, mas não representam coberturas ou álbuns específicos confirmados. A coleção `coverages` permanece vazia. O retrato não integra o acervo esportivo.

## Processamento e reparo

As oito fotografias foram convertidas com Pillow para WebP, qualidade 82 e método 6. As dimensões nativas foram mantidas porque os originais já são pequenos. A orientação EXIF foi aplicada antes da conversão. Não houve corte, ampliação, filtro estético ou modificação de pessoas e objetos. O total das oito imagens passou de 757.886 para 579.276 bytes (redução de 23,6%). Cada fotografia possui SHA-256 do original no manifesto para rastreabilidade. A captura tem SHA-256 `64559217bdb712e046b2cf70519ac0cb2aa3d8daaf083edc9aa44ef98fe758ab`.

O arquivo anterior `public/images/motocross-front.webp` declarava 280 × 402, mas falhava na decodificação com Sharp e Pillow. Foi regenerado a partir do mesmo original oficial, no mesmo caminho, agora em 692 × 993. A Home mantém seus componentes, classes, CTAs e composição.

O PNG horizontal anterior expunha metadados, mas falhava na decodificação completa com libpng. Foi recuperado das curvas vetoriais da página 5 de `APRESENTAÇÃO DE LOGO elenco.pdf`, removendo apenas o fundo da prancha. A assinatura e o subtítulo oficiais foram preservados, sem redesenho, em PNG transparente de 710 × 200 no caminho existente. A extração foi renderizada e inspecionada. O manual contém 12 páginas.

## Consumo no PR-006

```tsx
import Image from "next/image";
import { photographs, coverages } from "@/data/coverage";
import { officialLinks, externalLinkProps } from "@/lib/links";

// Renderize os registros editoriais e trate o estado vazio de coverages.
const editorialPhotos = photographs.filter((photo) => photo.kind === "editorial");
const photo = editorialPhotos[0];
// Com photo definido: <Image src={photo.src} alt={photo.alt}
//   width={photo.width} height={photo.height} sizes="(max-width: 768px) 100vw, 50vw" />
// Para uma nova aba: <a href={officialLinks.archive} {...externalLinkProps}>Acervo</a>
```

O tipo `Photograph` fica em `src/types/content.ts`. `PhotoId` deriva dos IDs reais, `heroPhoto` centraliza o consumo da Hero e `Coverage` exige álbum com evidência quando a disponibilidade é `disponivel`. Coberturas pendentes possuem `album: null`. Capa ausente usa `coverPhotoId: null`, fotografias ausentes usam `photoIds: []` e descrição desconhecida usa `null`. As referências de fotografias são validadas pelos testes.

Os links em `officialLinks` são os destinos fornecidos no briefing. Instagram e Banlek não foram consultados remotamente neste PR. A validação de URLs é sintática. O perfil Banlek não é um álbum de evento.

## Validação

Execute `npm run test:content`. O Node.js 24 executa o teste nativo com remoção de tipos e o Sharp faz decodificação integral dos arquivos. A CI inclui esse comando. `npm run typecheck` verifica os contratos do manifesto.

A exportação estática do Cloudflare permanece configurada em `next.config.ts`. Nenhuma imagem depende de otimização em tempo de execução. As rotas atuais são preservadas.

## Pendências

- Confirmar a modalidade da fotografia na areia.
- Confirmar créditos individuais e autorização específica de publicação.
- Receber links e informações comprovadas de eventos para cadastrar coberturas reais.
- Obter originais em resolução maior para telas amplas, se disponíveis. Nenhuma imagem foi ampliada artificialmente.
