# PR-008 — Transição cinematográfica com lente 3D

## Escopo
- Cena real em Three.js, carregada sob demanda quando a transição se aproxima da viewport.
- Corpo de lente com anéis metálicos, vidro e diafragma de seis lâminas.
- GSAP + ScrollTrigger sincronizam aproximação, giro, abertura e revelação com a rolagem nativa. O scrub permite avançar e reverter.
- A cena fica entre a faixa editorial da Home e a galeria existente; a galeria original é preservada.
- Fallback 2D sem WebGL em mobile, dispositivos com economia de dados/memória limitada e usuários com `prefers-reduced-motion`.
- Sem interceptação de `wheel`, loop contínuo de render ou bloqueio do scroll.

## Desempenho e ciclo de vida
- Three.js e GSAP são importados dinamicamente após IntersectionObserver detectar proximidade.
- Pixel ratio limitado a 1.5 e renderer configurado com `powerPreference: low-power`.
- Renderização sob demanda em atualização do ScrollTrigger e redimensionamento.
- Cleanup de IntersectionObserver, listener de resize, timeline/ScrollTrigger, geometrias, materiais e renderer no unmount.

## Validação
- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run test:content`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Desktop: vídeo de ida e volta com scroll, conferindo que não há scroll preso.
- [ ] Mobile: vídeo do fallback e navegação.
- [ ] DevTools: sem erros WebGL e sem listeners/observers duplicados.
- [ ] Conferir foco e conteúdo durante a entrada e saída da transição.

As evidências de navegador e vídeos precisam ser adicionadas após execução na prévia do Cloudflare Pages. Não foram simuladas nem declaradas como capturas reais nesta alteração.
