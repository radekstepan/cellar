import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'fs/promises';
import path from 'path';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import lockfile from 'proper-lockfile';
import { getDb } from './lib/db.js';
import { z } from 'zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true // Fastify comes with built-in Pino logger, very handy
});

const PORT = 3001;

// Set up fastify-zod compiler
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

await fastify.register(cors);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// --- Schemas ---
const TableParamsSchema = z.object({
    table: z.string(),
});

const IdParamsSchema = TableParamsSchema.extend({
    id: z.string(),
});

const RecordSchema = z.any();

// --- API Endpoints ---

// Get all available tables
fastify.get('/api/tables', async (request, reply) => {
    try {
        const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
        const tables = entries
            .filter(dirent => dirent.isDirectory() && dirent.name !== '.DS_Store')
            .map(dirent => dirent.name);
        return tables.length > 0 ? tables : ['default'];
    } catch (err) {
        reply.status(500).send({ error: 'Failed to list tables' });
    }
});

// Get schema
fastify.get('/api/:table/schema', {
    schema: {
        params: TableParamsSchema,
    }
}, async (request, reply) => {
    const { table } = request.params;
    try {
        const schemaRaw = await fs.readFile(path.join(DATA_DIR, table, 'schema.json'), 'utf-8');
        return JSON.parse(schemaRaw);
    } catch (err) {
        // Fallback to default schema if not found in table dir
        try {
            const defaultSchema = await fs.readFile(path.join(DATA_DIR, 'default', 'schema.json'), 'utf-8');
            return JSON.parse(defaultSchema);
        } catch (fallbackErr) {
            reply.status(500).send({ error: 'Failed to read schema' });
        }
        reply.status(500).send({ error: 'Failed to read schema' });
    }
});

// Get AI cellar rules from schema
fastify.get('/api/:table/schema/rules', {
    schema: {
        params: TableParamsSchema,
    }
}, async (request, reply) => {
    const { table } = request.params;
    try {
        const schemaPath = path.join(DATA_DIR, table, 'schema.json');
        const schemaRaw = await fs.readFile(schemaPath, 'utf-8');
        const schema = JSON.parse(schemaRaw);
        return schema.ai_cellar_rules || {};
    } catch (err) {
        reply.status(500).send({ error: 'Failed to read schema rules' });
    }
});

// Update AI cellar rules in schema
fastify.put('/api/:table/schema/rules', {
    schema: {
        params: TableParamsSchema,
        body: z.record(z.any()), // Allow any object for ai_cellar_rules
    }
}, async (request, reply) => {
    const { table } = request.params;
    try {
        const schemaPath = path.join(DATA_DIR, table, 'schema.json');

        try { await fs.access(schemaPath); } catch { await fs.writeFile(schemaPath, '{}', { flag: 'wx' }).catch(() => { }); }
        const release = await lockfile.lock(schemaPath, { retries: 5, realpath: false });

        try {
            const schemaRaw = await fs.readFile(schemaPath, 'utf-8');
            const schema = JSON.parse(schemaRaw);

            schema.ai_cellar_rules = request.body;

            const tempPath = `${schemaPath}.${Date.now()}.tmp`;
            await fs.writeFile(tempPath, JSON.stringify(schema, null, 2), 'utf-8');
            await fs.rename(tempPath, schemaPath);

            return schema.ai_cellar_rules;
        } finally {
            await release();
        }
    } catch (err) {
        request.log.error(err, 'Failed to update schema rules');
        reply.status(500).send({ error: 'Failed to update schema rules' });
    }
});

// Get all records (with optional query filtering)
fastify.get('/api/:table/records', {
    schema: {
        params: TableParamsSchema,
        querystring: z.record(z.string()).optional(), // Optional query filters
    }
}, async (request, reply) => {
    const { table } = request.params;
    try {
        const dbInstance = await getDb(table);
        let records = dbInstance.data.records;

        // Apply query filters if any exist
        if (request.query && Object.keys(request.query).length > 0) {
            records = records.filter(record => {
                return Object.entries(request.query).every(([key, value]) => {
                    return String(record[key]) === String(value);
                });
            });
        }

        return records;
    } catch (err) {
        request.log.error(err, 'Failed to read records');
        reply.status(500).send({ error: 'Failed to read records' });
    }
});

// Create a new record
fastify.post('/api/:table/records', {
    schema: {
        params: TableParamsSchema,
        body: RecordSchema,
    }
}, async (request, reply) => {
    const { table } = request.params;
    try {
        const dbInstance = await getDb(table);
        const data = request.body;
        if (!data.id) {
            data.id = `L-${Date.now().toString().slice(-4)}`; // Simple ID gen
        }
        dbInstance.data.records.push(data);
        await dbInstance.write();

        return data;
    } catch (err) {
        request.log.error(err, 'Failed to create record');
        reply.status(500).send({ error: 'Failed to create record' });
    }
});

// Update an existing record
fastify.put('/api/:table/records/:id', {
    schema: {
        params: IdParamsSchema,
        body: RecordSchema,
    }
}, async (request, reply) => {
    const { table, id } = request.params;
    try {
        const dbInstance = await getDb(table);
        const updates = request.body;

        const index = dbInstance.data.records.findIndex(r => r.id === id);
        if (index !== -1) {
            dbInstance.data.records[index] = { ...dbInstance.data.records[index], ...updates };
            await dbInstance.write();
            return dbInstance.data.records[index];
        } else {
            reply.status(404).send({ error: 'Not found' });
        }
    } catch (err) {
        request.log.error(err, 'Failed to update record');
        reply.status(500).send({ error: 'Failed to update record' });
    }
});

// --- Serve Frontend Statics ---
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');

await fastify.register(fastifyStatic, {
    root: FRONTEND_DIST,
    wildcard: false // Disable wildcard so we can intercept /api cleanly
});

// Catch-all route to serve the SPA
fastify.get('/*', async (request, reply) => {
    if (request.url.startsWith('/api')) {
        return reply.callNotFound(); // Pass 404s for API to fastify default handler
    }
    return reply.sendFile('index.html');
});


// --- WebSocket & File Watcher ---

const start = async () => {
    try {
        await fastify.ready();

        // Setup WebSocket Server using Fastify's native server instance
        const wss = new WebSocketServer({ server: fastify.server });

        wss.on('connection', (ws) => {
            fastify.log.info('Client connected to WebSocket');
            ws.on('close', () => fastify.log.info('Client disconnected'));
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
                    fastify.log.error(err, 'Error reading changed record');
                }
            }
        });

        fastify.log.info(`Watching for file changes in ${DATA_DIR}/*/records`);

        // Start Fastify server
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        fastify.log.info(`Server running at http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
