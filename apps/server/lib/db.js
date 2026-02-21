import { Low } from 'lowdb';
import { FolderAdapter } from './FolderAdapter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', '..', 'data');
const RECORDS_DIR = path.join(DATA_DIR, 'records');

// ensure directories exist
await fs.mkdir(RECORDS_DIR, { recursive: true });

const adapter = new FolderAdapter(RECORDS_DIR);

export const db = new Low(adapter, { records: [] });
await db.read();
