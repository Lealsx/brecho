// ============================================================
//  COMPRIMIR FOTOS DE UMA PEÇA
//
//  Uso:
//    npm run fotos -- <pasta-com-as-3-fotos> <id-da-peca>
//
//  Exemplo:
//    npm run fotos -- ~/Imagens/jaqueta jaqueta-jeans-90
//
//  Qual foto é qual:
//    - Se os arquivos se chamarem frente.*, costas.* e detalhe.*, usa esses nomes.
//    - Senão, usa a ordem alfabética (no celular = ordem em que você tirou):
//      1ª = frente, 2ª = costas, 3ª = detalhe.
//
//  O que ele faz com cada foto:
//    - Gira certo (fotos de celular às vezes vêm "deitadas")
//    - Corta no formato vertical 4:5, centralizado
//    - Reduz para 1200×1500 pixels
//    - Converte para .webp, baixando a qualidade até ficar abaixo de 300 KB
//    - Remove os dados escondidos da foto (GPS, modelo do celular etc.)
//    - Salva em public/pecas/<id-da-peca>/frente.webp, costas.webp, detalhe.webp
// ============================================================

import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, basename, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const VISTAS = ['frente', 'costas', 'detalhe'];
const LARGURA = 1200;
const ALTURA = 1500;
const LIMITE = 300 * 1024; // 300 KB
const FORMATOS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.avif', '.tif', '.tiff'];

const [pastaEntrada, id] = process.argv.slice(2);

if (!pastaEntrada || !id) {
  console.error('Uso: npm run fotos -- <pasta-com-as-3-fotos> <id-da-peca>');
  console.error('Ex.: npm run fotos -- ~/Imagens/jaqueta jaqueta-jeans-90');
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error(`O id "${id}" é inválido. Use só letras minúsculas, números e hífen (ex.: vestido-azul-midi).`);
  process.exit(1);
}
if (!existsSync(pastaEntrada)) {
  console.error(`A pasta "${pastaEntrada}" não existe.`);
  process.exit(1);
}

// Lista as imagens da pasta
const imagens = readdirSync(pastaEntrada)
  .filter((f) => FORMATOS.includes(extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));

// Decide qual arquivo é frente, costas e detalhe
const porNome = VISTAS.map((v) => imagens.find((f) => basename(f, extname(f)).toLowerCase() === v));
const escolhidas = porNome.every(Boolean) ? porNome : imagens.slice(0, 3);

if (escolhidas.length < 3) {
  console.error(`Achei ${imagens.length} foto(s) em "${pastaEntrada}". Preciso de 3 (frente, costas e detalhe).`);
  process.exit(1);
}
if (imagens.length > 3 && !porNome.every(Boolean)) {
  console.warn(`Aviso: a pasta tem ${imagens.length} fotos; usei só as 3 primeiras em ordem alfabética.`);
}

// Pasta de saída: public/pecas/<id>
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pastaSaida = join(raiz, 'public', 'pecas', id);
mkdirSync(pastaSaida, { recursive: true });

for (const [i, arquivo] of escolhidas.entries()) {
  const destino = join(pastaSaida, `${VISTAS[i]}.webp`);
  const base = sharp(join(pastaEntrada, arquivo))
    .rotate() // usa a orientação salva pelo celular
    .resize(LARGURA, ALTURA, { fit: 'cover', position: 'attention' }); // corta mantendo a parte mais "interessante"

  // Tenta qualidade 82; se passar de 300 KB, vai baixando
  let qualidade = 82;
  let saida = await base.clone().webp({ quality: qualidade }).toBuffer();
  while (saida.length > LIMITE && qualidade > 40) {
    qualidade -= 6;
    saida = await base.clone().webp({ quality: qualidade }).toBuffer();
  }
  await sharp(saida).toFile(destino);

  const kb = Math.round(saida.length / 1024);
  const aviso = saida.length > LIMITE ? '  ⚠ ainda acima de 300 KB (foto com muito detalhe/ruído)' : '';
  console.log(`✓ ${arquivo.padEnd(28)} → ${VISTAS[i]}.webp  (${kb} KB, qualidade ${qualidade})${aviso}`);
}

// Mostra o trecho pronto para colar no pecas.js
console.log(`
Pronto! Em src/pecas.js, use estas fotos na peça "${id}":

    fotos: [
      '/pecas/${id}/frente.webp',
      '/pecas/${id}/costas.webp',
      '/pecas/${id}/detalhe.webp',
    ],
`);
