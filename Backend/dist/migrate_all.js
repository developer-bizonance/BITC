"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const routesDir = path_1.default.join(__dirname, 'routes');
const files = [
    'alumni-companies.routes.ts',
    'alumni.routes.ts',
    'blogs.routes.ts',
    'certifications.routes.ts',
    'contact.routes.ts',
    'downloads.routes.ts',
    'employee-testimonials.routes.ts',
    'events.routes.ts',
    'faq.routes.ts',
    'gallery.routes.ts',
    'industry-partners.routes.ts',
    'mentors.routes.ts',
    'partners.routes.ts',
    'testimonials.routes.ts',
    'video-testimonials.routes.ts'
];
for (const file of files) {
    const filePath = path_1.default.join(routesDir, file);
    if (!fs_1.default.existsSync(filePath))
        continue;
    let content = fs_1.default.readFileSync(filePath, 'utf8');
    const moduleMatch = file.match(/([\w-]+)\.routes\.ts$/);
    if (!moduleMatch)
        continue;
    const moduleName = moduleMatch[1];
    const dbNameMatch = content.match(/export let (\w+Db)/);
    if (!dbNameMatch) {
        console.log(`No db found in ${file}`);
        continue;
    }
    const dbName = dbNameMatch[1];
    console.log(`Migrating ${file} - DB: ${dbName}`);
    // Remove the in-memory array (from `export let xxxDb...` up to the first `];` at start of line)
    content = content.replace(new RegExp('export let ' + dbName + '[\\s\\S]*?^];', 'm'), '');
    // Add imports and helpers
    const helpers = `
import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../data/${moduleName}.json");
function getDb(): any[] {
  try { if (!fs.existsSync(dbPath)) return []; return JSON.parse(fs.readFileSync(dbPath, "utf-8")); } catch (e) { return []; }
}
function saveDb(data: any[]) {
  try { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8"); } catch (e) {}
}
`;
    // Add helpers after the first line (usually import express)
    content = content.replace(/(import \{.*?\} from "express";)/, `$1\n${helpers}`);
    // Replace all dbName with getDb()
    content = content.split(dbName).join('getDb()');
    // Fix mutations
    content = content.replace(/getDb\(\)\.unshift\((.*?)\);/g, 'const db = getDb(); db.unshift($1); saveDb(db);');
    content = content.replace(/getDb\(\)\.push\((.*?)\);/g, 'const db = getDb(); db.push($1); saveDb(db);');
    content = content.replace(/getDb\(\)\[index\] = (.*?);/g, 'const db = getDb(); db[index] = $1; saveDb(db);');
    content = content.replace(/getDb\(\) = getDb\(\)\.filter\((.*?)\);/g, 'const db = getDb().filter($1); saveDb(db);');
    content = content.replace(/getDb\(\) = ([a-zA-Z0-9_]+);/g, 'saveDb($1);');
    fs_1.default.writeFileSync(filePath, content, 'utf8');
}
console.log('Migration complete!');
