import { History } from 'lucide-react';
import { Log } from '../../types';

export function ChangeLogPanel({ logs }: { logs: Log[] }) {
    const logTypeConfig: Record<Log['type'], { dot: string; label: string }> = {
        agent: { dot: 'bg-accent', label: 'Agent' },
        user: { dot: 'bg-amber', label: 'User' },
        system: { dot: 'bg-ink-tertiary', label: 'System' },
    };

    return (
        <aside className="w-64 bg-surface border-l border-border-subtle flex flex-col animate-slide-in-right">
            <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-ink-tertiary" />
                    <span className="text-[12px] font-medium text-ink-secondary">Activity</span>
                </div>
                <span className="text-[9px] font-mono text-ink-tertiary bg-surface-alt px-1.5 py-0.5 rounded">HEAD</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {logs.map((log, i) => {
                    const cfg = logTypeConfig[log.type];
                    return (
                        <div
                            key={log.id}
                            className="flex gap-3 p-2.5 rounded-lg hover:bg-surface-alt transition-colors duration-150 animate-slide-in-up"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                            <div className="min-w-0">
                                <p className="text-[11px] text-ink-secondary leading-relaxed">{log.message}</p>
                                <p className="text-[10px] text-ink-tertiary mt-0.5">{log.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
