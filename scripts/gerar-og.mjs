// Gera assets/img/og.jpg (1200x630), a imagem de compartilhamento (Open Graph e Twitter Card):
// a arte do hero desktop com os quatro manuais inteiros à direita e o rótulo e o H1 à esquerda, na Geist, com a
// identidade da página (H1 em 700 e branco, destaque no degradê carmim para dourado, rótulo numa cápsula de borda
// carmim, em maiúsculas espaçadas). Na arte, os livros vão de 49,7% a 96,4% da largura: o texto fica antes disso.
//
// Uso, a partir da raiz do projeto:
//   npm install --prefix scripts            uma vez
//   npm run og --prefix scripts
//
// Usa o Chrome instalado na máquina (puppeteer-core). Se ele não estiver no caminho padrão,
// informe com a variável CHROME_PATH. A Geist vem do arquivo local (assets/fonts), sem internet.

import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.join(RAIZ, 'assets', 'img', 'og.jpg');

const candidatos = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
let chrome;
for (const c of candidatos) { try { await access(c); chrome = c; break; } catch {} }
if (!chrome) throw new Error('Chrome não encontrado. Informe o caminho em CHROME_PATH.');

// A foto original é grande demais para ir inteira em base64 (o Chrome estoura o tempo):
// vai reduzida a 2400px de largura, o dobro do card.
const foto = (await sharp(path.join(RAIZ, 'assets', 'img', 'hero-arsenal-desktop.png')).resize({ width: 2400 }).jpeg({ quality: 92 }).toBuffer()).toString('base64');
const geist = (await readFile(path.join(RAIZ, 'assets', 'fonts', 'geist-latin.woff2'))).toString('base64');

// O mesmo rótulo e o mesmo H1 do index.html (copy, seção 1).
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
@font-face{font-family:'Geist';font-weight:100 900;font-display:block;src:url(data:font/woff2;base64,${geist}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#000000;font-family:'Geist',sans-serif;-webkit-font-smoothing:antialiased}
.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%}
.sombra{position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,2,4,.5) 0%,rgba(10,2,4,0) 26%)}
.texto{position:absolute;left:64px;top:0;bottom:0;width:500px;display:flex;flex-direction:column;justify-content:center;gap:26px}
.pill{align-self:flex-start;display:inline-flex;align-items:center;gap:12px;padding:10px 20px 10px 16px;border-radius:999px;font-size:13.5px;font-weight:500;letter-spacing:.16em;white-space:nowrap;text-transform:uppercase;color:#EBDDDF;background:linear-gradient(180deg,rgba(48,8,18,.7),rgba(20,3,8,.62));border:1px solid #E0185A;box-shadow:0 0 18px rgba(224,24,90,.45),inset 0 1px 0 rgba(255,255,255,.08)}
.pill::before{content:"";width:15px;height:18px;background:linear-gradient(180deg,#F4DDA6,#B98A3E);clip-path:polygon(50% 0,100% 13%,100% 46%,86% 74%,50% 100%,14% 74%,0 46%,0 13%)}
h1{font-weight:700;font-size:44px;line-height:1.1;letter-spacing:-.02em;text-wrap:balance;color:#FFFFFF}
h1 strong{font-weight:700;background:linear-gradient(90deg,#E0185A 0%,#F2B33D 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-box-decoration-break:clone;box-decoration-break:clone;text-shadow:0 0 18px rgba(224,24,90,.22)}
</style></head><body>
<img class="foto" src="data:image/jpeg;base64,${foto}" alt="">
<div class="sombra"></div>
<div class="texto"><span class="pill">Conheça o Arsenal Homem Blindado</span>
<h1>Tem homem que só aprende isso depois de ser traído. <strong>Você pode aprender antes.</strong></h1></div>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const carregou = await page.evaluate(() => document.fonts.check('500 56px Geist') && document.fonts.check('700 56px Geist'));
if (!carregou) throw new Error('A Geist não carregou. A imagem não foi gerada.');
await page.screenshot({ path: SAIDA, type: 'jpeg', quality: 86 });
await browser.close();
console.log('assets/img/og.jpg gerado (1200x630).');
