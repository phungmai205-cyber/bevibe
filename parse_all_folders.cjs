const fs = require('fs');

const files = [
  { name: 'Folder 1 (1yMkXVG6w97oTTBWky3f0VSa5DdqXLOta)', path: 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/556/content.md' },
  { name: 'Folder 2 (1fz5plDUOJZP-y8reRi7kyjgufF0WNz4I)', path: 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/565/content.md' },
  { name: 'Folder 3 (14TOiYFghyDHodACjUTtRXN1-WZl2O4SK)', path: 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/567/content.md' }
];

files.forEach(f => {
  console.log('==============================================');
  console.log('ANALYZING:', f.name);
  if (!fs.existsSync(f.path)) {
    console.log('File does not exist:', f.path);
    return;
  }
  const content = fs.readFileSync(f.path, 'utf8');
  
  // Extract Title
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  console.log('Folder Title:', titleMatch ? titleMatch[1] : 'Unknown');

  // Look for Drive file items JSON structure (commonly in window._DRIVE_initData or doclist data)
  // Search for file extensions
  const fileRegex = /([a-zA-Z0-9_\-\s\(\)\.\u00C0-\u024F\u1EA0-\u1EF9]+?\.(?:jpg|jpeg|png|webp|gif|pdf|docx|txt|xlsx|pptx))/gi;
  const foundFiles = content.match(fileRegex) || [];
  const uniqueFiles = [...new Set(foundFiles.map(s => s.trim()))].filter(s => !s.includes('/') && !s.includes('\\') && s.length < 100);
  console.log('Found file names (' + uniqueFiles.length + '):', uniqueFiles.slice(0, 30));

  // Also search for JSON items with ["id", "title", ...]
  const driveItems = [];
  const itemRegex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+?\.(?:jpg|jpeg|png|webp|pdf|docx|txt))"/gi;
  let m;
  while ((m = itemRegex.exec(content)) !== null) {
    driveItems.push({ id: m[1], name: m[2] });
  }
  console.log('Found Drive items with IDs (' + driveItems.length + '):', driveItems.slice(0, 20));
});
