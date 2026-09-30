const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Regex 1: string literals "Word Word Word"
            const regex1 = /"([A-Z][a-zA-Z0-9]*(\s+[A-Z][a-zA-Z0-9]*){2,})"/g;
            content = content.replace(regex1, (match, p1) => {
                if(p1.includes('BITC') || p1.includes('BIPL') || p1.includes('UI/UX') || p1.includes('AI') || p1.includes('IT')) return match;
                modified = true;
                const words = p1.split(/\s+/);
                const newStr = words.map((w, i) => i === 0 ? w : w.toLowerCase()).join(' ');
                return '"' + newStr + '"';
            });

            // Regex 2: JSX text nodes >Word Word Word<
            const regex2 = />\s*([A-Z][a-zA-Z0-9]*(\s+[A-Z][a-zA-Z0-9]*){2,})\s*</g;
            content = content.replace(regex2, (match, p1) => {
                if(p1.includes('BITC') || p1.includes('BIPL') || p1.includes('UI/UX') || p1.includes('AI') || p1.includes('IT')) return match;
                modified = true;
                const words = p1.split(/\s+/);
                const newStr = words.map((w, i) => i === 0 ? w : w.toLowerCase()).join(' ');
                return match.replace(p1, newStr);
            });

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('d:/BiZONANCE INDIA PVT. LTD/BITC/Frontend/src');
