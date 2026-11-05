// Copia o Lenis instalado em scripts/node_modules para assets/js/lenis.min.js,
// com o aviso de licença (MIT) que o arquivo minificado não traz.
//
// Uso, a partir da raiz do projeto:
//   npm install --prefix scripts        baixa a versão registrada no package.json
//   npm run lenis --prefix scripts      copia para assets/js

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const pacote = path.join(aqui, 'node_modules', 'lenis');
const destino = path.join(aqui, '..', 'assets', 'js', 'lenis.min.js');

const { version } = JSON.parse(await readFile(path.join(pacote, 'package.json'), 'utf8'));
const copyright = (await readFile(path.join(pacote, 'LICENSE'), 'utf8')).match(/Copyright[^\n]*/)[0];
const codigo = await readFile(path.join(pacote, 'dist', 'lenis.min.js'), 'utf8');

await mkdir(path.dirname(destino), { recursive: true });
await writeFile(destino, `/*! Lenis ${version} | MIT License | ${copyright} | https://github.com/darkroomengineering/lenis */\n${codigo}`);
console.log(`Lenis ${version} copiado para assets/js/lenis.min.js`);
