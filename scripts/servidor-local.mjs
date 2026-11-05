// Servidor local que imita a Hostinger (as regras do .htaccess), para conferir rotas, 404 e cache antes do deploy.
// O Live Server não lê o .htaccess: lá a raiz abre a página e /bio/ não existe. Aqui, não.
//
// Uso, a partir da raiz do projeto:
//   node scripts/servidor-local.mjs          (porta 5600; outra: PORTA=5700 node scripts/servidor-local.mjs)
//
// O que ele imita (mudou o .htaccess, mude aqui):
// - /bio, /sdr, /tfg, /story e /cht, com ou sem barra e em qualquer caixa: o index.html, com status 200;
// - a raiz (/) e o pedido direto de /index.html: 404 com a 404.html;
// - arquivos internos (docs/, scripts/, node_modules/, _entrada/, qualquer .md, README, package*.json,
//   _redirects, _headers e tudo que começa com ponto): 404;
// - qualquer outro endereço que não exista: 404 com a 404.html;
// - Cache-Control: no-cache no HTML, 1 semana nos favicons e 1 ano (immutable) em /assets/; compressão brotli ou
//   gzip nos textos.

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.env.PORTA || 5600);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
const INTERNO = [
  /(^|\/)(docs|scripts|node_modules|_entrada)(\/|$)/i,
  /\/\.(?!well-known(\/|$))/i,
  /\.md$/i,
  /(^|\/)readme([.][^/]*)?$/i,
  /(^|\/)package(-lock)?\.json$/i,
  /(^|\/)_(redirects|headers)$/i,
];
const ROTA = /^\/(bio|sdr|tfg|story|cht)\/?$/i;

function cache(caminho) {
  if (/\.html$/.test(caminho)) return 'no-cache';
  if (/^\/(favicon\.(svg|ico)|favicon-32\.png|apple-touch-icon\.png)$/.test(caminho)) return 'public, max-age=604800';
  if (caminho.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  return null;
}

async function enviar(req, res, status, arquivo, caminhoPublico) {
  const corpo = await readFile(arquivo);
  const ext = path.extname(arquivo).toLowerCase();
  const tipo = TIPOS[ext] || 'application/octet-stream';
  const cabecalhos = { 'Content-Type': tipo, 'X-Content-Type-Options': 'nosniff', Vary: 'Accept-Encoding' };
  const cc = cache(caminhoPublico);
  if (cc) cabecalhos['Cache-Control'] = cc;
  let saida = corpo;
  const aceita = req.headers['accept-encoding'] || '';
  if (/^(text\/|application\/json|image\/svg)/.test(tipo)) {
    if (/\bbr\b/.test(aceita)) { saida = zlib.brotliCompressSync(corpo); cabecalhos['Content-Encoding'] = 'br'; }
    else if (/\bgzip\b/.test(aceita)) { saida = zlib.gzipSync(corpo); cabecalhos['Content-Encoding'] = 'gzip'; }
  }
  cabecalhos['Content-Length'] = saida.length;
  res.writeHead(status, cabecalhos);
  res.end(req.method === 'HEAD' ? undefined : saida);
}

const pagina404 = (req, res) => enviar(req, res, 404, path.join(RAIZ, '404.html'), '/404.html');

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const caminho = decodeURIComponent(url.pathname);
    if (caminho === '/' || /^\/+index\.html$/i.test(caminho)) return pagina404(req, res);
    if (ROTA.test(caminho)) return enviar(req, res, 200, path.join(RAIZ, 'index.html'), '/index.html');
    if (INTERNO.some((r) => r.test(caminho))) return pagina404(req, res);
    const arquivo = path.join(RAIZ, caminho);
    if (!arquivo.startsWith(RAIZ)) return pagina404(req, res);
    const info = await stat(arquivo).catch(() => null);
    if (!info || !info.isFile()) return pagina404(req, res);
    return enviar(req, res, 200, arquivo, caminho);
  } catch (erro) {
    res.writeHead(500); res.end(String(erro));
  }
}).listen(PORTA, () => console.log(`Servidor parecido com a Hostinger em http://localhost:${PORTA}/bio/`));
