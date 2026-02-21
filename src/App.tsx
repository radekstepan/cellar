import { useState, useMemo, useCallback } from 'react';
import { Record, Log } from './types';
import { INITIAL_RECORDS, INITIAL_LOGS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RecordsView } from './components/views/RecordsView';
import { LogicView } from './components/views/LogicView';
import { GitView } from './components/views/GitView';
import { InspectorPanel } from './components/panels/InspectorPanel';
import { ChangeLogPanel } from './components/panels/ChangeLogPanel';

export function App() {
    const [activeView, setActiveView] = useState<'records' | 'logic' | 'git'>('records');
    const [records, setRecords] = useState<Record[]>(INITIAL_RECORDS);
    const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLogVisible, setIsLogVisible] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const filteredRecords = useMemo(
        () =>
            records.filter(
                (r) =>
                    r.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.id.toLowerCase().includes(searchQuery.toLowerCase())
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
                />

                {/* View Content */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        {activeView === 'records' && (
                            <RecordsView
                                records={filteredRecords}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                selectedRecordId={selectedRecordId}
                                onSelectRecord={setSelectedRecordId}
                                liveCount={liveCount}
                            />
                        )}
                        {activeView === 'logic' && <LogicView />}
                        {activeView === 'git' && <GitView />}
                    </div>

                    {/* ─── Right Panels ─── */}
                    <div className="flex shrink-0">
                        {/* Inspector */}
                        {selectedRecord && (
                            <InspectorPanel record={selectedRecord} onClose={() => setSelectedRecordId(null)} />
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
