import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import lockfile from 'proper-lockfile';
import { getDb } from './lib/db.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// --- API Endpoints ---

// Get all available tables
app.get('/api/tables', async (req, res) => {
    try {
        const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
        const tables = entries
            .filter(dirent => dirent.isDirectory() && dirent.name !== '.DS_Store')
            .map(dirent => dirent.name);
        res.json(tables.length > 0 ? tables : ['default']);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list tables' });
    }
});

// Get schema
app.get('/api/:table/schema', async (req, res) => {
    const { table } = req.params;
    try {
        const schemaRaw = await fs.readFile(path.join(DATA_DIR, table, 'schema.json'), 'utf-8');
        res.json(JSON.parse(schemaRaw));
    } catch (err) {
        // Fallback to default schema if not found in table dir
        try {
            const defaultSchema = await fs.readFile(path.join(DATA_DIR, 'default', 'schema.json'), 'utf-8');
            res.json(JSON.parse(defaultSchema));
        } catch (fallbackErr) {
            res.status(500).json({ error: 'Failed to read schema' });
        }
        res.status(500).json({ error: 'Failed to read schema' });
    }
});

// Get AI cellar rules from schema
app.get('/api/:table/schema/rules', async (req, res) => {
    const { table } = req.params;
    try {
        const schemaPath = path.join(DATA_DIR, table, 'schema.json');
        const schemaRaw = await fs.readFile(schemaPath, 'utf-8');
        const schema = JSON.parse(schemaRaw);
        res.json(schema.ai_cellar_rules || {});
    } catch (err) {
        res.status(500).json({ error: 'Failed to read schema rules' });
    }
});

// Update AI cellar rules in schema
app.put('/api/:table/schema/rules', async (req, res) => {
    const { table } = req.params;
    try {
        const schemaPath = path.join(DATA_DIR, table, 'schema.json');

        try { await fs.access(schemaPath); } catch { await fs.writeFile(schemaPath, '{}', { flag: 'wx' }).catch(() => { }); }
        const release = await lockfile.lock(schemaPath, { retries: 5, realpath: false });

        try {
            const schemaRaw = await fs.readFile(schemaPath, 'utf-8');
            const schema = JSON.parse(schemaRaw);

            schema.ai_cellar_rules = req.body;

            const tempPath = `${schemaPath}.${Date.now()}.tmp`;
            await fs.writeFile(tempPath, JSON.stringify(schema, null, 2), 'utf-8');
            await fs.rename(tempPath, schemaPath);

            res.json(schema.ai_cellar_rules);
        } finally {
            await release();
        }
    } catch (err) {
        console.error('Failed to update schema rules:', err);
        res.status(500).json({ error: 'Failed to update schema rules' });
    }
});

// Get all records (with optional query filtering)
app.get('/api/:table/records', async (req, res) => {
    const { table } = req.params;
    try {
        const dbInstance = await getDb(table);
        let records = dbInstance.data.records;

        // Apply query filters if any exist
        if (req.query && Object.keys(req.query).length > 0) {
            records = records.filter(record => {
                return Object.entries(req.query).every(([key, value]) => {
                    return String(record[key]) === String(value);
                });
            });
        }

        res.json(records);
    } catch (err) {
        console.error('Failed to read records:', err);
        res.status(500).json({ error: 'Failed to read records' });
    }
});

// Create a new record
app.post('/api/:table/records', async (req, res) => {
    const { table } = req.params;
    try {
        const dbInstance = await getDb(table);
        const data = req.body;
        if (!data.id) {
            data.id = `L-${Date.now().toString().slice(-4)}`; // Simple ID gen
        }
        dbInstance.data.records.push(data);
        await dbInstance.write();

        res.json(data);
    } catch (err) {
        console.error('Failed to create record:', err);
        res.status(500).json({ error: 'Failed to create record' });
    }
});

// Update an existing record
app.put('/api/:table/records/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
        const dbInstance = await getDb(table);
        const updates = req.body;

        const index = dbInstance.data.records.findIndex(r => r.id === id);
        if (index !== -1) {
            dbInstance.data.records[index] = { ...dbInstance.data.records[index], ...updates };
            await dbInstance.write();
            res.json(dbInstance.data.records[index]);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    } catch (err) {
        console.error('Failed to update record:', err);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

// --- WebSocket & File Watcher ---

const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.on('close', () => console.log('Client disconnected'));
});

const broadcast = (message) => {
    for (const client of wss.clients) {
        if (client.readyState === 1 /* OPEN */) {
            client.send(JSON.stringify(message));
        }
    }
};

// Watch records folders for changes
const watcher = chokidar.watch(path.join(DATA_DIR, '*/records/*.json'), {
    ignoreInitial: true,
});

watcher.on('all', async (event, filePath) => {
    if (event === 'add' || event === 'change') {
        try {
            // Wait slightly to ensure file is completely written before reading
            setTimeout(async () => {
                const content = await fs.readFile(filePath, 'utf-8');
                const record = JSON.parse(content);
                // Extract the table from the path `.../data/<table>/records/<id>.json`
                const parts = filePath.split(path.sep);
                const recordsIndex = parts.lastIndexOf('records');
                const table = parts[recordsIndex - 1];

                broadcast({ type: 'RECORD_UPDATED', table, record });
            }, 50);
        } catch (err) {
            console.error('Error reading changed record:', err);
        }
    }
});

console.log(`Watching for file changes in ${DATA_DIR}/*/records`);

// --- Serve Frontend Statics ---
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIST));

// Catch-all route to serve the SPA (excluding /api routes which are handled above)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});
