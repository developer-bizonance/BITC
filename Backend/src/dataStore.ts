import fs from "fs";
import path from "path";

// Use __dirname which works in tsx's CJS mode
// This file is at backend/src/dataStore.ts, so data dir is at backend/src/data/
const DATA_DIR = path.join(__dirname, "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}


/**
 * Read data from a JSON file in the data directory.
 * Returns an empty array if the file doesn't exist or can't be parsed.
 */
export function readJsonDb<T = any>(fileName: string): T[] {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`[dataStore] File not found: ${filePath}`);
      return [];
    }
    let raw = fs.readFileSync(filePath, "utf-8");
    // Strip UTF-8 BOM if present (PowerShell adds this)
    if (raw.charCodeAt(0) === 0xFEFF) {
      raw = raw.slice(1);
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[dataStore] Error reading ${fileName}:`, err);
    return [];
  }
}

/**
 * Write data to a JSON file in the data directory.
 */
export function writeJsonDb<T = any>(fileName: string, data: T[]): void {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[dataStore] Error writing ${fileName}:`, err);
  }
}
