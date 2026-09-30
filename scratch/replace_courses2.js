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
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace >Course< with >Certification<
  newContent = newContent.replace(/>([^<]*)\bCourse\b([^<]*)</g, '>$1Certification$2<');
  newContent = newContent.replace(/>([^<]*)\bcourse\b([^<]*)</g, '>$1certification$2<');
  newContent = newContent.replace(/>([^<]*)\bCourses\b([^<]*)</g, '>$1Certifications$2<');
  newContent = newContent.replace(/>([^<]*)\bcourses\b([^<]*)</g, '>$1certifications$2<');

  // Replace "Course" in specific strings (like alt="", title="", placeholder="")
  newContent = newContent.replace(/(alt|title|placeholder|description)="([^"]*)\bCourse\b([^"]*)"/gi, (match, p1, p2, p3) => {
    return `${p1}="${p2}Certification${p3}"`;
  });
  newContent = newContent.replace(/(alt|title|placeholder|description)="([^"]*)\bCourses\b([^"]*)"/gi, (match, p1, p2, p3) => {
    return `${p1}="${p2}Certifications${p3}"`;
  });

  // Just to catch multiple occurrences in the same text node
  newContent = newContent.replace(/>([^<]*)\bCourse\b([^<]*)</g, '>$1Certification$2<');
  newContent = newContent.replace(/>([^<]*)\bcourse\b([^<]*)</g, '>$1certification$2<');
  newContent = newContent.replace(/>([^<]*)\bCourses\b([^<]*)</g, '>$1Certifications$2<');
  newContent = newContent.replace(/>([^<]*)\bcourses\b([^<]*)</g, '>$1certifications$2<');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Changed ${changedFiles} files.`);
