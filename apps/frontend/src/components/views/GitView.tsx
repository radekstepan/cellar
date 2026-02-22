import { GitBranch, GitCommit, History } from 'lucide-react';
import { GitCard } from '../ui/GitCard';

export function GitView() {
    return (
        <div className="flex-1 overflow-auto bg-surface p-10">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="w-4 h-4 text-accent" />
                        <h2 className="text-lg font-semibold tracking-tight text-ink">Git Status</h2>
                    </div>
                    <p className="text-[13px] text-ink-secondary leading-relaxed">
                        Tracking changes in the <code className="text-[12px] font-mono bg-surface-alt px-1.5 py-0.5 rounded text-accent">/records</code> directory.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <GitCard
                        icon={GitBranch}
                        iconColor="text-accent"
                        label="Current Branch"
                        value="main"
                    />
                    <GitCard
                        icon={GitCommit}
                        iconColor="text-success"
                        label="Staged Files"
                        value="4 Objects"
                    />
                </div>

                <div className="mt-8 p-4 rounded-xl bg-surface-alt border border-border-subtle">
                    <div className="flex items-center gap-2 mb-3">
                        <History className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span className="text-[12px] font-medium text-ink-secondary">Recent Commits</span>
                    </div>
                    <div className="space-y-2">
                        {['Update L-002 research data', 'Initial cellar setup', 'Add schema v1.0.4'].map((msg, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 animate-slide-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-ink-tertiary shrink-0" />
                                <span className="text-[12px] text-ink-secondary">{msg}</span>
                                <span className="text-[10px] text-ink-tertiary ml-auto font-mono">{i === 0 ? '2h ago' : i === 1 ? '1d ago' : '3d ago'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
