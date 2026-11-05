// Gera os favicons PNG e ICO a partir do escudo (favicon.svg na raiz é o desenho de referência).
//
// Uso, a partir da raiz do projeto:
//   npm install --prefix scripts            uma vez
//   npm run favicons --prefix scripts
//
// Saem na raiz: favicon-32.png, apple-touch-icon.png (180, sem cantos: o iOS arredonda sozinho)
// e favicon.ico (16, 32 e 48), para quem pede /favicon.ico sem ler o <head>.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ESCUDO = 'M100 10 L182 40 C182 120 158 182 100 230 C42 182 18 120 18 40 Z';

// Escudo prateado sobre o fundo da página. "altura" é a fração do quadro que o escudo ocupa.
function svg({ cantos, altura }) {
  const escala = (64 * altura) / 220; // o escudo vai de y=10 a y=230 no desenho original
  const x = 32 - 100 * escala, y = 32 - 120 * escala;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#8FA3BE"/></linearGradient></defs><rect width="64" height="64" rx="${cantos}" fill="#050A14"/><path transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${escala.toFixed(4)})" d="${ESCUDO}" fill="url(#p)"/></svg>`;
}

const png = (desenho, lado) => sharp(Buffer.from(desenho), { density: 72 * (lado / 64) * 4 }).resize(lado, lado).png().toBuffer();

const aba = svg({ cantos: 14, altura: 0.62 }); // o mesmo desenho do favicon.svg
await writeFile(path.join(RAIZ, 'favicon-32.png'), await png(aba, 32));
await writeFile(path.join(RAIZ, 'apple-touch-icon.png'), await png(svg({ cantos: 0, altura: 0.56 }), 180));

// ICO com PNGs dentro (aceito por todos os navegadores atuais).
const tamanhos = [16, 32, 48];
const imagens = await Promise.all(tamanhos.map(t => png(aba, t)));
const cabecalho = Buffer.alloc(6 + 16 * tamanhos.length);
cabecalho.writeUInt16LE(0, 0); cabecalho.writeUInt16LE(1, 2); cabecalho.writeUInt16LE(tamanhos.length, 4);
let deslocamento = cabecalho.length;
tamanhos.forEach((t, i) => {
  const e = 6 + 16 * i;
  cabecalho.writeUInt8(t, e); cabecalho.writeUInt8(t, e + 1); cabecalho.writeUInt8(0, e + 2); cabecalho.writeUInt8(0, e + 3);
  cabecalho.writeUInt16LE(1, e + 4); cabecalho.writeUInt16LE(32, e + 6);
  cabecalho.writeUInt32LE(imagens[i].length, e + 8); cabecalho.writeUInt32LE(deslocamento, e + 12);
  deslocamento += imagens[i].length;
});
await writeFile(path.join(RAIZ, 'favicon.ico'), Buffer.concat([cabecalho, ...imagens]));
console.log('favicon-32.png, apple-touch-icon.png e favicon.ico gerados na raiz.');
