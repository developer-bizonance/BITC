const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = [];

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // We look for className="..." containing both font-bold and some button-like indicators
    // Or we just replace font-bold on lines that contain "<button" or "<Link"
    
    // Instead of complex parsing, let's just replace font-bold with font-medium on any line that contains
    // "bg-" AND ("rounded-" OR "px-") AND "font-bold" inside a className string.
    
    let lines = content.split('\n');
    let changed = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.includes('font-bold')) {
        // Is it a button or link?
        if (
          line.includes('button') || 
          line.includes('Link') || 
          (line.includes('rounded-full') || line.includes('rounded-xl') || line.includes('rounded-md')) && line.includes('bg-')
        ) {
          // Double check it's likely a button class
          lines[i] = line.replace(/\bfont-bold\b/g, 'font-medium');
          changed = true;
        }
      }
      
      // Also catch "text-slate-900" to "text-slate-700" if it was changed to font-medium
      if (changed && lines[i] !== line && lines[i].includes('bg-gray-100') && lines[i].includes('text-slate-900')) {
        lines[i] = lines[i].replace(/text-slate-900/g, 'text-slate-700');
      }
    }
    
    if (changed) {
      let newContent = lines.join('\n');
      if (newContent !== original) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        modifiedFiles.push(filePath);
      }
    }
  }
});

console.log('Modified files:', modifiedFiles.length);
modifiedFiles.forEach(f => console.log(' - ' + f));
