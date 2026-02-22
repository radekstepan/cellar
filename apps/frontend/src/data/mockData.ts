import { Record, Log } from '../types';

export const INITIAL_SCHEMA = {
    projectName: 'Outreach',
    version: '1.0.4',
    columns: [
        { key: 'id', label: 'ID', type: 'id', width: '80px' },
        { key: 'target', label: 'Target', type: 'text', width: '180px' },
        { key: 'status', label: 'Stage', type: 'select', options: ['Triage', 'Researching', 'Drafting', 'Ready'], width: '140px' },
        { key: 'research_data', label: 'Agent Research', type: 'longtext', width: '260px' },
        { key: 'draft_email', label: 'Draft', type: 'longtext', width: '260px' },
    ],
};

export const INITIAL_RECORDS: Record[] = [
    { id: 'L-001', target: 'Acme Corp', status: 'Ready', research_data: 'CEO: Jane Doe. Focus: Sustainability.', draft_email: 'Hi Jane...', isLive: false },
    { id: 'L-002', target: 'Stark Ind', status: 'Researching', research_data: 'Scanning public data...', draft_email: '', isLive: true },
    { id: 'L-003', target: 'Wayne Ent', status: 'Triage', research_data: '', draft_email: '', isLive: false },
];

export const INITIAL_LOGS: Log[] = [
    { id: 1, type: 'agent', message: 'Updated research for Stark Ind', time: '1m ago' },
    { id: 2, type: 'user', message: 'Manually edited L-001', time: '14m ago' },
    { id: 3, type: 'system', message: 'Git sync complete', time: '1h ago' },
];
