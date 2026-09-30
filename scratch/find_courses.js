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

files.forEach(file => {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // Basic heuristics: line contains "course" or "courses"
    if (!line.match(/\b(course|courses|Course|Courses)\b/)) return;
    // Exclude if it's an import, export, interface, type
    if (line.match(/^(import|export|interface|type)\s/)) return;
    // Exclude if it's href, class, src
    if (line.match(/(href|className|src)=/)) return;
    // Exclude if it is using variable like course.title, course.slug
    if (line.match(/course\./)) return;
    // Exclude if it is just variable assignment or arrow function param
    if (line.match(/course =>/)) return;

    // Check if it might be text node or string
    if (line.match(/>[^<]*\b(course|Course|courses|Courses)\b/) || line.match(/["'](.*)\b(course|Course|courses|Courses)\b(.*)["']/)) {
        console.log(file + ':' + (i+1) + ': ' + line.trim());
    }
  });
});
