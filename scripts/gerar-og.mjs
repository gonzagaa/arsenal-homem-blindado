// Gera assets/img/og.jpg (1200x630), a imagem de compartilhamento (Open Graph e Twitter Card):
// a foto do hero desktop com o rótulo e o H1 por cima, na Geist, com a identidade da página (H1 em 700 e branco,
// destaque no degradê azul com brilho, rótulo numa cápsula de borda azul, em maiúsculas espaçadas).
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
const foto = (await sharp(path.join(RAIZ, 'assets', 'img', 'hero-desktop.png')).resize({ width: 2400 }).jpeg({ quality: 92 }).toBuffer()).toString('base64');
const geist = (await readFile(path.join(RAIZ, 'assets', 'fonts', 'geist-latin.woff2'))).toString('base64');

// O mesmo rótulo e o mesmo H1 do index.html (copy, seção 1).
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
@font-face{font-family:'Geist';font-weight:100 900;font-display:block;src:url(data:font/woff2;base64,${geist}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#01050F;font-family:'Geist',sans-serif;-webkit-font-smoothing:antialiased}
.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:0% 30%}
.sombra{position:absolute;inset:0;background:linear-gradient(90deg,rgba(1,5,15,.92) 0%,rgba(1,5,15,.72) 34%,rgba(1,5,15,0) 56%),linear-gradient(0deg,rgba(1,5,15,.55) 0%,rgba(1,5,15,0) 30%)}
.texto{position:absolute;left:72px;top:0;bottom:0;width:580px;display:flex;flex-direction:column;justify-content:center;gap:26px}
.pill{align-self:flex-start;display:inline-flex;align-items:center;gap:12px;padding:10px 20px 10px 16px;border-radius:999px;font-size:13.5px;font-weight:500;letter-spacing:.16em;white-space:nowrap;text-transform:uppercase;color:#C9D3E0;background:linear-gradient(180deg,rgba(22,36,58,.7),rgba(10,20,36,.62));border:1px solid #3D8BFF;box-shadow:0 0 18px rgba(61,139,255,.45),inset 0 1px 0 rgba(255,255,255,.08)}
.pill::before{content:"";width:15px;height:18px;background:linear-gradient(180deg,#F1F4F8,#8FA3BE);clip-path:polygon(50% 0,100% 13%,100% 46%,86% 74%,50% 100%,14% 74%,0 46%,0 13%)}
h1{font-weight:700;font-size:46px;line-height:1.1;letter-spacing:-.02em;text-wrap:balance;color:#FFFFFF}
h1 strong{font-weight:700;background:linear-gradient(180deg,#8FD0FF 0%,#3D8BFF 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 18px rgba(61,139,255,.25)}
</style></head><body>
<img class="foto" src="data:image/jpeg;base64,${foto}" alt="">
<div class="sombra"></div>
<div class="texto"><span class="pill">Conheça o método De Desprezado a Respeitado</span>
<h1>Vou te mostrar como deixar de ser desprezado e <strong>voltar a ser respeitado dentro da sua própria casa.</strong></h1></div>
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
