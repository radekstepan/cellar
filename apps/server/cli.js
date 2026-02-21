#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import lockfile from 'proper-lockfile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const RECORDS_DIR = path.join(DATA_DIR, 'records');

async function main() {
    const [, , command, ...args] = process.argv;

    if (!command) {
        console.error("Usage: node cli.js <command> [args]");
        process.exit(1);
    }

    try {
        switch (command) {
            case 'get-schema': {
                const schemaRaw = await fs.readFile(path.join(DATA_DIR, 'schema.json'), 'utf-8');
                console.log(schemaRaw);
                break;
            }
            case 'query': {
                const key = args[0];
                const value = args[1];
                if (!key || !value) {
                    console.error("Usage: node cli.js query <key> <value>");
                    process.exit(1);
                }
                const files = await fs.readdir(RECORDS_DIR);
                const jsonFiles = files.filter(f => f.endsWith('.json'));
                const records = [];
                for (const file of jsonFiles) {
                    const content = await fs.readFile(path.join(RECORDS_DIR, file), 'utf-8');
                    const record = JSON.parse(content);
                    if (String(record[key]) === String(value)) {
                        records.push(record);
                    }
                }
                console.log(JSON.stringify(records, null, 2));
                break;
            }
            case 'update': {
                const id = args[0];
                const fieldsRaw = args[1];
                if (!id || !fieldsRaw) {
                    console.error("Usage: node cli.js update <id> '<json_fields>'");
                    process.exit(1);
                }
                const updates = JSON.parse(fieldsRaw);
                const filePath = path.join(RECORDS_DIR, `${id}.json`);

                try { await fs.access(filePath); } catch {
                    console.error("Record not found:", id);
                    process.exit(1);
                }
                const release = await lockfile.lock(filePath, { retries: 5, realpath: false });
                try {
                    const content = await fs.readFile(filePath, 'utf-8');
                    const record = JSON.parse(content);
                    const updatedRecord = { ...record, ...updates, last_modified: new Date().toISOString() };

                    const tempPath = `${filePath}.${Date.now()}.tmp`;
                    await fs.writeFile(tempPath, JSON.stringify(updatedRecord, null, 2), 'utf-8');
                    await fs.rename(tempPath, filePath);
                    console.log(JSON.stringify(updatedRecord, null, 2));
                } finally {
                    await release();
                }
                break;
            }
            case 'create': {
                const fieldsRaw = args[0];
                if (!fieldsRaw) {
                    console.error("Usage: node cli.js create '<json_fields>'");
                    process.exit(1);
                }
                const data = JSON.parse(fieldsRaw);
                if (!data.id) {
                    data.id = `L-${Date.now().toString().slice(-4)}`;
                }
                const filePath = path.join(RECORDS_DIR, `${data.id}.json`);
                try { await fs.access(filePath); } catch { await fs.writeFile(filePath, '{}', { flag: 'wx' }).catch(() => { }); }
                const release = await lockfile.lock(filePath, { retries: 5, realpath: false });
                try {
                    const newRecord = { ...data, last_modified: new Date().toISOString() };
                    const tempPath = `${filePath}.${Date.now()}.tmp`;
                    await fs.writeFile(tempPath, JSON.stringify(newRecord, null, 2), 'utf-8');
                    await fs.rename(tempPath, filePath);
                    console.log(JSON.stringify(newRecord, null, 2));
                } finally {
                    await release();
                }
                break;
            }
            default:
                console.error("Unknown command:", command);
                process.exit(1);
        }
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

main();
