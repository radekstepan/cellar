import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import lockfile from 'proper-lockfile';
import { db } from './lib/db.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const RECORDS_DIR = path.join(DATA_DIR, 'records');

// Ensure directories exist
await fs.mkdir(RECORDS_DIR, { recursive: true });

// --- API Endpoints ---

// Get schema
app.get('/api/schema', async (req, res) => {
    try {
        const schemaRaw = await fs.readFile(path.join(DATA_DIR, 'schema.json'), 'utf-8');
        res.json(JSON.parse(schemaRaw));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read schema' });
    }
});

// Get AI pipeline rules from schema
app.get('/api/schema/rules', async (req, res) => {
    try {
        const schemaPath = path.join(DATA_DIR, 'schema.json');
        const schemaRaw = await fs.readFile(schemaPath, 'utf-8');
        const schema = JSON.parse(schemaRaw);
        res.json(schema.ai_pipeline_rules || {});
    } catch (err) {
        res.status(500).json({ error: 'Failed to read schema rules' });
    }
});

// Update AI pipeline rules in schema
app.put('/api/schema/rules', async (req, res) => {
    try {
        const schemaPath = path.join(DATA_DIR, 'schema.json');

        try { await fs.access(schemaPath); } catch { await fs.writeFile(schemaPath, '{}', { flag: 'wx' }).catch(() => { }); }
        const release = await lockfile.lock(schemaPath, { retries: 5, realpath: false });

        try {
            const schemaRaw = await fs.readFile(schemaPath, 'utf-8');
            const schema = JSON.parse(schemaRaw);

            schema.ai_pipeline_rules = req.body;

            const tempPath = `${schemaPath}.${Date.now()}.tmp`;
            await fs.writeFile(tempPath, JSON.stringify(schema, null, 2), 'utf-8');
            await fs.rename(tempPath, schemaPath);

            res.json(schema.ai_pipeline_rules);
        } finally {
            await release();
        }
    } catch (err) {
        console.error('Failed to update schema rules:', err);
        res.status(500).json({ error: 'Failed to update schema rules' });
    }
});

// Get all records (with optional query filtering)
app.get('/api/records', async (req, res) => {
    try {
        await db.read();
        let records = db.data.records;

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
app.post('/api/records', async (req, res) => {
    try {
        await db.read();
        const data = req.body;
        if (!data.id) {
            data.id = `L-${Date.now().toString().slice(-4)}`; // Simple ID gen
        }
        db.data.records.push(data);
        await db.write();

        res.json(data);
    } catch (err) {
        console.error('Failed to create record:', err);
        res.status(500).json({ error: 'Failed to create record' });
    }
});

// Update an existing record
app.put('/api/records/:id', async (req, res) => {
    try {
        await db.read();
        const { id } = req.params;
        const updates = req.body;

        const index = db.data.records.findIndex(r => r.id === id);
        if (index !== -1) {
            db.data.records[index] = { ...db.data.records[index], ...updates };
            await db.write();
            res.json(db.data.records[index]);
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

// Watch records folder for changes
const watcher = chokidar.watch(RECORDS_DIR + '/*.json', {
    ignoreInitial: true,
});

watcher.on('all', async (event, filePath) => {
    if (event === 'add' || event === 'change') {
        try {
            // Wait slightly to ensure file is completely written before reading
            setTimeout(async () => {
                const content = await fs.readFile(filePath, 'utf-8');
                const record = JSON.parse(content);
                broadcast({ type: 'RECORD_UPDATED', record });
            }, 50);
        } catch (err) {
            console.error('Error reading changed record:', err);
        }
    }
});

console.log(`Watching for file changes in ${RECORDS_DIR}`);

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
