const fs = require('fs');

const folders = [
  { name: 'Stem C', path: 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/556/content.md' },
  { name: 'Neuraderm', path: 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/565/content.md' },
  { name: 'Dr.Bargo', path: 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/567/content.md' }
];

folders.forEach(f => {
  console.log('========================================================');
  console.log('FOLDER:', f.name);
  const content = fs.readFileSync(f.path, 'utf8');

  // Find window['_DRIVE_ivd']
  const m = content.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
  if (!m) {
    console.log('No _DRIVE_ivd found!');
    return;
  }
  
  // Unescape hex \x5b etc.
  const raw = m[1];
  const unescaped = raw.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
                       .replace(/\\\//g, '/');
  
  try {
    const data = JSON.parse(unescaped);
    // data is an array of items
    const items = data[0] || [];
    console.log(`Found ${items.length} items:`);
    items.forEach((it, idx) => {
      const id = it[0];
      const name = it[2];
      const mime = it[3];
      console.log(`  [${idx + 1}] ID: ${id} | Name: "${name}" | Type: ${mime}`);
    });
  } catch (err) {
    console.log('JSON parse error:', err.message);
    console.log('Sample raw unescaped:', unescaped.substring(0, 500));
  }
});
