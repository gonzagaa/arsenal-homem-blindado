# Prompt inicial: Arsenal Homem Blindado

Novo projeto: a página de vendas do Arsenal Homem Blindado, do Marcello Gomes. Ela vai substituir o WordPress em arsenal-homem-blindado.com.br. A base é o código da página De Desprezado a Respeitado, que já está no ar e foi aprovada pelo cliente. A estrutura, o sistema de rotas, o rastreio, a performance e a hospedagem são os mesmos. Mudam a copy, as imagens e as cores.

Regra de parada, como no outro projeto: faça a etapa, me reporte e espere o APROVADO antes de commitar e dar push. Nunca use travessão (—) em textos da página nem na documentação.

## O que já está nesta pasta

- `docs/copy.md`: a copy final, aprovada pelo cliente. Use palavra por palavra.
- `_entrada/capas/`: as capas planas dos quatro manuais (1024x1536):
  - `capa-1-arsenal-homem-blindado.png` (o manual central);
  - `capa-2-manual-secreto-da-traicao.png`;
  - `capa-3-nunca-se-iluda.png`;
  - `capa-4-a-forca-da-honra.png`.
- `_entrada/hero/`: o fundo do hero com os quatro livros:
  - `hero-arsenal-desktop.png` (3344x1882): livros na metade direita, lado esquerdo escuro para o texto;
  - `hero-arsenal-mobile.png` (1882x3344): livros em cima, metade de baixo escura para o texto.

## Etapa 0: preparar a base

1. A base está na pasta irmã `../Arsenal Homem Moderno`. Ela pode estar desatualizada nesta máquina. Entre nela e rode `git status` e `git pull`, sem mudar nada lá. O último commit esperado inclui o hero com os livros e a rota /cht/.
2. Copie para esta pasta tudo o que a página de vendas precisa: `index.html`, `404.html`, `.htaccess`, `assets/.htaccess`, `_redirects`, `_headers`, `.gitignore`, `scripts/` (sem `node_modules`), as fontes, os favicons e os prints de DM tratados. NÃO copie `.git`, `node_modules`, `_entrada`, `docs`, `CLAUDE.md`, `PROGRESSO.md` nem `PENDENCIAS.md`.
3. Fora do escopo do Arsenal: a página de links (`links.html` e as imagens `links-*`), as imagens do Desprezado (hero, capa dourada, cadernos, cards) e o og.jpg. Não traga isso. Na raiz do domínio, o Arsenal NÃO tem página de links: `/` responde 404, como era no Desprezado antes da página de links.
4. `git init`, branch `main`, remote `https://github.com/gonzagaa/arsenal-homem-blindado.git` (repositório privado, já criado e vazio). Garanta que `_entrada/` está no `.gitignore`. Não faça push ainda.
5. Escreva `CLAUDE.md` novo para este projeto, aproveitando do outro só o que vale aqui: regras, arquitetura, rotas, rastreio, performance e hospedagem. Tire o histórico do Desprezado. Crie também `PROGRESSO.md` e `PENDENCIAS.md`.

## Etapa 1: a página

### Identidade visual

Mesma estrutura e o mesmo sistema do tema vibrante do Desprezado (Geist, CTAs grandes em maiúsculas, anéis, círculo da seta, cards de vidro, grão), trocando o azul pela paleta do Arsenal, que vem das capas novas:

- fundo quase preto com tom vinho: base `#0A0204`, áreas de destaque em `#38000E`;
- cor principal carmim `#BB003D`; o círculo da seta e os anéis em degradê `#E0185A` para `#7A0026`;
- os destaques de texto (o trecho em negrito de cada título) em degradê carmim para dourado, como nos títulos das capas: `#E0185A` para `#F2B33D`;
- dourado `#D9B26A` só em detalhes finos (filetes, ícone do escudo), sem exagero.

Mantenha as regras do outro projeto: nada de hover em elemento não clicável; nada de rótulo em caixa alta com letras espaçadas, exceto a pill do hero; contraste AA nos textos.

### Seções (ordem e conteúdo exatamente como em `docs/copy.md`)

1. **Hero:** fundo com as imagens de `_entrada/hero/`, com o mesmo esquema do hero de livros do Desprezado (art direction celular/desktop, ampliação e ancoragem à direita em telas largas, texto abaixo dos livros no celular, ajuste para celulares baixos).
2. **Identificação:** o mesmo componente de itens marcáveis do Desprezado, com 5 itens.
3. **As quatro brechas:** quatro cards com a capa de cada manual. O card do Arsenal Homem Blindado fica em destaque (maior, ou ocupando a largura toda no topo).
4. **O que você recebe:** o mesmo palco da oferta do Desprezado, agora com as quatro capas e o Arsenal no centro, mais a lista e o bloco de preço.
5. **Quem está por trás:** a mesma seção do autor, com a foto do Marcello que já é usada no Desprezado. Os prints de DM ficam no carrossel; escolha os 6 a 8 que mais falam de traição, manipulação e postura e me diga quais escolheu.
6. **Garantia e dúvidas.**
7. **Chamada final, rodapé e barra fixa do celular.**

Tire do código as seções do Desprezado que não existem na copy do Arsenal.

### Imagens

- Copie os originais de `_entrada/` para `assets/img/` e gere as versões otimizadas pelo `scripts/otimizar-imagens.mjs`, com nomes novos (`hero-arsenal-*`, `capa-arsenal-*`, `capa-traicao-*`, `capa-iluda-*`, `capa-honra-*`). Os títulos das capas têm que ficar nítidos.
- og.jpg novo (1200x630) a partir do hero desktop, com os quatro livros inteiros.
- Favicon e apple-touch-icon com o escudo em carmim.

### Rotas, checkouts e rastreio

- As mesmas 5 rotas, todas servindo o `index.html`: `/bio/`, `/sdr/`, `/tfg/`, `/story/` e `/cht/`. Configure em `.htaccess` (Hostinger) e em `_redirects` (prévia na Netlify). `/` e `/index.html` respondem 404.
- Os links de checkout ainda não chegaram. Monte o mapa `CHECKOUTS` com as 5 rotas e um valor de placeholder claro. Enquanto ele estiver lá, os botões não podem levar a lugar nenhum, e o console avisa em localhost. Registre no `PENDENCIAS.md` como bloqueador para publicar.
- O repasse de UTM e o `?origem=` em localhost funcionam como no Desprezado.
- Rastreio: mantenha a estrutura (GTM e Meta Pixel só com PageView, desligados em localhost), mas NÃO use os IDs do Desprezado. Deixe os IDs como placeholder e registre no `PENDENCIAS.md` para confirmar com o cliente se o Arsenal usa o mesmo GTM e o mesmo Pixel.
- Canonical e og:url: `https://arsenal-homem-blindado.com.br/bio/`.

### Performance

As mesmas metas do Desprezado: celular com rastreio acima de 90, desktop acima de 95, CLS 0.

## Relatório da Etapa 1

- Estrutura de arquivos criada e o que foi copiado da base.
- Prints em 360x640, 390x844, 768x1024 e 1440x900, e do hero em 1920x1080.
- Os prints de DM escolhidos.
- Nota de performance no celular e no desktop.
- Tabela das rotas no servidor local que imita a Hostinger: `/`, as 5 rotas, `/index.html` e uma rota inexistente.
- Pendências abertas.

Depois do APROVADO: commit, push e eu conecto o repositório à Netlify para a prévia.
