// Gera as versões otimizadas das imagens de assets/img em assets/img/opt:
// AVIF, WebP e JPG em cada largura, com o nome <imagem>-<largura>.<ext>.
//
// Uso, a partir da raiz do projeto:
//   npm install --prefix scripts            uma vez, para baixar o sharp
//   node scripts/otimizar-imagens.mjs       gera só o que mudou desde a última vez
//   node scripts/otimizar-imagens.mjs --tudo    refaz tudo
//
// Prints da DM: coloque os originais em assets/img/prints/ e rode de novo.
// Saem como opt/print-<nome>-<largura>.<ext> (sem repetir o "print-" se o arquivo já começar assim),
// com qualidade maior, porque texto borra com a compressão pensada para foto.
//
// Mesa do palco da oferta: a foto original (oferta-mesa.png, da página De Desprezado a Respeitado) tem a parede
// azul. O script gera antes a oferta-mesa-vinho.png, com só os tons azuis levados para o vinho da paleta (ver
// gerarMesaVinho), e é ela que vira as versões otimizadas. A foto do Marcello passa pelo mesmo tratamento, com
// a roupa protegida (ver gerarAutorVinho): sai a autor-vinho.png.

import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = path.join(RAIZ, 'assets', 'img');
const PRINTS = path.join(ORIGEM, 'prints');
const DESTINO = path.join(ORIGEM, 'opt');

// Larguras em px. Cada uma cobre o tamanho da imagem na tela em 1x e 2x; o hero, também em 3x. Fora o hero, o
// sizes do index.html limita o celular a 2x (com densidade alta, ele encolhe e o navegador pede a versão de 2x).
// Uma largura maior que o original vira o próprio original: nunca amplia.
const LARGURAS = {
  // Hero: o fundo com os quatro manuais. Celular e tablet até 1290 (iPhone com densidade 3, tablet com 2); desktop
  // até 3200 (a imagem é ampliada pelos livros: passa da largura da tela nas telas largas).
  'hero-arsenal-mobile': [640, 828, 1080, 1290],
  'hero-arsenal-desktop': [1280, 1600, 1920, 2560, 3200],
  // Foto do Marcello (a versão com o fundo vinho, gerada abaixo).
  'autor-vinho': [400, 640, 900],
  // Capas planas dos quatro manuais (1024x1536, a maior versão fica com 1024): no palco da oferta, até 280px no
  // desktop (2x) e 44% da tela no celular; nos cards das #brechas, até ~260px.
  'capa-arsenal': [360, 540, 800, 1024],
  'capa-traicao': [360, 540, 800, 1024],
  'capa-iluda': [360, 540, 800, 1024],
  'capa-honra': [360, 540, 800, 1024],
  // Mesa da oferta (a versão vinho, gerada abaixo): 676px no celular, limitada a 2x (1360); até 1600px no desktop.
  'oferta-mesa-vinho': [960, 1280, 1360, 1672],
};
// Prints: ~250px na fileira do celular, ~350px no carrossel do desktop e até 737px na galeria.
// Os originais têm ~737px: 737 é o teto (nunca amplia; a maior versão fica na largura do original).
const LARGURAS_PRINT = [360, 540, 737];

