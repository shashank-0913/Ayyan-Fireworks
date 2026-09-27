const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/lib/initialData.ts');

const scriptContent = fs.readFileSync(path.resolve(__dirname, 'generate_initial_data.js'), 'utf-8');
// Extract the template string
const match = scriptContent.match(/const scriptContent = `([\s\S]*?)`;\s*fs\.writeFileSync/);
if (match && match[1]) {
  fs.writeFileSync(targetPath, match[1], 'utf-8');
  console.log('Successfully written full master inventory to src/lib/initialData.ts');
} else {
  console.error('Failed to match scriptContent');
}
