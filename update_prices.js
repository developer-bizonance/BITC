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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.json') || fullPath.endsWith('.prisma')) {
      replaceInFile(fullPath, regex, replacement);
    }
  });
}

replaceInDir('Frontend/src', /₹\d{2},000/g, '₹36,000');
replaceInDir('Backend/src', /₹\d{2},000/g, '₹36,000');

// specifically for the fallback lines like fees: c.fees || "₹30,000"
replaceInDir('Frontend/src', /fees: c\.fees \|\| ".*"/g, 'fees: c.fees || "₹36,000"');

replaceInFile('Backend/prisma/schema.prisma', /@default\("₹\d{2},000"\)/g, '@default("₹36,000")');
replaceInFile('Backend/prisma/schema.prisma', /@default\(\d+\)/g, (match) => {
    // Only replace 30000 or similar
    if (match === '@default(30000)') return '@default(36000)';
    if (match === '@default(28000)') return '@default(36000)';
    return match;
});
