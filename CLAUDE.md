# Arsenal Homem Blindado: página de vendas

Página de vendas do Arsenal Homem Blindado, de Marcello Gomes: quatro manuais digitais em PDF (o central, Arsenal Homem Blindado, mais Manual Secreto da Traição para Homens, Nunca se Iluda com as Mulheres e A Força da Honra) para o homem perceber a manipulação logo no começo, colocar limite sem pedir desculpa e nunca mais ser o último a saber. Marcello é criador com 419 mil seguidores no Instagram e fala sobre posicionamento masculino, traição, manipulação e respeito próprio.

Domínio: `https://arsenal-homem-blindado.com.br/`. A página substitui o WordPress que está hoje no domínio.

A base é o código da página De Desprezado a Respeitado (repositório irmão `../Arsenal Homem Moderno`, no ar em `nunca-mais-seja-desprezado.com.br` e aprovada pelo cliente). Estrutura, sistema de rotas, rastreio, performance e hospedagem são os mesmos; mudam a copy, as imagens e as cores. Quando uma decisão técnica não estiver escrita aqui, a referência é o código e o `CLAUDE.md` de lá.

Público: homens adultos, a maioria chegando pelo celular, vindos do Instagram dele ou de anúncios da Meta. Produto sério, para homens sérios. A página precisa parecer cara, sóbria e feita por estúdio. Se parecer template, página gerada por IA ou "app de academia", falhou.

Objetivo único: levar ao checkout da Eduzz.

## Arquivos de referência (leia antes de qualquer tarefa)

| Arquivo | Manda em quê |
| --- | --- |
| `PROGRESSO.md` | O que já foi feito e aprovado. Leia primeiro em toda sessão nova. |
| `docs/copy.md` | Todo o texto da página, aprovado pelo cliente. Use palavra por palavra. Não reescreva, não resuma, não "melhore". |
| `docs/PROMPT-INICIAL.md` | As etapas de construção, em ordem, e a regra de parada entre elas. |
| `PENDENCIAS.md` | Dados que ainda faltam do cliente e bloqueadores para publicar. |
| `_entrada/` | Insumos recebidos (capas planas dos manuais e fundos do hero), fora do git. Os originais em uso vão para `assets/img/`. |

Se algo não estiver coberto pela copy nem por este arquivo, pergunte antes de inventar.

## Regras de trabalho

- O trabalho segue as etapas de `docs/PROMPT-INICIAL.md`, uma por vez. Cada etapa termina com relatório e parada: espere a palavra APROVADO antes de commitar e dar push.
- A cada APROVADO, nesta ordem: atualize o `PROGRESSO.md` com a etapa e as decisões aprovadas, faça commit e push, e só então comece a etapa seguinte.
- Nunca usar travessão (o traço longo, U+2014) em nenhum texto: na página, nos comentários do código e na documentação.
- Não altere uma seção já aprovada sem pedido explícito.
- Trechos entre colchetes na copy são pendências: renderize com a classe `.pendente` (contorno tracejado âmbar) e liste em `PENDENCIAS.md`. Nada com essa classe vai ao ar.
- Nunca inventar depoimento, número, prazo, conteúdo de manual ou prova social. O que não estiver na copy não existe.
- A página é conferida com o Live Server do VS Code (localhost), aberto na raiz do projeto. Ao final de cada seção, confira no celular (390 px) e no desktop (1440 px).

## Entrega técnica

