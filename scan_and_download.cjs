const fs = require('fs');
const path = require('path');

const brands = [
  {
    brandKey: 'stem-c',
    brandName: 'Stem C',
    subfolders: [
      { name: 'Stem C BB Cream', id: '1GrVXwzkTteWKnHddvh74Syv8lkBacZvV' },
      { name: 'Stem C Revitalizing Cream', id: '18UgROLJMgcoSDVRw3cTlWjRNBe4ajd7i' },
      { name: 'Stem C Sunblock', id: '1FaVgESRIyiHj96j5J4X22MucO0Gx4dij' },
      { name: 'Stem C Toner', id: '1DlYeo0_H9G9a5LaU8ng_c-xhiMCPmnKc' }
    ]
  },
  {
    brandKey: 'neuraderm',
    brandName: 'Neuraderm',
    subfolders: [
      { name: 'Calming Foam Cleansing', id: '1iLctAmJTWurM6c5FkFgbDCu5xYIZST1H' },
      { name: 'Calming mist', id: '1zl-vIq1WuBBBmO48ZZLvYOucAB5FgQG2' },
      { name: 'Coretime Ampoule', id: '1ox2OFfhKaNT5l9PDT2VvAvOdaINIAqoH' },
      { name: 'Deep Calming Mask', id: '15pwy7ZuiYgK8rRf-zQp854N7Ycd-kVAL' },
      { name: 'Intensive Suncream', id: '1Zlqn56t1sRx70TZsMTj6jxcJ2JVz9HlE' },
      { name: 'MD Cream', id: '1d2zatx6cQ2_d3YnXTeO--onPgs77zm_K' },
      { name: 'Neuro Lacto Serum', id: '1EQxBcRH4R_JcNZGIw0DfWMkEhmcdj-X-' },
      { name: 'Neuro Lacto Toner', id: '1i8Y9O05gO7JTVIwCsE_z0jD9TTiXryCg' }
    ]
  },
  {
    brandKey: 'dr-bargo',
    brandName: 'Dr.Bargo',
    subfolders: [
      { name: 'Dr.BARGO Emulsion', id: '18_rRYJIvkn0PaRPSVQbkrQJX3rLerYW5' },
      { name: 'Dr.BARGO Foam Cleansing', id: '1FVk3IrQYq6iBuS38LLwqHIQMLwoaAtfs' },
      { name: 'Dr.BARGO Serum', id: '1P52Xr9YJ3COlSCJKFz10Kv9INcvgtLFf' },
      { name: 'Dr.BARGO Toner', id: '1m8REWFnhvEzd1vhdXSjPAjQgsz_4uPfZ' }
    ]
  }
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchFolderItems(folderId) {
  const url = `https://drive.google.com/drive/folders/${folderId}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const m = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
    if (!m) return [];
    const raw = m[1].replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
                    .replace(/\\\//g, '/');
    const data = JSON.parse(raw);
    const items = data[0] || [];
    return items.map(it => ({
      id: it[0],
      name: it[2],
      mime: it[3]
    }));
  } catch (err) {
    console.error(`Error fetching folder ${folderId}:`, err.message);
    return [];
  }
}

async function downloadFile(fileId, destPath) {
  // Try lh3.googleusercontent.com/d/<id> first (fast direct image)
  const urls = [
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        if (buffer.byteLength > 1000) { // avoid tiny html error redirects
          fs.writeFileSync(destPath, Buffer.from(buffer));
          return true;
        }
      }
    } catch (e) {
      // try next
    }
  }
  return false;
}

async function run() {
  const catalogManifest = {};

  for (const b of brands) {
    console.log(`\n==================================================`);
    console.log(`PROCESSING BRAND: ${b.brandName} (${b.brandKey})`);
    catalogManifest[b.brandKey] = [];

    const dirAssets = path.join('d:/Bevibe/assets/images', b.brandKey);
    const dirPublic = path.join('d:/Bevibe/public/assets/images', b.brandKey);
    fs.mkdirSync(dirAssets, { recursive: true });
    fs.mkdirSync(dirPublic, { recursive: true });

    for (const sf of b.subfolders) {
      console.log(`\n--> Checking Subfolder: "${sf.name}" (ID: ${sf.id})`);
      const items = await fetchFolderItems(sf.id);
      console.log(`    Found ${items.length} items:`, items.map(i => i.name));

      const productRecord = {
        folderName: sf.name,
        folderId: sf.id,
        files: []
      };

      // Download images
      for (const item of items) {
        if (item.mime && (item.mime.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(item.name))) {
          // Clean file name
          const safeName = item.name.replace(/[^a-zA-Z0-9_\-\.]/g, '_').toLowerCase();
          const targetPath1 = path.join(dirAssets, safeName);
          const targetPath2 = path.join(dirPublic, safeName);

          console.log(`    Downloading "${item.name}" (ID: ${item.id}) -> ${safeName}...`);
          const ok = await downloadFile(item.id, targetPath1);
          if (ok) {
            fs.copyFileSync(targetPath1, targetPath2);
            console.log(`    ✓ Saved to ${safeName} (${fs.statSync(targetPath1).size} bytes)`);
            productRecord.files.push({
              name: item.name,
              id: item.id,
              localPath: `/assets/images/${b.brandKey}/${safeName}`
            });
          } else {
            console.log(`    ✗ Failed to download ${item.name}`);
          }
        } else {
          productRecord.files.push({
            name: item.name,
            id: item.id,
            mime: item.mime
          });
        }
        await sleep(300);
      }

      catalogManifest[b.brandKey].push(productRecord);
      await sleep(500);
    }
  }

  fs.writeFileSync('d:/Bevibe/catalog_drive_manifest.json', JSON.stringify(catalogManifest, null, 2), 'utf8');
  console.log('\nManifest saved to d:/Bevibe/catalog_drive_manifest.json');
}

run();
