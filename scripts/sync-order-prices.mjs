/**
 * Copy the price list (assets/js/prices.js) + product names (translations.js) into
 * google-apps-script/Code.gs so the order system always charges the same prices as the website.
 *
 * Usage: npm run sync-prices   (then paste Code.gs into Apps Script and deploy a new version)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { productPrices } = await import(pathToFileURL(path.join(root, 'assets/js/prices.js')).href);
const { brandsData } = await import(pathToFileURL(path.join(root, 'assets/js/translations.js')).href);

const names = {};
brandsData.forEach((b) => b.productsVi.forEach((p) => { names[p.id] = p.name; }));

const missing = Object.keys(productPrices).filter((id) => !names[id]);
if (missing.length) {
  console.error('prices.js has ids that are not products in translations.js:', missing.join(', '));
  process.exit(1);
}

const lines = Object.entries(productPrices).map(([id, p]) =>
  `  ${JSON.stringify(id)}: { "name": ${JSON.stringify(names[id])}, "unit": ${JSON.stringify(p.unit)}, "price": ${Number(p.price)} }`);
const block = `const PRICES = {\n${lines.join(',\n')}\n};`;

const gsPath = path.join(root, 'google-apps-script/Code.gs');
const src = fs.readFileSync(gsPath, 'utf8');
const re = /(\/\/ <PRICES:START>[^\n]*\n)[\s\S]*?(\n\/\/ <PRICES:END>)/;
if (!re.test(src)) {
  console.error('PRICES markers not found in Code.gs');
  process.exit(1);
}
fs.writeFileSync(gsPath, src.replace(re, `$1${block}$2`));
console.log(`Synced ${lines.length} prices into google-apps-script/Code.gs`);
