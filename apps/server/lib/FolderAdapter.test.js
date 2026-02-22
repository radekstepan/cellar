import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import { FolderAdapter } from './FolderAdapter.js';
import fs from 'fs/promises';
import path from 'path';

// Helper to create a temporary directory for testing
const tmpDir = path.join(process.cwd(), '.test-tmp', Date.now().toString());

describe('FolderAdapter', () => {
    beforeEach(async () => {
        await fs.mkdir(tmpDir, { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(tmpDir, { recursive: true, force: true });
    });

    test('reads existing valid JSON files and builds records state', async () => {
        await fs.writeFile(path.join(tmpDir, 'record1.json'), JSON.stringify({ id: 'record1', name: 'First' }));
        await fs.writeFile(path.join(tmpDir, 'record2.json'), JSON.stringify({ id: 'record2', name: 'Second' }));
        // Should ignore non-JSON
        await fs.writeFile(path.join(tmpDir, 'ignoreme.txt'), 'hello world');

        const adapter = new FolderAdapter(tmpDir);
        const data = await adapter.read();

        expect(data.records).toHaveLength(2);

        // Using snapshot style expects or searching the array
        const r1 = data.records.find(r => r.id === 'record1');
        const r2 = data.records.find(r => r.id === 'record2');

        expect(r1.name).toBe('First');
        expect(r2.name).toBe('Second');
    });

    test('writes new records safely across files', async () => {
        const adapter = new FolderAdapter(tmpDir);
        const mockData = {
            records: [
                { id: 'foo', val: 1 },
                { id: 'bar', val: 2 }
            ]
        };

        await adapter.write(mockData);

        const fooContent = JSON.parse(await fs.readFile(path.join(tmpDir, 'foo.json'), 'utf-8'));
        expect(fooContent.val).toBe(1);

        const barContent = JSON.parse(await fs.readFile(path.join(tmpDir, 'bar.json'), 'utf-8'));
        expect(barContent.val).toBe(2);
    });

    test('ignores records without an id during write', async () => {
        const adapter = new FolderAdapter(tmpDir);
        const mockData = {
            records: [
                { val: 1 }, // No ID
                { id: 'valid', val: 2 }
            ]
        };

        await adapter.write(mockData);

        const files = await fs.readdir(tmpDir);
        expect(files).toHaveLength(1);
        expect(files[0]).toBe('valid.json');
    });
});
