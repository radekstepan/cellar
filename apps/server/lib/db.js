import { Low } from 'lowdb';
import { FolderAdapter } from './FolderAdapter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', '..', 'data');

const dbCache = new Map();

export async function getDb(token = 'default') {
    if (dbCache.has(token)) {
        return dbCache.get(token);
    }

    const recordsDir = path.join(DATA_DIR, token, 'records');

    // ensure directories exist
    await fs.mkdir(recordsDir, { recursive: true });

    const adapter = new FolderAdapter(recordsDir);
    const db = new Low(adapter, { records: [] });
    await db.read();

    dbCache.set(token, db);
    return db;
}