// AVIF em 10 bits: os degradês escuros das fotos fazem faixas em 8 bits.
const FOTO = {
  avif: { quality: 50, effort: 6, bitdepth: 10 },
  webp: { quality: 78, effort: 6, smartSubsample: true },
  jpg: { quality: 78, mozjpeg: true, progressive: true },
};
// Retrato do Marcello: abaixo disso a pele, a barba e o tricô do suéter ficam lisos.
const RETRATO = {
  avif: { quality: 64, effort: 6, bitdepth: 10 },
  webp: { quality: 84, effort: 6, smartSubsample: true },
  jpg: { quality: 84, mozjpeg: true, progressive: true },
};
// Capas: os títulos são letras grossas em degradê carmim e dourado. Com a cor em meia resolução (4:2:0), a borda
// do vermelho borra; aqui a cor fica inteira (4:4:4) e a qualidade, mais alta.
const CAPA = {
  avif: { quality: 66, effort: 6, bitdepth: 10, chromaSubsampling: '4:4:4' },
  webp: { quality: 86, effort: 6, smartSubsample: true },
  jpg: { quality: 86, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' },
};
const CAPAS = new Set(['capa-arsenal', 'capa-traicao', 'capa-iluda', 'capa-honra']);
// Hero: a primeira coisa que se vê, com os títulos das capas em letra pequena. AVIF no topo da faixa 62 a 68 e
// com a cor inteira (4:4:4), pelo mesmo motivo das capas.
const HERO = {
  avif: { quality: 68, effort: 6, bitdepth: 10, chromaSubsampling: '4:4:4' },
  webp: { quality: 82, effort: 6, smartSubsample: true },
  jpg: { quality: 82, mozjpeg: true, progressive: true },
};
const HEROS = new Set(['hero-arsenal-mobile', 'hero-arsenal-desktop']);
const TEXTO = {
  avif: { quality: 65, effort: 6, chromaSubsampling: '4:4:4' },
  webp: { quality: 88, effort: 6 },
  jpg: { quality: 88, mozjpeg: true, progressive: true },
};

const FORMATOS = [
  ['avif', (s, q) => s.avif(q.avif)],
  ['webp', (s, q) => s.webp(q.webp)],
  ['jpg', (s, q) => s.jpeg(q.jpg)],
];

const refazerTudo = process.argv.includes('--tudo');
const relatorio = [];

async function atualizado(saida, mtimeOrigem) {
  if (refazerTudo) return false;
  try {
    return (await stat(saida)).mtimeMs >= mtimeOrigem;
  } catch {
    return false;
  }
}
async function gerar(arquivo, nome, larguras, qualidade, corte, formatos = FORMATOS) {
  const { mtimeMs } = await stat(arquivo);
  const meta = await sharp(arquivo).metadata();
  const { width: W, height: H } = corte ?? meta.autoOrient ?? meta;
  const alvos = [...new Set(larguras.map((l) => Math.min(l, W)))];

  for (const w of alvos) {
    const linha = { arquivo: `${nome}-${w}`, dimensoes: `${w} x ${Math.round((H * w) / W)}` };
    await Promise.all(
      formatos.map(async ([ext, aplicar]) => {
        const saida = path.join(DESTINO, `${nome}-${w}.${ext}`);
        if (!(await atualizado(saida, mtimeMs))) {
          let base = sharp(arquivo).autoOrient();
          if (corte) base = base.extract(corte);
          base = base.resize({ width: w, withoutEnlargement: true });
          await aplicar(base, qualidade).toFile(saida);
        }
        linha[ext === 'png' ? 'jpg' : ext] = (await stat(saida)).size;
      }),
    );
    relatorio.push(linha);
  }
}

async function gerarGrao() {
  const arquivo = path.join(ORIGEM, 'grain.png');
  const saida = path.join(DESTINO, 'grain.webp');
  if (!(await atualizado(saida, (await stat(arquivo)).mtimeMs))) {
    await sharp(arquivo).webp({ lossless: true, effort: 6 }).toFile(saida);
  }
  relatorio.push({ arquivo: 'grain', dimensoes: '180 x 180', webp: (await stat(saida)).size });
}

function nomeDoPrint(arquivo) {
  const nome = path.parse(arquivo).name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return nome.startsWith('print-') ? nome : 'print-' + nome;
}

async function listarPrints() {
  try {
    return (await readdir(PRINTS)).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f));
  } catch {
    return [];
  }
}

const kb = (bytes) => (bytes ? (bytes / 1024).toFixed(1).padStart(7) : '      -');

const inicio = Date.now();
await mkdir(DESTINO, { recursive: true });

// O original pode ser PNG ou JPG.
async function original(nome) {
  for (const ext of ['png', 'jpg', 'jpeg']) {
    const arq = path.join(ORIGEM, `${nome}.${ext}`);
    try { await stat(arq); return arq; } catch {}
  }
  throw new Error(`Original de ${nome} não encontrado em assets/img (png ou jpg).`);
}
// Mesa do palco: a parede azul da foto original vira vinho. Só os tons azuis mudam (matiz entre ~170 e ~285
// graus, com transição suave nas pontas); a mesa, o abajur e a poltrona (matizes quentes, de 0 a 40 graus) ficam
// como estão. Cada pixel azul ganha o matiz 348 (vinho, entre o #38000E e o #BB003D da página), 85% da saturação
// e 70% do brilho: no mesmo brilho, o vermelho parece mais claro que o azul. Só refaz se o original mudar.
function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx];
}
function rgb(h, s, v) {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}
const rampa = (a, b, x) => Math.min(1, Math.max(0, (x - a) / (b - a)));
async function gerarMesaVinho() {
  const origem = path.join(ORIGEM, 'oferta-mesa.png');
  const saida = path.join(ORIGEM, 'oferta-mesa-vinho.png');
  if (await atualizado(saida, (await stat(origem)).mtimeMs)) return;
  const { data, info } = await sharp(origem).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const [h, s, v] = hsv(r, g, b);
    const peso = rampa(170, 195, h) * (1 - rampa(255, 285, h));
    if (peso <= 0) continue;
    const [nr, ng, nb] = rgb(348, Math.min(1, s * 0.85), v * 0.7);
    out[i] = Math.round((r + (nr - r) * peso) * 255);
    out[i + 1] = Math.round((g + (ng - g) * peso) * 255);
    out[i + 2] = Math.round((b + (nb - b) * peso) * 255);
  }
  await sharp(out, { raw: info }).png({ compressionLevel: 9 }).toFile(saida);
}

