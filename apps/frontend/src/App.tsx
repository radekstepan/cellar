import { useState, useMemo, useCallback, useEffect } from 'react';
import { Record, Log } from './types';
import { INITIAL_LOGS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RecordsView } from './components/views/RecordsView';
import { LogicView } from './components/views/LogicView';
import { GitView } from './components/views/GitView';
import { InspectorPanel } from './components/panels/InspectorPanel';
import { ChangeLogPanel } from './components/panels/ChangeLogPanel';

export function App() {
    const [schema, setSchema] = useState<any>(null);
    const [activeView, setActiveView] = useState<'records' | 'logic' | 'git'>('records');
    const [records, setRecords] = useState<Record[]>([]);
    const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLogVisible, setIsLogVisible] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [tables, setTables] = useState<string[]>([]);
    const [activeToken, setActiveToken] = useState<string>('default');

    // Fetch available tables on mount
    useEffect(() => {
        fetch('/api/tables')
            .then(r => r.json())
            .then(fetchedTables => {
                setTables(fetchedTables);
                // Simple state init: check URL params, else check localStorage, else take first table
                const params = new URLSearchParams(window.location.search);
                const urlToken = params.get('token');
                if (urlToken && fetchedTables.includes(urlToken)) {
                    setActiveToken(urlToken);
                } else {
                    const savedToken = localStorage.getItem('activeToken');
                    if (savedToken && fetchedTables.includes(savedToken)) {
                        setActiveToken(savedToken);
                    } else if (fetchedTables.length > 0) {
                        setActiveToken(fetchedTables[0]);
                    }
                }
            })
            .catch(err => console.error('Failed to load tables:', err));
    }, []);

    // Load schema and records when activeToken changes
    useEffect(() => {
        if (!activeToken) return;

        // Use the activeToken when querying endpoints
        Promise.all([
            fetch(`/api/${activeToken}/schema`).then(r => r.json()),
            fetch(`/api/${activeToken}/records`).then(r => r.json())
        ]).then(([fetchedSchema, fetchedRecords]) => {
            setSchema(fetchedSchema);
            setRecords(fetchedRecords);
        }).catch(err => console.error('Failed to load initial data:', err));

        // Setup WebSocket for live updates
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = process.env.NODE_ENV === 'development' ? `ws://localhost:3001` : `${wsProtocol}//${window.location.host}`;
        const ws = new WebSocket(wsUrl);
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'RECORD_UPDATED') {
                    // Only process updates for the currently active table
                    if (data.token !== activeToken) return;

                    setRecords(prev => {
                        const updated = [...prev];
                        const index = updated.findIndex(r => r.id === data.record.id);
                        if (index > -1) {
                            updated[index] = data.record;
                        } else {
                            updated.push(data.record);
                        }
                        return updated;
                    });
                }
            } catch (err) {
                console.error('WebSocket message parsing error:', err);
            }
        };

        return () => {
            ws.close();
        };
    }, [activeToken]);

    const handleUpdateRecord = useCallback(async (id: string, field: string, value: string) => {
        try {
            await fetch(`/api/${activeToken}/records/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            });
        } catch (e) {
            console.error('Failed to update record:', e);
        }
    }, [activeToken]);

    const filteredRecords = useMemo(
        () =>
            records.filter(
                (r) => {
                    const searchLower = searchQuery.toLowerCase();
                    const targetString = String(r.target || r.title || '').toLowerCase();
                    const idString = String(r.id || '').toLowerCase();
                    return targetString.includes(searchLower) || idString.includes(searchLower);
                }
            ),
        [records, searchQuery]
    );

    const selectedRecord = useMemo(
        () => records.find((r) => r.id === selectedRecordId) ?? null,
        [records, selectedRecordId]
    );

    const handleSync = useCallback(() => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1200);
    }, []);

    const triggerAgentAction = useCallback(() => {
        setRecords((prev) =>
            prev.map((r) => ({
                ...r,
                isLive: r.id === 'L-003',
                status: r.id === 'L-003' ? 'Researching' : r.status,
            }))
        );
        setLogs((prev) => [
            { id: Date.now(), type: 'agent', message: 'Agent shifted focus to Wayne Ent', time: 'Just now' },
            ...prev,
        ]);
    }, []);

    const liveCount = records.filter((r) => r.isLive).length;

    const handleSelectionChange = (token: string) => {
        setActiveToken(token);
        localStorage.setItem('activeToken', token);
        const url = new URL(window.location.href);
        url.searchParams.set('token', token);
        window.history.pushState({}, '', url);
    };

    if (!schema) {
        return <div className="flex h-screen items-center justify-center bg-canvas text-ink">Loading...</div>;
    }

    if (schema.error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-canvas text-ink gap-4">
                <div className="text-xl font-semibold">Error Loading Table</div>
                <div className="text-sm text-ink-tertiary">{schema.error}</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-canvas font-sans text-ink overflow-hidden">
            {/* ─── Sidebar ─── */}
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                isLogVisible={isLogVisible}
                setIsLogVisible={setIsLogVisible}
                hasLogs={logs.length > 0}
            />

            {/* ─── Main Content ─── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <Header
                    activeView={activeView}
                    triggerAgentAction={triggerAgentAction}
                    handleSync={handleSync}
                    isSyncing={isSyncing}
                    tables={tables}
                    activeToken={activeToken}
                    onSelectionChange={handleSelectionChange}
                />

                {/* View Content */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        {activeView === 'records' && (
                            <RecordsView
                                schema={schema}
                                records={filteredRecords}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                selectedRecordId={selectedRecordId}
                                onSelectRecord={setSelectedRecordId}
                                liveCount={liveCount}
                                onUpdateRecord={handleUpdateRecord}
                            />
                        )}
                        {activeView === 'logic' && <LogicView />}
                        {activeView === 'git' && <GitView />}
                    </div>

                    {/* ─── Right Panels ─── */}
                    <div className="flex shrink-0">
                        {/* Inspector */}
                        {selectedRecord && (
                            <InspectorPanel
                                record={selectedRecord}
                                onClose={() => setSelectedRecordId(null)}
                                onUpdateRecord={handleUpdateRecord}
                            />
                        )}

                        {/* Change Log */}
                        {isLogVisible && <ChangeLogPanel logs={logs} />}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
