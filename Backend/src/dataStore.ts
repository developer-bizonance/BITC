import fs from "fs";
import path from "path";
import prisma from "./lib/prisma.js";

const DATA_DIR = path.join(__dirname, "data");

// In-memory cache for fast access
const memoryCache = new Map<string, any[]>();

/**
 * Candidate file paths for finding JSON seed data in dev/prod
 */
function getCandidatePaths(fileName: string): string[] {
  return [
    path.join(__dirname, "data", fileName),
    path.join(__dirname, "../src/data", fileName),
    path.join(__dirname, "../../src/data", fileName),
    path.join(process.cwd(), "src/data", fileName),
    path.join(process.cwd(), "Backend/src/data", fileName),
    path.join(process.cwd(), "data", fileName),
  ];
}

/**
 * Read raw data from local JSON file
 */
function readFromFile<T = any>(fileName: string): T[] {
  try {
    const candidatePaths = getCandidatePaths(fileName);
    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath)) {
        let raw = fs.readFileSync(filePath, "utf-8");
        if (raw.charCodeAt(0) === 0xfeff) {
          raw = raw.slice(1);
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
    return [];
  } catch (err) {
    return [];
  }
}

/**
 * Async read: checks Neon PostgreSQL CmsData table first.
 * If found, returns DB data.
 * If not, seeds from bundled JSON file, stores into DB, and returns.
 */
export async function readJsonDbAsync<T = any>(fileName: string): Promise<T[]> {
  try {
    const dbRecord = await prisma.cmsData.findUnique({
      where: { key: fileName },
    });
    if (dbRecord && dbRecord.data) {
      const data = Array.isArray(dbRecord.data) ? (dbRecord.data as T[]) : (dbRecord.data as any);
      if (Array.isArray(data) && data.length > 0) {
        memoryCache.set(fileName, data);
        return data;
      }
    }

    // Seed from local file into DB
    const fileData = readFromFile<T>(fileName);
    if (fileData.length > 0) {
      try {
        await prisma.cmsData.upsert({
          where: { key: fileName },
          update: { data: fileData as any },
          create: { key: fileName, data: fileData as any },
        });
      } catch (saveErr) {
        console.warn(`[dataStore] Could not seed ${fileName} to DB:`, saveErr);
      }
    }
    memoryCache.set(fileName, fileData);
    return fileData;
  } catch (err) {
    console.warn(`[dataStore] Error fetching ${fileName} from DB, fallback to cache/file:`, err);
    if (memoryCache.has(fileName)) {
      return memoryCache.get(fileName)!;
    }
    const fileData = readFromFile<T>(fileName);
    memoryCache.set(fileName, fileData);
    return fileData;
  }
}

/**
 * Async write: writes to Neon PostgreSQL CmsData table and updates cache & local file.
 */
export async function writeJsonDbAsync<T = any>(fileName: string, data: T[]): Promise<void> {
  memoryCache.set(fileName, data);

  // Try writing to local file (works in dev, ignored on readonly serverless)
  try {
    const candidatePaths = getCandidatePaths(fileName);
    for (const filePath of candidatePaths) {
      const dir = path.dirname(filePath);
      if (fs.existsSync(dir)) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
        break;
      }
    }
  } catch (err) {
    // Read-only filesystem on Vercel is expected
  }

  // Persist to Neon PostgreSQL
  try {
    await prisma.cmsData.upsert({
      where: { key: fileName },
      update: { data: data as any },
      create: { key: fileName, data: data as any },
    });
  } catch (dbErr) {
    console.error(`[dataStore] Failed to persist ${fileName} to DB:`, dbErr);
  }
}

/**
 * Synchronous read wrapper
 */
export function readJsonDb<T = any>(fileName: string): T[] {
  if (memoryCache.has(fileName)) {
    return memoryCache.get(fileName)!;
  }
  const fileData = readFromFile<T>(fileName);
  memoryCache.set(fileName, fileData);
  // Trigger background sync to load/seed DB
  readJsonDbAsync(fileName).catch(() => {});
  return fileData;
}

/**
 * Synchronous write wrapper
 */
export function writeJsonDb<T = any>(fileName: string, data: T[]): void {
  writeJsonDbAsync(fileName, data).catch((err) => {
    console.error(`[dataStore] Background write error for ${fileName}:`, err);
  });
}
