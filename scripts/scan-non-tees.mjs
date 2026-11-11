import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(walk(full));
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const files = walk('src');
const regex = /hoodie|sweatshirt|jacket|shoes|sneaker|jeans|slippers|caps|hats/i;
let count = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (regex.test(l)) {
      console.log(`${file}:${i+1} -> ${l.trim()}`);
      count++;
    }
  });
}
console.log(`Total non-tshirt matches found: ${count}`);

