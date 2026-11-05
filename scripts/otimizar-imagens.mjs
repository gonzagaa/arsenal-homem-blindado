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
  // Hero: o fundo com os três livros. Celular e tablet até 1290 (iPhone com densidade 3, tablet com 2); desktop até
  // 3200 (a imagem é ampliada pelos livros: até ~117% da tela em 2560). A foto do Marcello saiu do hero; o original
  // hero-desktop.png continua em assets/img, porque o og.jpg é gerado dele (scripts/gerar-og.mjs).
  'hero-livros-mobile': [640, 828, 1080, 1290],
  'hero-livros-desktop': [1280, 1600, 1920, 2560, 3200],
  'autor': [400, 640, 900],
  // Capa oficial dourada do livro (1024x1536, a maior versão fica com 1024): até 280px na oferta no desktop
  // (2x) e 44% da tela no celular.
  'capa-oficial-dourada': [360, 540, 800, 1080],
  // Os dois livros dos lados da mesa (1024x1536): ~224px no desktop (2x) e 30vw no celular.
  'capa-jogo-sujo': [360, 540, 800, 1080],
  'capa-engolir-calado': [360, 540, 800, 1080],
  // Mesa da oferta: 676px no celular, limitada a 2x (1360); até 1600px no desktop.
  'oferta-mesa': [960, 1280, 1360, 1672],
};
// Cards da #transformacao: fotos sem texto, 1536x1024, em assets/img/cards/card-0N-nosso.jpg (o número, o título
// e a linha são texto real na página). A foto cobre o card: até 1023px o card é 4:5 e a foto aparece com ~1,9
// vez a largura do card (~610px em 390px); a partir de 1024px, 4:3 e ~1,1 vez (~570px em 1440px, 1x e 2x). No celular,
// as imagens fora o hero ficam limitadas a 2x (o sizes encolhe com densidade alta): ~1215px em 390px, daí o 1280.
// Sem o original, o script avisa e segue.
const NOSSOS = ['card-01-nosso', 'card-02-nosso', 'card-03-nosso', 'card-04-nosso'];
const LARGURAS_NOSSO = [480, 768, 1152, 1280, 1536];
// Prints: ~250px na fileira do celular, ~350px no mosaico do desktop e até 520px no lightbox.
// Os originais têm ~737px: 737 é o teto (nunca amplia; a maior versão fica na largura do original).
const LARGURAS_PRINT = [360, 540, 737];

// AVIF em 10 bits: os degradês azul-escuros das fotos fazem faixas em 8 bits.
const FOTO = {
  avif: { quality: 50, effort: 6, bitdepth: 10 },
  webp: { quality: 78, effort: 6, smartSubsample: true },
  jpg: { quality: 78, mozjpeg: true, progressive: true },
};
// Retratos do Marcello: abaixo disso a pele, a barba e o tricô do suéter ficam lisos.
const RETRATO = {
  avif: { quality: 64, effort: 6, bitdepth: 10 },
  webp: { quality: 84, effort: 6, smartSubsample: true },
  jpg: { quality: 84, mozjpeg: true, progressive: true },
};
const RETRATOS = new Set(['autor', 'capa-oficial-dourada', 'capa-jogo-sujo', 'capa-engolir-calado']);
// Hero: a primeira coisa que se vê. AVIF no topo da faixa 62 a 68 (o 1290 do celular fica com ~135 KB).
const HERO = {
  avif: { quality: 68, effort: 6, bitdepth: 10 },
  webp: { quality: 82, effort: 6, smartSubsample: true },
  jpg: { quality: 82, mozjpeg: true, progressive: true },
};
const HEROS = new Set(['hero-livros-mobile', 'hero-livros-desktop']);
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
// Imagens com transparência: AVIF e WebP com alfa e PNG de reserva no lugar do JPG.
const FORMATOS_ALFA = [
  ['avif', (s, q) => s.avif(q.avif)],
  ['webp', (s, q) => s.webp(q.webp)],
  ['png', (s, q) => s.png(q.png)],
];
const PRODUTO = {
  avif: { quality: 64, effort: 6, bitdepth: 10 },
  webp: { quality: 84, effort: 6, alphaQuality: 90 },
  png: { compressionLevel: 9, palette: true, quality: 90, effort: 10 },
};

// Página de links (links.html, a raiz do domínio): originais em assets/img/links/.
// Foto de perfil (a atual do Instagram dele): 102px na página (120 e 240 cobrem 1x e 2x; 22px no celular desenhado do bloco do WhatsApp) e 480 para o
// og:image. Foto do bloco 1: ~450px de largura dentro do bloco (480 e 960); o fundo desfocado do desktop usa a de
// 480. Produto do Arsenal (PNG com transparência): 236px no bloco (240 e 480).
const LINKS = [
  ['marcello-perfil.jpg', 'links-perfil', [120, 240, 480], RETRATO, FORMATOS],
  ['marcello-fundo.jpg', 'links-fundo', [480, 960], RETRATO, FORMATOS],
  ['arsenal-produto.png', 'links-arsenal', [240, 480], PRODUTO, FORMATOS_ALFA],
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
for (const [nome, larguras] of Object.entries(LARGURAS)) {
  await gerar(await original(nome), nome, larguras, HEROS.has(nome) ? HERO : RETRATOS.has(nome) ? RETRATO : FOTO);
}
for (const nome of NOSSOS) {
  const arq = path.join(ORIGEM, 'cards', `${nome}.jpg`);
  try { await stat(arq); } catch { console.log(`aviso: cards/${nome}.jpg não encontrado (pulado)`); continue; }
  await gerar(arq, nome, LARGURAS_NOSSO, FOTO);
}
for (const arquivo of await listarPrints()) {
  await gerar(path.join(PRINTS, arquivo), nomeDoPrint(arquivo), LARGURAS_PRINT, TEXTO);
}
for (const [arquivo, nome, larguras, qualidade, formatos] of LINKS) {
  await gerar(path.join(ORIGEM, 'links', arquivo), nome, larguras, qualidade, undefined, formatos);
}
await gerarGrao();

console.log('\narquivo                  dimensões       AVIF KB  WebP KB   JPG KB (PNG no produto)');
for (const l of relatorio) {
  console.log(`${l.arquivo.padEnd(24)} ${l.dimensoes.padEnd(13)} ${kb(l.avif)}  ${kb(l.webp)}  ${kb(l.jpg)}`);
}
console.log(`\n${relatorio.length} itens em assets/img/opt, ${((Date.now() - inicio) / 1000).toFixed(1)} s`);
