const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../node_modules/html2canvas/dist/html2canvas.esm.js'),
  path.join(__dirname, '../node_modules/html2canvas/dist/html2canvas.js'),
  path.join(__dirname, '../node_modules/html2canvas/dist/lib/css/types/color.js')
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('throw new Error("Attempting to parse an unsupported color function')) {
      content = content.replace(
        /if\s*\(\s*typeof colorFunction\s*===\s*'undefined'\s*\)\s*\{\s*throw new Error\("Attempting to parse an unsupported color function[^}]*\}/g,
        "if (typeof colorFunction === 'undefined') { return 0; }"
      );
      fs.writeFileSync(file, content, 'utf8');
      console.log('Patched', file);
    }
  }
});
