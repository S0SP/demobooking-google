const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'raw_timezones.txt');
const outputPath = path.join(__dirname, 'timezones.ts');

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const timezones = [];

for (let i = 0; i < lines.length; i += 2) {
  const value = lines[i];
  const label = lines[i+1];
  
  if (value && label) {
    // Generate search terms from value and label
    const terms = new Set();
    
    // Add value parts (e.g., Asia, Kolkata)
    value.split('/').forEach(p => terms.add(p.toLowerCase()));
    
    // Add label parts (e.g., India, Delhi)
    label.replace(/[()]/g, '').split(/[\s,]+/).forEach(p => {
      if (p.length > 1) terms.add(p.toLowerCase());
    });
    
    // Custom common terms
    if (label.includes('India')) terms.add('ist');
    if (label.includes('UK') || label.includes('London')) terms.add('gb');
    if (label.includes('USA') || label.includes('New York') || label.includes('Los Angeles')) terms.add('us');
    if (label.includes('UAE') || label.includes('Dubai')) terms.add('emirates');

    timezones.push({
      value,
      label,
      searchTerms: Array.from(terms)
    });
  }
}

const tsContent = `export interface Timezone {
  value: string;
  label: string;
  searchTerms: string[];
}

export const TIMEZONES: Timezone[] = ${JSON.stringify(timezones, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent);
console.log(`Processed ${timezones.length} timezones.`);
