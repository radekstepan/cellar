import { Cpu, ArrowRightLeft, Database } from 'lucide-react';
import { INITIAL_SCHEMA } from '../../data/mockData';

type HeaderProps = {
    activeView: 'records' | 'logic' | 'git';
    triggerAgentAction: () => void;
    handleSync: () => void;
    isSyncing: boolean;
    tables: string[];
    activeToken: string;
    onSelectionChange: (token: string) => void;
};

export function Header({
    activeView,
    triggerAgentAction,
    handleSync,
    isSyncing,
    tables,
    activeToken,
    onSelectionChange
}: HeaderProps) {
    return (
        <header className="h-14 bg-surface border-b border-border-subtle px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-[13px] font-semibold tracking-tight text-ink">
                    {activeView === 'records' ? INITIAL_SCHEMA.projectName : activeView === 'logic' ? 'Agent Logic' : 'Git Status'}
                </h1>

                {/* Table Selection */}
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-ink-tertiary" />
                    <select
                        value={activeToken}
                        onChange={(e) => onSelectionChange(e.target.value)}
                        className="text-[13px] font-medium bg-transparent border-none text-ink focus:ring-0 cursor-pointer hover:text-accent transition-colors"
                    >
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                </div>

                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-alt border border-border-subtle cursor-pointer" title="Copy Agent Token">
                    <span className="text-[11px] font-medium text-ink-tertiary">Token:</span>
                    <span className="text-[11px] font-mono text-ink-secondary tracking-tight select-all">{activeToken}</span>
                </div>

                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    <span className="text-[11px] font-medium text-success">Connected</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={triggerAgentAction}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-accent bg-accent-soft hover:bg-accent/15 transition-colors duration-200 border border-accent/10"
                >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Wake Agent</span>
                </button>
                <button
                    onClick={handleSync}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white bg-ink hover:bg-ink/90 transition-colors duration-200"
                >
                    <ArrowRightLeft className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin-slow' : ''}`} />
                    <span>Sync</span>
                </button>
            </div>
        </header>
    );
}