- Site estático. Na raiz, o `index.html` (a página de vendas) e a `404.html` (a página de erro), cada um com CSS e JS inline. Única exceção: o Lenis, em `assets/js/lenis.min.js`, baixado depois do load. Sem framework, sem build obrigatório, sem jQuery.
- Não há página de links: a raiz do domínio responde 404.
- Todo arquivo do projeto (imagens, fontes, favicons, preload, srcset, `url()` do CSS) é pedido a partir da raiz (`/assets/...`, `/favicon.svg`): a mesma página abre em `/bio/`, `/sdr/` e nas outras rotas, e um caminho relativo viraria `/bio/assets/...`. Links de âncora (`#oferta`) continuam como estão.
- Originais em `assets/img/`: `hero-arsenal-desktop.png` e `hero-arsenal-mobile.png`, as capas planas `capa-arsenal.png`, `capa-traicao.png`, `capa-iluda.png` e `capa-honra.png` (1024x1536, copiadas de `_entrada/`), `autor.png` (a foto do Desprezado, com o fundo azul, de onde sai a `autor-vinho.png`), `oferta-mesa.png` (a original azul, de onde sai a `oferta-mesa-vinho.png`), `grain.png` e os prints em `prints/`.
- Imagens otimizadas em `assets/img/opt/`, em AVIF e WebP com fallback JPG, servidas por `<picture>` com `srcset` e `sizes`, geradas pelo `scripts/otimizar-imagens.mjs` (`npm install --prefix scripts` uma vez; `node scripts/otimizar-imagens.mjs` gera só o que mudou, `--tudo` refaz). Toda `<img>` com `width` e `height`. Fora o hero, as imagens ficam limitadas a 2x no celular (até 760 px de tela, o `sizes` encolhe com densidade alta: x0,8 a partir de 2,4 dppx e x2/3 a partir de 2,9 dppx). O hero vai até 3x. As capas dos manuais precisam sair com os títulos nítidos.
- Fonte: Geist hospedada localmente (`assets/fonts/geist-latin.woff2`, variável, subset latino, licença OFL ao lado), com `preload` e `font-display: swap`. Nenhuma outra família.
- Mobile-first de verdade. Testar em 390 px antes de qualquer outra largura.
- Funcionar sem JavaScript: todo o conteúdo aparece. O JS só melhora (checklist, barra fixa, galeria, rolagem suave, checkout por rota).
- Assinatura do Studio Alto Nível (`https://cdn.studioaltonivel.com/footer.js`, com `defer`), que insere o rodapé "Desenvolvido por" no fim do `<body>`. Carrega com a página (adiada, a nota do celular caía). Único ajuste da página sobre ela: o fundo (`html body #san-footer-badge`).
- Scripts locais em `scripts/` (nada ali vai para a hospedagem): `imagens`, `og` (imagem de compartilhamento), `favicons` e `lenis` (`npm run <nome> --prefix scripts`).

## Hospedagem

- Final: a Hostinger do cliente (LiteSpeed compatível com Apache), com deploy pelo Git a partir deste repositório, na raiz do domínio. Configuração no `.htaccess` da raiz: rotas (reescrita interna), http para https e www para sem www (301), bloqueio dos arquivos internos (`docs/`, `scripts/`, `node_modules/`, `.git`, qualquer `.md`, README, `package*.json`, `_redirects`, `_headers` e os `.htaccess`), compressão, tipos (avif, webp, woff2), `no-cache` no HTML, a página de erro `404.html` (status 404).
- Cache de 1 ano (immutable) de `assets/` no `assets/.htaccess`. Os nomes não têm versão: para trocar um arquivo de `assets/`, use um nome novo.
- Prévia: Netlify, com deploy automático a cada push na main. `_redirects` (rotas e o bloqueio dos arquivos internos, em 404 forçado antes de tudo; a Netlify não aceita `*.md`, então cada `.md` da raiz entra pelo nome) e `_headers` (o mesmo cache). Mudou uma rota, um bloqueio ou um cache num, mude no outro. O Live Server não lê nenhum dos dois.
- Para conferir as rotas como na Hostinger: `node scripts/servidor-local.mjs` (porta 5600) imita o `.htaccess`: raiz e `/index.html` em 404 com a `404.html`, as cinco rotas servindo o `index.html`, arquivos internos em 404, cache e compressão brotli. Mudou o `.htaccess`, mude o servidor também.

## Rotas, checkout e rastreio

