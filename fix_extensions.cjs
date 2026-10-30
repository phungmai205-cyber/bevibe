const fs = require('fs');
const path = require('path');

function getExt(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return '.png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return '.jpg';
  if (buffer.toString('utf8', 0, 4) === 'RIFF' && buffer.toString('utf8', 8, 12) === 'WEBP') return '.webp';
  return null;
}

const folders = ['stem-c', 'neuraderm', 'dr-bargo'];
folders.forEach(brand => {
  ['d:/Bevibe/assets/images', 'd:/Bevibe/public/assets/images'].forEach(baseDir => {
    const dir = path.join(baseDir, brand);
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (!path.extname(f)) {
        const buf = fs.readFileSync(full);
        const ext = getExt(buf);
        if (ext) {
          const newName = f + ext;
          fs.copyFileSync(full, path.join(dir, newName));
          console.log(`Added extension for ${brand}/${f} -> ${newName}`);
        }
      }
    }
  });
});
