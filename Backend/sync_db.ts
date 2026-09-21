import { readJsonDbAsync, writeJsonDbAsync } from './src/dataStore.js';
import fs from 'fs';
import path from 'path';

async function syncToCloud() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/testimonials.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    
    console.log(`Syncing ${parsedData.length} stories to Neon Cloud DB...`);
    
    await writeJsonDbAsync('testimonials.json', parsedData);
    
    console.log('Successfully synced to cloud database!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to sync:', error);
    process.exit(1);
  }
}

syncToCloud();