- Só as cinco rotas vendem: `/bio/`, `/sdr/`, `/tfg/`, `/story/` e `/cht/`, todas servindo o `index.html` por reescrita interna (com e sem barra, em qualquer caixa, status 200, o endereço na barra não muda). Nunca copie o `index.html` para pastas.
- A raiz `/` e o pedido direto de `/index.html` respondem 404 com a `404.html` (no `.htaccess`, o `/index.html` pelo `%{THE_REQUEST}`, que não muda nas reescritas internas; no `_redirects`, com `404!` antes das rotas). Qualquer outro endereço inexistente também.
- A `404.html` é simples: fundo da página, o escudo, "Esta página não está disponível." e um link discreto para o Instagram do Marcello; sem botão de compra, sem rastreio, `noindex`, caminhos a partir da raiz.
- `canonical` e `og:url` das cinco rotas: `https://arsenal-homem-blindado.com.br/bio/`.
- Checkouts: no topo do script do checkout (fim do `index.html`), o objeto `CHECKOUTS` (`padrao`, `bio`, `sdr`, `tfg`, `story`, `cht`). O script lê o primeiro segmento do caminho e põe o checkout da rota em todos os botões de compra, inclusive o da barra fixa; fora das rotas, usa o `padrao`. Sem JS, os botões levam ao href do HTML, que é o `padrao`. Rota nova: no `CHECKOUTS`, no `.htaccess`, no `_redirects` e no `_headers` (com e sem barra).
- Todo botão de compra é um `<a data-checkout>`. Enquanto o link da rota no `CHECKOUTS` for o `PENDENTE` (qualquer valor que não comece com `https://`), o JS cancela o clique (o botão não leva a lugar nenhum) e o console avisa em localhost; no HTML, os href são `#checkout-pendente`. Isso bloqueia a publicação (ver `PENDENCIAS.md`). Quando os links chegarem: os seis valores do `CHECKOUTS` (o `padrao` com o da bio) e os href dos botões no HTML pelo link do `padrao`.
- Teste das rotas no localhost: o Live Server não lê o `.htaccess` nem o `_redirects`. Só em `localhost` e `127.0.0.1`, `?origem=bio` (`sdr`, `tfg`, `story`, `cht`) simula a rota; em produção, o parâmetro é ignorado.
- Repasse de parâmetros: um script curto leva para o link do checkout todos os parâmetros que chegaram na URL (`utm_*`, `src`, `sck`, `fbclid` e o que mais vier). Só `rastreio` e `origem` (chaves de teste do localhost) não vão.
- Botões de compra abrem o checkout em nova guia (`target="_blank"`, `rel="noopener"`, sem `noreferrer`). No toque (`pointer: coarse`), o JS os deixa na mesma guia, por causa do navegador interno do Instagram.
- Rastreio: Google Tag Manager no `<head>` (com o `<noscript>` logo após o `<body>`) e Pixel da Meta só com PageView, os dois desligados em localhost (`?rastreio=1` liga para teste). Os IDs ficam em `GTM_ID` e `PIXEL_ID`, no primeiro script do `<head>`, e nos dois `<noscript>`; enquanto tiverem "PENDENTE", nada carrega. São placeholders até o cliente confirmar se o Arsenal usa o mesmo GTM e o mesmo Pixel do Desprezado (ver `PENDENCIAS.md`). Nunca use os IDs do Desprezado sem essa confirmação.
- `InitiateCheckout`: o checkout da Eduzz dispara sozinho ao abrir. A página não dispara esse evento, e o clique de compra não tem evento do pixel.
- Preço: de R$ 297 por R$ 97 à vista, ou 12x de R$ 10,03. Garantia de 7 dias.

## Design

Mesma estrutura e o mesmo sistema visual da identidade oficial do Desprezado (antes `.tema-vibrante`): Geist, CTAs grandes em maiúsculas, anéis, círculo da seta, cards de vidro, grão. Troca o azul pela paleta do Arsenal, que vem das capas dos manuais.

### Cores

