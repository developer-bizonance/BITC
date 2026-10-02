const fs = require('fs');
const path = require('path');

const dir = 'd:/BiZONANCE INDIA PVT. LTD/BITC/Dashboard/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let original = content;
  
  // Replacements for top-level wrappers:
  
  // 1. bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200
  // regex that finds any wrapper that is exactly this format
  content = content.replace(/className=\"bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200\"/g, 'className=\"bg-transparent p-2 space-y-5 animate-in fade-in duration-200\"');
  
  // 2. bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6
  content = content.replace(/className=\"bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6\"/g, 'className=\"bg-transparent p-2 space-y-6\"');
  
  // 3. bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
  content = content.replace(/className=\"bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden\"/g, 'className=\"bg-transparent overflow-hidden\"');

  // 4. bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center
  content = content.replace(/className=\"bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center\"/g, 'className=\"bg-transparent p-12 text-center\"');

  // 5. bg-white rounded-2xl shadow-2xs border border-slate-200 p-8 text-center
  content = content.replace(/className=\"bg-white rounded-2xl shadow-2xs border border-slate-200 p-8 text-center\"/g, 'className=\"bg-transparent p-8 text-center\"');

  // 6. ContactEntries specific: flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm
  content = content.replace(/className=\"flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm\"/g, 'className=\"flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-transparent p-2\"');
  
  // 7. ContactEntries specific search/filter: flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm
  content = content.replace(/className=\"flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm\"/g, 'className=\"flex flex-col md:flex-row gap-3 bg-transparent p-2\"');
  
  // Let's print replacements
  if (content !== original) {
    console.log('Modified:', f);
    fs.writeFileSync(p, content, 'utf8');
  }
});
