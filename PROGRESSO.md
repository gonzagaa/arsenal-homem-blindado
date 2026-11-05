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