| Uso | Valor |
| --- | --- |
| Fundo base | `#0A0204` (quase preto com tom vinho) |
| Áreas de destaque | `#38000E` |
| Cor principal | carmim `#BB003D` |
| Círculo da seta e anéis | degradê `#E0185A` para `#7A0026` |
| Destaques de texto (o trecho em negrito de cada título, preços) | degradê carmim para dourado, `#E0185A` para `#F2B33D`, como nos títulos das capas |
| Detalhes finos (filetes, ícone do escudo) | dourado `#D9B26A`, sem exagero |

Nenhum neon, roxo, nem o azul do Desprezado. Contraste AA (4,5:1) em todo texto.

### Tipografia

- Geist em tudo. H1 inteiro em 700; títulos de seção em 600 com o destaque em 700 (na copy, o trecho em negrito), no degradê carmim para dourado.
- Títulos com `letter-spacing: -0.02em` e `text-wrap: balance`. Corpo entre 16 e 18 px, `line-height` 1.6 a 1.7, linha com no máximo uns 60 caracteres.
- Botões em maiúsculas por CSS (`text-transform: uppercase`, `letter-spacing: .04em`, peso 600); no HTML, o texto fica em caixa normal. Só os botões.

### Superfícies e efeitos

- Vidro: degradê escuro translúcido + `backdrop-filter: blur(16 a 20px)` + borda de 1 px + brilho interno no topo. Só onde há imagem ou luz atrás.
- Grão sutil por cima da página inteira (`assets/img/grain.png` / `opt/grain.webp`, `mix-blend-mode: overlay`), carregado com a página.
- Luz: cada seção tem um ponto de luz difusa, nunca fundo chapado.
- Botão principal: pílula marfim metálica com texto escuro (o prateado do Desprezado, aquecido para a paleta), dentro de um anel de vidro com borda e brilho carmim, e a seta branca num círculo em degradê `#E0185A` para `#7A0026`. Reflexo que atravessa o botão (desligado com `prefers-reduced-motion`), hover e `:active` como no Desprezado.
- Botão grande (`.cta--grande`) em todos os botões de compra; a barra fixa usa o botão compacto.
- Destaques de texto (`.dest`): degradê horizontal carmim para dourado, repetido em cada linha (`box-decoration-break: clone`). O começo carmim tem 3,4:1 sobre o fundo: só em texto grande (títulos e preço). Texto pequeno de cor usa tons claros (o nome do manual nos cards das #brechas em `#E6C990`).
- Ícone da marca: o escudo (SVG), em dourado (`#escudo-ouro`). Usado em rótulos, listas, checklist (marcado: escudo dourado com o check escuro), selo de garantia, emenda das #brechas e fechamento. O favicon é o mesmo escudo em carmim.

### Regras que não se negociam

- Nenhuma divisão seca entre seções: sempre há degradê, luz que atravessa, imagem que começa antes ou elemento sobre a emenda. No desktop, no máximo uns 200 px de vazio entre seções.
- O fundo do hero é a arte com os quatro livros: os livros nunca são cortados nas laterais, e o texto nunca cobre as capas. As versões celular e desktop mostram a mesma cena (celular: livros em cima e fundo escuro embaixo; desktop: livros à direita e lado esquerdo escuro).
- Rótulo de seção é texto em caixa normal com o pequeno escudo. Nunca caixa alta com letras espaçadas, exceto a pill do hero.
- Nunca colocar hover em elemento que não é clicável.
- Nunca usar: fonte condensada, Inter, Roboto, emoji, cards idênticos com ícone, animação de entrada fora do Sistema de movimento, gradiente roxo, cantos e sombras iguais em tudo.

### Hero

Mesmo esquema do hero de livros do Desprezado: art direction com `<picture>` (`hero-arsenal-mobile` até 1023 px, `hero-arsenal-desktop` a partir de 1024 px), preload do LCP para as duas com as mesmas faixas, `fetchpriority="high"`.

- Na arte do celular (1882x3344), os livros vão de 4,7% a 97,2% da largura e de 19,4% a 47,6% da altura: o espaçador do texto usa `.8458 * --fundo-cel-w` (0,476 x 1,7768). Na do desktop (3344x1882), de 49,7% a 96,4% da largura e de 28% a 74% da altura (centro em 51%). Com outra arte, meça de novo e troque essas frações no CSS.
- Celular e tablet: a imagem na largura da tela, presa no topo, e o texto centrado começando logo abaixo da base dos livros. Celulares baixos (até 700 px de altura): imagem com 88% da largura (78% até 660 px) e 10 px entre os blocos; em 360x640, o botão aparece inteiro na primeira tela.
- Desktop: a imagem presa na borda direita e ampliada até a borda esquerda dos livros ficar 64 px depois do fim da subheadline, limitada pela altura do hero (livros inteiros, com 80 px de folga em cima e embaixo). O H1 fica no máximo 20 px mais largo que a subheadline, para nunca encostar nos livros.

### Botões com o rótulo longo

"Quero me tornar um Homem Blindado" (hero, oferta e fechamento) leva `.cta--longo` e `.cta-ring--longo`: no celular, anel de 3 px, folgas menores, `.02em` e a fonte de 13 px em 375 px a ~15,3 px em 430 px, para o anel ficar a pelo menos 12 px das bordas da tela (medido: 14, 17 e 16 px). No tablet, o da oferta fica com 16 px (o bloco de preço tem ~496 px por dentro). A partir de 1280 px, o painel da oferta dá 7 das 12 colunas ao bloco de preço. O bloco de compra do fechamento tem 640 px no desktop. Rótulo novo mais longo: meça de novo (nenhum botão pode passar do bloco nem ficar a menos de 12 px da tela).

## Ordem das seções (com os ids)

1. `#hero`: rótulo (pill com o escudo), H1, subheadline, botão grande e dois cards de vidro (419 mil seguidores, +12 mil homens).
2. `#identificacao`: checklist interativo de 5 itens com contador, o texto que aparece a partir do primeiro item marcado e o destaque final.
3. `#brechas`: cada card tem a brecha (título), o manual que a fecha (com o escudo dourado) e o que ele resolve, com a capa do manual (`capa-*`). O do Arsenal Homem Blindado em destaque: no celular, o mesmo formato horizontal dos outros (capa ao lado do texto), com a capa 20% maior (110 px, contra 92) e o destaque só na borda e no brilho carmim; no tablet, na largura da coluna com a capa ao lado; a partir de 1024 px, na largura toda no topo, e os outros três lado a lado embaixo. Frase de fechamento, botão e, na emenda com a `#oferta`, o escudo que se enche de dourado com a rolagem (no desktop, a foto do palco começa por trás do fim da seção).
4. `#oferta`: o palco com a mesa vinho (`oferta-mesa-vinho`, a foto da mesa do Desprezado com a parede azul levada para o vinho pelo `scripts/otimizar-imagens.mjs`) e os quatro manuais em pé na ordem da arte do hero (Traição, Iluda, Arsenal, Honra), o Arsenal maior e na frente, os outros girados para dentro; no celular, lado a lado e sem sobreposição (sobrepostos, os títulos eram cortados). Painel com a lista dos quatro manuais (número no círculo) e o bloco de preço (frase, "De R$ 297 por" riscado, "12x de", "R$ 10,03" grande, "ou R$ 97 à vista", botão e nota).
5. `#autor`: o card do Marcello (a mesma foto do Desprezado, `autor-vinho`: só o fundo azul do estúdio levado para o vinho pelo `scripts/otimizar-imagens.mjs`, com a pele e a roupa protegidas; o blazer também é azul, por isso a máscara e os polígonos medidos em `gerarAutorVinho`) e a prova social "Direto da DM" com subtítulo e apoio: 6 dos 8 prints tratados no Desprezado, os que mais falam de traição, separação, decisão e postura, nesta ordem: 04, 03, 06, 01, 02 e 08. O carrossel do desktop mede 6 x 360 = 2160 px por volta, em 54 s (o JS conta os cards sozinho; no CSS, ajuste os 2160px e os 54s se mudar a quantidade). Botão no fim.
6. `#faq`: a garantia (`id="garantia"`) e as perguntas.
7. `#fechamento`: título grande, texto, bloco de compra; depois, o rodapé.
8. Barra fixa no celular.

## Interações

- Checklist: botões reais com `aria-pressed`, contador ("N de 5 situações marcadas") em `aria-live="polite"`. O texto abaixo da lista aparece a partir do primeiro item marcado e some com 0; sem JS, fica visível. No celular, o contador é uma barra compacta de vidro, sticky no pé da tela enquanto a lista está visível.
- FAQ: `<details>` e `<summary>` nativos, o primeiro aberto.
- Barra fixa do celular: aparece depois que o hero sai da tela e some sobre a lista da #identificacao, o painel de preço da #oferta, o botão do #fechamento e o rodapé (`IntersectionObserver`). Respeitar `env(safe-area-inset-bottom)`.
- Prints da DM: cada card mostra o print inteiro, sem corte e sem mudar as cores (só `brightness(.94)`). Celular: fileira horizontal com `scroll-snap`. A partir de 761 px: carrossel de borda a borda em loop (só `transform`), setas embaixo, pausa no hover, no foco, fora da tela e com a galeria aberta. Com `prefers-reduced-motion`, rolagem horizontal sem animação.
- Galeria dos prints (`<dialog>`): abre no print clicado, navega por botões, setas do teclado e deslize; contador em `aria-live`; o foco volta ao card ao fechar.

## Sistema de movimento

O mesmo do Desprezado (os valores estão no bloco "Sistema de movimento" do `<style>`).

- Lenis local (`assets/js/lenis.min.js`), baixado só depois do load e só com mouse ou trackpad, sem movimento reduzido. No toque, rolagem nativa. Links internos rolam pelo Lenis e descontam `--topo-fixo`. Com um `<dialog>` aberto, o Lenis para.
- Revelação (`.reveal`): amarrada à rolagem (`animation-timeline: view()`), nunca a tempo. Entra com desfoque, opacidade e deslocamento; sai discreta ao passar pelo topo. `.rv-leve` (sem desfoque) em imagens, cards grandes e blocos com mais de ~400 px. `.reveal-saida` (só saída) no hero, que é o LCP.
- Tudo dentro de `@supports (animation-timeline: view())` e `prefers-reduced-motion: no-preference`.
- Nunca aplicar: num elemento que contém vidro, no elemento sticky, dentro de `overflow: hidden` (use `clip`), nos blocos do fim da página, em fotos grandes ou seção inteira.

## Performance e acessibilidade

- Metas: Lighthouse no celular com o rastreio acima de 90, desktop acima de 95, CLS 0.
- LCP abaixo de 2,5 s em 4G. A imagem do hero é o LCP: sem lazy-load. Todo o resto com `loading="lazy"`. Primeira tela no celular abaixo de 400 KB.
- Contraste mínimo 4,5:1 no texto. Foco de teclado visível. Alvos de toque com pelo menos 44 px. `alt` descritivo nas imagens de conteúdo, `alt=""` nas decorativas. `lang="pt-BR"`.
- Unidades `svh`/`dvh` no lugar de `vh`.
- `content-visibility` não é usado (corta as luzes que atravessam as emendas; ganho pequeno).

## SEO e compartilhamento

- `<title>`, `meta description` e as tags de compartilhamento no topo do `docs/copy.md`.
- Open Graph e Twitter Card com `assets/img/og.jpg` (1200x630, gerado do hero desktop com os quatro livros inteiros; `npm run og --prefix scripts`), em `https://arsenal-homem-blindado.com.br/assets/img/og.jpg`.
- Favicon e apple-touch-icon com o escudo em carmim (`npm run favicons --prefix scripts`).
