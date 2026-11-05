# Progresso

Registro das etapas de `docs/PROMPT-INICIAL.md`. Em uma sessão nova, leia este arquivo antes de qualquer outra coisa.

## Etapa 0: preparar a base (aprovada em 05/11/2026)

05/11/2026.

- Base: o repositório do De Desprezado a Respeitado (`../Arsenal Homem Moderno`), atualizado com `git pull` até o commit `317ecad` ("Hero oficial com os três livros; fim da comparação ?hero=livros"), que já inclui a rota /cht/. Nada foi mudado lá.
- Copiado da base: `index.html`, `404.html`, `.htaccess`, `assets/.htaccess`, `_redirects`, `_headers`, `.gitignore`, `scripts/` (os quatro scripts, `package.json` e `package-lock.json`, sem `node_modules`), a Geist (`assets/fonts/geist-latin.woff2` e `OFL.txt`), os favicons (`favicon.ico`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`), o Lenis (`assets/js/lenis.min.js`), os 8 prints de DM tratados (`assets/img/prints/` e `opt/print-*`), a foto do Marcello (`autor.png` e `opt/autor-*`), o grão (`grain.png` e `opt/grain.webp`) e a mesa do palco da oferta (`oferta-mesa.png` e `opt/oferta-mesa-*`).
- Fora do escopo, não copiado: `links.html` e as imagens `links-*`, a fonte Cinzel (usada só na página de links), o hero do Desprezado (antigo e de livros), a capa dourada e as duas capas laterais, os cards da transformação, o `og.jpg`.
- Os arquivos copiados ainda estão como no Desprezado (textos, cores, IDs, a raiz servindo a `links.html` no `.htaccess` e no `_redirects`). A adaptação é a Etapa 1.
- Git: `git init`, branch `main`, remote `https://github.com/gonzagaa/arsenal-homem-blindado.git`. `_entrada/` no `.gitignore`.
- Documentação nova: `CLAUDE.md`, `PROGRESSO.md` e `PENDENCIAS.md`.
- Logo depois da checagem, os fundos do hero chegaram em `_entrada/hero/` (`hero-arsenal-desktop.png` e `hero-arsenal-mobile.png`).
- Mesa do palco: o cliente pediu para tentar levar a parede azul da foto atual para o vinho pelo script de imagens, com nome novo; se ficar artificial, ele providencia uma mesa nova.

## Etapa 1: a página (aprovada em 05/11/2026, com ajustes)

05/11/2026.

### O que foi feito

- `index.html` reescrito a partir da base, com a copy do `docs/copy.md` palavra por palavra e a ordem dela: hero, #identificacao, #brechas (nova), #oferta, #autor, #faq, #fechamento, rodapé e barra fixa. Saíram as seções do Desprezado que não existem na copy (#transformacao e #caminho, com os cards, o trilho das etapas e o bloco "Do conhecimento à ação"). A camada base prateada e a camada `.tema-vibrante` por cima viraram uma camada só, já com a paleta do Arsenal (152 KB, contra 190 KB da base).
- Paleta: fundo `#0A0204` (o hero do desktop em `#000000`, a cor da arte), vinho `#38000E` nas áreas de destaque (fundo das #brechas, brilho do fechamento, 404), carmim nas bordas, anéis e brilhos, destaques no degradê `#E0185A` para `#F2B33D` (horizontal, repetido em cada linha), dourado `#D9B26A` só nos filetes (fim do hero, curva da #identificacao, rodapé, fechamento), no escudo e na moldura da foto do autor. Botão em marfim com texto escuro.
- Hero: as artes de `_entrada/hero/` medidas de novo (frações no `CLAUDE.md`). Celular com o texto logo abaixo dos livros e o botão na primeira tela de 360x640 a 430x932; desktop com os livros presos à direita, de 1024 a 2560 px. H1 limitado à largura da subheadline + 20 px (em 1440 ele encostava a 19 px dos livros) e livros limitados pela altura do hero com 80 px de folga (em 2560 ocupavam a altura toda).
- #brechas: card do Arsenal em destaque (capa grande; na largura toda a partir de 1024 px) e os outros três com a capa ao lado (celular e tablet) ou em cima (desktop). O título de cada card é a brecha; o manual vem embaixo, com o escudo dourado.
- #oferta: o palco na ordem da arte do hero (Traição, Iluda, Arsenal, Honra), o Arsenal maior e na frente. No celular, sobrepostos, os títulos de Iluda e Honra eram cortados: ficaram lado a lado, sem sobreposição. Sem a cápsula "3 materiais integrados" (não está na copy): o painel sobe sobre a borda do palco.
- Botões com o rótulo longo ("Quero me tornar um Homem Blindado"): no celular a 14 a 17 px das bordas (375 a 430 px); no tablet, o da oferta em 16 px; no desktop, o bloco de preço com 7 de 12 colunas e o bloco do fechamento com 640 px. Conferido por medição: nenhum botão passa do bloco de 761 a 1440 px.
- Prova social: 6 dos 8 prints tratados no Desprezado, na ordem 04 (traição, terminou ao descobrir), 03 (separação, "campo minado"), 06 (postura, story do Homem Blindado), 01 ("assunto delicado"), 02 (decisão, ser assertivo) e 08 ("só fala a verdade", story sobre confiar em mulher). Ficaram de fora o 05 (elogio genérico) e o 07 (genérico, com o rosto de uma mulher no story). Carrossel de 2160 px por volta, em 54 s; o JS das setas e do foco conta os cards sozinho.
- Checkout: `CHECKOUTS` com `PENDENTE` nas seis chaves; botões com `data-checkout` e href `#checkout-pendente`. Testado com links simulados por interceptação: as UTMs e o `fbclid` vão, `rastreio` e `origem` não, `?origem=` só vale no localhost, no toque o link fica na mesma guia. Com o pendente, o clique não navega e o console avisa no localhost.
- Rastreio: estrutura mantida, IDs em `GTM_ID` e `PIXEL_ID` com "PENDENTE" (nada carrega enquanto isso).
- Imagens (`scripts/otimizar-imagens.mjs`): `hero-arsenal-*`, `capa-arsenal-*`, `capa-traicao-*`, `capa-iluda-*`, `capa-honra-*` (perfil próprio de capa, cor inteira e qualidade mais alta, para os títulos ficarem nítidos) e `oferta-mesa-vinho-*` (a parede azul levada para o vinho; só os matizes azuis mudam). Saíram do script os cards, a página de links e as capas do Desprezado; as `opt/oferta-mesa-*` azuis foram apagadas. Os prints 05 e 07 continuam em `assets/img` (sem uso), caso o cliente queira trocar.
- og.jpg novo (`npm run og --prefix scripts`): a arte do hero desktop com os quatro livros inteiros, o rótulo e o H1. Favicons com o escudo em degradê carmim (`npm run favicons --prefix scripts`).
- Hospedagem: `.htaccess` com a raiz e o `/index.html` em 404 por uma regra só (`THE_REQUEST`), `DirectoryIndex index.html` de segurança; `_redirects` com `/` e `/index.html` em `404!`; `_headers` sem a `links.html`. 404.html na paleta nova.
- `scripts/servidor-local.mjs` (novo): servidor que imita o `.htaccess`, para conferir rotas, 404, cache e compressão.

### Rotas (servidor local que imita a Hostinger)

| Endereço | Status | Página |
| --- | --- | --- |
| `/` | 404 | 404.html |
| `/bio/`, `/bio`, `/BIO/` | 200 | index.html |
| `/sdr/`, `/tfg/`, `/story/`, `/cht/` | 200 | index.html |
| `/bio/?utm_source=teste` | 200 | index.html |
| `/index.html`, `/index.html?x=1` | 404 | 404.html |
| `/qualquer-coisa`, `/wp-admin/` | 404 | 404.html |
| `/CLAUDE.md`, `/docs/copy.md`, `/scripts/package.json`, `/_redirects`, `/.git/config` | 404 | 404.html |

HTML com `no-cache`, `/assets/` com 1 ano (immutable), favicons com 1 semana, texto em brotli.

### Performance (Lighthouse 12.8.2, servidor local, GPU desligada)

- Sem rastreio (os IDs estão pendentes, então é o estado real da página hoje): celular 98 de mediana (99, 99, 98, 80, 79; as duas baixas são o atraso de ~1 s na primeira pintura do Chrome desta máquina, já registrado no Desprezado), LCP 2,0 s, CLS 0, 266 KB; desktop 100 nas três, LCP 0,4 s, CLS 0.
- Com o rastreio simulado (os scripts do GTM e do Pixel do Desprezado carregando só para medir, com todo envio de dados bloqueado: GA4, Meta, DoubleClick, Google Ads): celular de 41 a 91, mediana ~70, TBT de 0,8 a 2,5 s, quase todo do GTM e do Pixel; desktop 97 a 99. Nas mesmas condições, alternando, a própria página do Desprezado mediu de 46 a 84 (mediana ~69), contra os 91 a 95 registrados na fase de performance dela: a máquina hoje está mais lenta, ou o contêiner do GTM cresceu. A meta de 90 com rastreio fica para medir de novo quando os IDs do Arsenal chegarem.
- Ajuste feito por causa da medição: as capas deixaram de ser contêineres de consulta (`container-type`), que pesavam no estilo e no layout com 8 capas na página.
- Decisão do cliente: a medição com o rastreio fica para depois dos IDs reais do GTM e do Pixel, feita pelo PageSpeed Insights na prévia da Netlify (celular acima de 90, desktop acima de 95, CLS 0). As medições locais com o rastreio simulado não valem como referência.

### Ajustes pedidos no APROVADO

- #brechas no celular (até 760 px): o card do Arsenal ocupava quase uma tela. Agora tem o mesmo formato horizontal dos outros três (capa ao lado do texto), com a capa 20% maior (110 px, contra 92), e o destaque fica só na borda e no brilho carmim; o fundo com luz própria passou para a partir de 761 px. Tablet e desktop sem mudança.
- Foto do Marcello: `autor-vinho.png`, gerada pelo `scripts/otimizar-imagens.mjs` (`gerarAutorVinho`). O blazer também é azul (marinho), então o matiz sozinho não servia: a parede (azul de saturação acima de 0,9) vira uma máscara contínua, e polígonos medidos na foto marcam o fundo onde ele tem a mesma cor do blazer (canto de baixo à direita, vão entre a mão e o corpo, fresta entre o corpo e a manga). Dentro da máscara, os tons azuis vão para o mesmo vinho da mesa. Pele, cabelo, barba, blazer, camiseta, poltrona e abajur ficaram iguais (azul vivo na foto: de 24% para 0,3%, o que sobra é o reflexo da luz na borda da manga). As `opt/autor-*` azuis foram apagadas; o `autor.png` fica como fonte.
- Subtítulo da prova social: "O que os homens mandam para o Marcello **sobre os conteúdos dele.**" (na página e no `docs/copy.md`).
- `PENDENCIAS.md`: os números, o R$ 297 riscado, a garantia de 7 dias e os prints de DM foram aprovados pelo cliente (os mesmos do Desprezado). Ficam: checkouts, IDs do GTM e do Pixel, pixel e token nos checkouts da Eduzz, política de privacidade e a aprovação da mesa da oferta.

### Conferência depois do primeiro deploy na Hostinger

No domínio: `/` e `/index.html` em 404 com a `404.html`; /bio/, /sdr/, /tfg/, /story/ e /cht/ abrindo a página; um endereço inventado em 404; http e www indo para https sem www; /docs/, /CLAUDE.md e /.git/config sem abrir; HTML com `Cache-Control: no-cache` e /assets/ com 1 ano; resposta comprimida; nenhum arquivo do WordPress antigo sobrando na raiz. As regras do `.htaccess` foram testadas só no `scripts/servidor-local.mjs`; a da raiz usa `[R=404]`, que o LiteSpeed precisa aceitar.