// Foto do Marcello (autor.png, a mesma do Desprezado): o fundo do estúdio é azul, mas o blazer também é azul
// (marinho), então o matiz sozinho levaria a roupa junto. Separação:
// 1. A parede é um azul quase puro (saturação acima de 0,9); o blazer, um marinho apagado (0,4 a 0,64). Os pixels
//    azuis com saturação alta marcam a parede.
// 2. Essa marcação vira uma máscara contínua: fecha as listras do painel da parede e tira os brilhos soltos das
//    dobras do paletó (fechamento e abertura por desfoque e limiar), com a borda suavizada em 1,5 px.
// 3. Onde o fundo desfocado tem a mesma cor do blazer, polígonos medidos na foto (1122x1402) marcam o fundo: o
//    canto de baixo à direita (a máscara automática fica desligada ali, porque pegava a borda da manga), o vão
//    entre a mão e o corpo e a fresta entre o corpo e a manga direita.
// Dentro da máscara, todo tom azul vai para o mesmo vinho da mesa (matiz 348, 85% da saturação, 70% do brilho).
// A pele, o cabelo, a barba, o blazer, a camiseta, a poltrona e o abajur ficam como estão. Com outra foto, meça
// de novo os polígonos. Só refaz se o original mudar.
const AUTOR_FUNDO = [
  // canto de baixo à direita, por fora da manga e da barra do paletó
  [[1122, 1026], [1110, 1050], [1082, 1100], [1067, 1150], [1048, 1200], [1023, 1250], [1004, 1300], [998, 1350], [996, 1402], [1122, 1402]],
  // vão entre a mão e o corpo (a parede aparece embaixo do braço esquerdo da foto)
  [[300, 820], [312, 862], [319, 900], [305, 894], [284, 873], [264, 851]],
  // fresta entre o corpo e a manga direita da foto
  [[933, 896], [947, 894], [957, 960], [953, 1014], [944, 1008], [935, 942]],
];
const AUTOR_SEM_AUTOMATICA = { x: 880, y: 1000 };
function dentro(x, y, pol) {
  let d = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i], [xj, yj] = pol[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
}
async function gerarAutorVinho() {
  const origem = path.join(ORIGEM, 'autor.png');
  const saida = path.join(ORIGEM, 'autor-vinho.png');
  if (await atualizado(saida, (await stat(origem)).mtimeMs)) return;
  const { data, info } = await sharp(origem).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;
  const mono = { raw: { width: W, height: H, channels: 1 } };
  const azul = new Float32Array(N);
  let parede = Buffer.alloc(N);
  for (let i = 0, p = 0; p < N; i += 3, p++) {
    const [h, s] = hsv(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
    azul[p] = rampa(170, 195, h) * (1 - rampa(255, 285, h));
    parede[p] = azul[p] * rampa(0.62, 0.82, s) > 0.5 ? 255 : 0;
  }
  // Dilatar e erodir por desfoque e limiar (limiar baixo dilata, alto erode).
  const morf = async (buf, sigma, limiar) => {
    const b = await sharp(buf, mono).blur(sigma).extractChannel(0).raw().toBuffer();
    const o = Buffer.alloc(N);
    for (let p = 0; p < N; p++) o[p] = b[p] > limiar ? 255 : 0;
    return o;
  };
  parede = await morf(parede, 3, 25);
  parede = await morf(parede, 3, 230);
  parede = await morf(parede, 8, 230);
  parede = await morf(parede, 8, 25);
  for (let y = AUTOR_SEM_AUTOMATICA.y; y < H; y++) for (let x = AUTOR_SEM_AUTOMATICA.x; x < W; x++) parede[y * W + x] = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (AUTOR_FUNDO.some((pol) => dentro(x + 0.5, y + 0.5, pol))) parede[y * W + x] = 255;
  }
  const mascara = await sharp(parede, mono).blur(1.5).extractChannel(0).raw().toBuffer();
  const out = Buffer.from(data);
  for (let i = 0, p = 0; p < N; i += 3, p++) {
    const peso = azul[p] * (mascara[p] / 255);
    if (peso <= 0) continue;
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const [, s, v] = hsv(r, g, b);
    const [nr, ng, nb] = rgb(348, Math.min(1, s * 0.85), v * 0.7);
    out[i] = Math.round((r + (nr - r) * peso) * 255);
    out[i + 1] = Math.round((g + (ng - g) * peso) * 255);
    out[i + 2] = Math.round((b + (nb - b) * peso) * 255);
  }
  await sharp(out, { raw: info }).png({ compressionLevel: 9 }).toFile(saida);
}

await gerarMesaVinho();
await gerarAutorVinho();
for (const [nome, larguras] of Object.entries(LARGURAS)) {
  const qualidade = HEROS.has(nome) ? HERO : CAPAS.has(nome) ? CAPA : nome === 'autor-vinho' ? RETRATO : FOTO;
  await gerar(await original(nome), nome, larguras, qualidade);
}
for (const arquivo of await listarPrints()) {
  await gerar(path.join(PRINTS, arquivo), nomeDoPrint(arquivo), LARGURAS_PRINT, TEXTO);
}
await gerarGrao();

console.log('\narquivo                  dimensões       AVIF KB  WebP KB   JPG KB');
for (const l of relatorio) {
  console.log(`${l.arquivo.padEnd(24)} ${l.dimensoes.padEnd(13)} ${kb(l.avif)}  ${kb(l.webp)}  ${kb(l.jpg)}`);
}
console.log(`\n${relatorio.length} itens em assets/img/opt, ${((Date.now() - inicio) / 1000).toFixed(1)} s`);
