import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

const mockFetch = vi.fn((url: string | Request | URL) => {
    return Promise.resolve({
        ok: true,
        json: () => {
            if (url.toString().includes('/api/tables')) {
                return Promise.resolve(['default', 'sandbox']);
            }
            if (url.toString().includes('/schema')) {
                return Promise.resolve({
                    name: 'Testing Schema',
                    error: null,
                    fields: [],
                    columns: [
                        { key: 'id', label: 'ID', type: 'string', width: 100 },
                        { key: 'name', label: 'Name', type: 'string', width: 200 }
                    ]
                });
            }
            if (url.toString().includes('/records')) {
                return Promise.resolve([{ id: 'mock-1', name: 'Mock Record' }]);
            }
            return Promise.resolve({});
        },
    } as Response);
});

vi.stubGlobal('fetch', mockFetch);

