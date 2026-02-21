import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';

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

// Get all records
app.get('/api/records', async (req, res) => {
    try {
        const files = await fs.readdir(RECORDS_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const records = await Promise.all(
            jsonFiles.map(async (file) => {
                const content = await fs.readFile(path.join(RECORDS_DIR, file), 'utf-8');
                return JSON.parse(content);
            })
        );
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read records' });
    }
});

// Create a new record
app.post('/api/records', async (req, res) => {
    try {
        const data = req.body;
        if (!data.id) {
            data.id = `L-${Date.now().toString().slice(-4)}`; // Simple ID gen
        }
        const filePath = path.join(RECORDS_DIR, `${data.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create record' });
    }
});

// Update an existing record
app.put('/api/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const filePath = path.join(RECORDS_DIR, `${id}.json`);

        let record = {};
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            record = JSON.parse(content);
        } catch (e) {
            // If file doesn't exist, we'll just create it with the updates
        }

        const updatedRecord = { ...record, ...updates };
        await fs.writeFile(filePath, JSON.stringify(updatedRecord, null, 2), 'utf-8');
        res.json(updatedRecord);
    } catch (err) {
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
