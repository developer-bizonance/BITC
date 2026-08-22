const fs = require('fs');
const path = require('path');

function replaceInFile(p, regex, replacement) {
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  const newContent = content.replace(regex, replacement);
  if (content !== newContent) {
    fs.writeFileSync(p, newContent);
    console.log('Updated', p);
  }
}

function replaceInDir(dir, regex, replacement) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, regex, replacement);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath, regex, replacement);
    }
  });
}

replaceInDir('Frontend/src/components', /fetch\("\/api\//g, 'fetch("https://bitc-backend-theta.vercel.app/api/');
replaceInDir('Frontend/src/components', /fetch\(`\/api\//g, 'fetch(`https://bitc-backend-theta.vercel.app/api/');
