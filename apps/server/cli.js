#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
import { getDb } from './lib/db.js';

async function main() {
    const [, , command, ...args] = process.argv;

    if (!command) {
        console.error("Usage: node cli.js <command> [args]");
        process.exit(1);
    }

    try {
        switch (command) {
            case 'get-schema': {
                const table = args[0] || 'default';
                try {
                    const schemaRaw = await fs.readFile(path.join(DATA_DIR, table, 'schema.json'), 'utf-8');
                    console.log(schemaRaw);
                } catch (err) {
                    // fallback to default
                    const defaultSchema = await fs.readFile(path.join(DATA_DIR, 'default', 'schema.json'), 'utf-8');
                    console.log(defaultSchema);
                }
                break;
            }
            case 'get-all': {
                const table = args[0];
                if (!table) {
                    console.error("Usage: node cli.js get-all <table>");
                    process.exit(1);
                }
                const dbInstance = await getDb(table);
                console.log(JSON.stringify(dbInstance.data.records, null, 2));
                break;
            }
            case 'query': {
                const table = args[0];
                const key = args[1];
                const value = args[2];
                if (!table || !key || !value) {
                    console.error("Usage: node cli.js query <table> <key> <value> [--limit <number>]");
                    process.exit(1);
                }

                let limit = null;
                const limitIndex = args.indexOf('--limit');
                if (limitIndex !== -1 && args.length > limitIndex + 1) {
                    limit = parseInt(args[limitIndex + 1], 10);
                }

                const dbInstance = await getDb(table);
                let records = dbInstance.data.records.filter(record => String(record[key]) === String(value));

                if (limit !== null && !isNaN(limit)) {
                    records = records.slice(0, limit);
                }

                console.log(JSON.stringify(records, null, 2));
                break;
            }
            case 'update': {
                const table = args[0];
                const id = args[1];
                const fieldsRaw = args[2];
                if (!table || !id || !fieldsRaw) {
                    console.error("Usage: node cli.js update <table> <id> '<json_fields>'");
                    process.exit(1);
                }
                const updates = JSON.parse(fieldsRaw);

                const dbInstance = await getDb(table);
                const index = dbInstance.data.records.findIndex(r => r.id === id);
                if (index === -1) {
                    console.error("Record not found:", id);
                    process.exit(1);
                }

                const updatedRecord = { ...dbInstance.data.records[index], ...updates, last_modified: new Date().toISOString() };
                dbInstance.data.records[index] = updatedRecord;
                await dbInstance.write();

                console.log(JSON.stringify(updatedRecord, null, 2));
                break;
            }
            case 'create': {
                const table = args[0];
                const fieldsRaw = args[1];
                if (!table || !fieldsRaw) {
                    console.error("Usage: node cli.js create <table> '<json_fields>'");
                    process.exit(1);
                }
                const data = JSON.parse(fieldsRaw);
                if (!data.id) {
                    data.id = `L-${Date.now().toString().slice(-4)}`;
                }

                const dbInstance = await getDb(table);
                const newRecord = { ...data, last_modified: new Date().toISOString() };
                dbInstance.data.records.push(newRecord);
                await dbInstance.write();

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
