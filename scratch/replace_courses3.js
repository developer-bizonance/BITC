const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('Frontend/src');
let changedFiles = 0;

files.forEach(file => {
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    let oldLine = lines[i];
    
    // Skip imports
    if (oldLine.startsWith('import ') || oldLine.trim().startsWith('//')) continue;
    
    // We only want to replace visible text.
    // 1. Text between > and <
    lines[i] = lines[i].replace(/>([^<\n]*)\bCourse\b([^<\n]*)</g, '>$1Certification$2<');
    lines[i] = lines[i].replace(/>([^<\n]*)\bcourse\b([^<\n]*)</g, '>$1certification$2<');
    lines[i] = lines[i].replace(/>([^<\n]*)\bCourses\b([^<\n]*)</g, '>$1Certifications$2<');
    lines[i] = lines[i].replace(/>([^<\n]*)\bcourses\b([^<\n]*)</g, '>$1certifications$2<');

    // 2. Placeholder, alt, title strings
    lines[i] = lines[i].replace(/(alt|title|placeholder|description)="([^"]*)\bCourse\b([^"]*)"/g, '$1="$2Certification$3"');
    lines[i] = lines[i].replace(/(alt|title|placeholder|description)="([^"]*)\bcourse\b([^"]*)"/g, '$1="$2certification$3"');
    lines[i] = lines[i].replace(/(alt|title|placeholder|description)="([^"]*)\bCourses\b([^"]*)"/g, '$1="$2Certifications$3"');
    lines[i] = lines[i].replace(/(alt|title|placeholder|description)="([^"]*)\bcourses\b([^"]*)"/g, '$1="$2certifications$3"');

    // 3. Text in string literals that are clearly UI text (e.g. title: "Our Courses")
    // Let's only do this safely
    lines[i] = lines[i].replace(/title:\s*"([^"]*)\bCourse\b([^"]*)"/g, 'title: "$1Certification$2"');
    lines[i] = lines[i].replace(/title:\s*"([^"]*)\bcourse\b([^"]*)"/g, 'title: "$1certification$2"');
    lines[i] = lines[i].replace(/title:\s*"([^"]*)\bCourses\b([^"]*)"/g, 'title: "$1Certifications$2"');
    lines[i] = lines[i].replace(/title:\s*"([^"]*)\bcourses\b([^"]*)"/g, 'title: "$1certifications$2"');
    
    lines[i] = lines[i].replace(/name:\s*'([^']*)\bCourses\b([^']*)'/g, 'name: \'$1Certifications$2\'');

    if (oldLine !== lines[i]) {
      changed = true;
      console.log(`[${file}:${i+1}] ${oldLine.trim()}  =>  ${lines[i].trim()}`);
    }
  }

  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    changedFiles++;
  }
});

console.log(`Changed ${changedFiles} files.`);
