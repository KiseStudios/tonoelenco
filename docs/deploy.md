# ELENCO — Publicação e rollback

## Configuração verificada no repositório

| Item | Configuração |
| --- | --- |
| Repositório | `KiseStudios/tonoelenco` |
| Branch de produção prevista | `main` |
| Endereço hoje em uso | [tonoelenco.pages.dev](https://tonoelenco.pages.dev/) |
| Raiz do projeto | Raiz do repositório |
| Node.js | 24, conforme `.nvmrc` |
| Instalação reproduzível | `npm ci` |
| Preset | Next.js (Static HTML Export) |
| Build | `npm run build` |
| Saída | `out/` |
| Variáveis | Nenhuma variável da aplicação é exigida pelo build verificado. No painel, conferir se a versão do Node coincide com a do projeto e preservar configurações de plataforma existentes. |

O export estático do Next.js serve as imagens de `public/` sem otimização por servidor. `npm start` não serve esse formato. Para testar localmente, use `node tests/e2e/static-server.mjs` após gerar `out/`.

A Home pública consultada em 25/11/2026 referenciava o mesmo conjunto de dez arquivos JS/CSS versionados por conteúdo que o build local de `d74baa42a8df9cf2e0163ba52e6aef6dd7b77d86`, e continha a marcação da transição editorial. Isso identifica uma saída compatível com a base, sem comprovar o ID do deploy ou a configuração atual do painel. A integração Git do Pages publica automaticamente por push na branch configurada quando builds automáticos estão ativos. Como a documentação do projeto aponta `main` para produção, trate o merge como ato de publicação até conferir **Settings → Builds & deployments**. [Integração Git do Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/git-integration/)

## Candidato e autorização

A base técnica homologada neste PR é `d74baa42a8df9cf2e0163ba52e6aef6dd7b77d86`. O candidato é o commit de revisão mais recente da branch `release/pr-014-homologacao-final` indicado no PR e no pacote de evidências. O runtime, assets, lockfile e workflows são os mesmos da base. O commit efetivamente publicado será o commit registrado na implantação de produção, normalmente o merge aprovado na `main`.

1. Luan faz a revisão cruzada. Eduardo registra o aceite técnico e visual que lhe cabe. O cliente registra o aceite de conteúdo e de publicação, incluindo permissões das fotografias. Os itens obrigatórios estão em [release-checklist.md](release-checklist.md).
2. No painel Pages, anote o ID, URL, commit e data do último deploy de produção funcional antes de autorizar o merge. Confirme a branch de produção, builds automáticos, versão do Node e diretório de saída.
3. Com CI verde e autorização explícita, a pessoa responsável faz o merge. Se a integração Git estiver ativa, acompanhe o deploy de produção e confira o SHA registrado pelo Pages antes da homologação. Se a automação estiver desativada, siga o procedimento já configurado no projeto Pages com o mesmo commit autorizado.
4. Após a publicação, confirme HTTP 200 e carregamento direto de `/`, `/galeria`, `/sobre` e `/contato`. Confirme 404 para caminho desconhecido. Em janela limpa, percorra Hero, transição, galeria e lightbox, confira o menu touch, links externos e console. Compare as capturas com o candidato e registre URL, SHA, resultado e hora.

## Rollback

A referência técnica de retorno é `d74baa42a8df9cf2e0163ba52e6aef6dd7b77d86`, cuja saída confere com os recursos observados no site em uso e cujo export foi testado localmente. Antes de publicar, registre o ID real do deploy estável de produção no painel. Guarde essa informação no registro de entrega.

Se a publicação gerar regressão bloqueante, Eduardo coordena a decisão e o operador autorizado abre **Workers & Pages → ELENCO → Deployments**. No deploy anterior de produção aprovado, escolha **Rollback to this deployment**. Confirme o domínio ativo e repita as verificações pós-publicação. Se o ID não estiver disponível, confirme com o responsável pelo Pages qual deploy de produção corresponde à versão estável registrada. Preview não serve de alvo de rollback. O rollback opera na implantação e preserva o histórico Git. [Rollback do Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)

## Manutenção

Mantenha mudanças em PRs com CI, revise periodicamente o manifesto de ativos e os destinos da Banlek e Instagram, e confira o build antes de alterar o Node ou a configuração Pages. A cada publicação, registre o commit, o resultado da validação e o deploy anterior. Para mudanças na galeria, guarde as autorizações, os créditos e as URLs verificadas dos álbuns.
