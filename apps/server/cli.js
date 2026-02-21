#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
import { db } from './lib/db.js';

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

                await db.read();
                const records = db.data.records.filter(record => String(record[key]) === String(value));
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

                await db.read();
                const index = db.data.records.findIndex(r => r.id === id);
                if (index === -1) {
                    console.error("Record not found:", id);
                    process.exit(1);
                }

                const updatedRecord = { ...db.data.records[index], ...updates, last_modified: new Date().toISOString() };
                db.data.records[index] = updatedRecord;
                await db.write();

                console.log(JSON.stringify(updatedRecord, null, 2));
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

                await db.read();
                const newRecord = { ...data, last_modified: new Date().toISOString() };
                db.data.records.push(newRecord);
                await db.write();

                console.log(JSON.stringify(newRecord, null, 2));
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
