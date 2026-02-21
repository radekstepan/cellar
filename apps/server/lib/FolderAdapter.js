import fs from 'fs/promises';
import path from 'path';
import lockfile from 'proper-lockfile';

export class FolderAdapter {
    constructor(dirPath) {
        this.dirPath = dirPath;
    }

    // Called by db.read()
    async read() {
        const files = await fs.readdir(this.dirPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const records = await Promise.all(
            jsonFiles.map(async (file) => {
                const content = await fs.readFile(path.join(this.dirPath, file), 'utf-8');
                return JSON.parse(content);
            })
        );

        return { records };
    }

    // Called by db.write()
    async write(data) {
        // Note: To optimize, you could diff the memory state vs disk state here
        // For now, we safely overwrite/create individual files
        for (const record of data.records) {
            if (!record || !record.id) {
                continue;
            }
            const filePath = path.join(this.dirPath, `${record.id}.json`);

            // Ensure file exists for locking
            try { await fs.access(filePath); } catch { await fs.writeFile(filePath, '{}', { flag: 'wx' }).catch(() => { }); }

            const release = await lockfile.lock(filePath, { retries: 5, realpath: false });
            try {
                const tempPath = `${filePath}.${Date.now()}.tmp`;
                await fs.writeFile(tempPath, JSON.stringify(record, null, 2), 'utf-8');
                await fs.rename(tempPath, filePath);
            } finally {
                await release();
            }
        }
    }
}
