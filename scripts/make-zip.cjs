const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = 'D:\\Bevibe';
const dist = path.join(root, 'dist');
const updateDir = path.join(root, 'temp_update_dir');
const zipOut = path.join(root, 'cap-nhat-bevibe.zip');

if (fs.existsSync(updateDir)) {
  fs.rmSync(updateDir, { recursive: true, force: true });
}
fs.mkdirSync(path.join(updateDir, 'assets'), { recursive: true });

// Copy index.html
fs.copyFileSync(path.join(dist, 'index.html'), path.join(updateDir, 'index.html'));

// Copy all files in dist/assets (only files, skip images/videos subdirs so it stays lightweight)
const assetFiles = fs.readdirSync(path.join(dist, 'assets'), { withFileTypes: true });
for (const f of assetFiles) {
  if (f.isFile()) {
    fs.copyFileSync(path.join(dist, 'assets', f.name), path.join(updateDir, 'assets', f.name));
  }
}

if (fs.existsSync(zipOut)) {
  fs.unlinkSync(zipOut);
}

execSync(`tar -a -c -f "${zipOut}" -C "${updateDir}" index.html assets`);
fs.rmSync(updateDir, { recursive: true, force: true });

const stat = fs.statSync(zipOut);
console.log(`ZIP CREATED: ${zipOut} (${(stat.size / 1024).toFixed(2)} KB)`);
