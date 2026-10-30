const fs = require('fs');

const path1 = 'C:/Users/Tuyet Mai/.gemini/antigravity-ide/brain/ebd951aa-8e7f-4415-a832-e524e863d146/.system_generated/steps/556/content.md';
const content = fs.readFileSync(path1, 'utf8');

console.log('Total content length:', content.length);

// Search for AF_initDataCallback or any script with data
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  scriptIdx++;
  const s = match[1];
  if (s.includes('AF_initDataCallback') || s.includes('key:') || s.includes('ds:') || s.includes('drive_fe') || s.includes('Steam') || s.includes('Folder') || s.includes('items') || s.length > 500) {
    console.log(`Script #${scriptIdx} length:`, s.length, 'preview:', s.substring(0, 300));
  }
}
