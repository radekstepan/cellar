import { Layers, FileJson } from 'lucide-react';
import { INITIAL_SCHEMA } from '../../data/mockData';

export function LogicView() {
    return (
        <div className="flex-1 overflow-auto bg-surface p-10">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-accent" />
                        <h2 className="text-lg font-semibold tracking-tight text-ink">Agent Logic & Schema</h2>
                    </div>
                    <p className="text-[13px] text-ink-secondary leading-relaxed">
                        Pipeline definitions for your local-first data. These rules control how the agent processes records.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <FileJson className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[12px] font-medium text-ink-secondary">schema.json</span>
                        <span className="text-[10px] font-mono text-ink-tertiary bg-surface-alt px-1.5 py-0.5 rounded">v{INITIAL_SCHEMA.version}</span>
                    </div>
                    <div className="bg-[#1B1B1F] rounded-xl overflow-hidden shadow-xl shadow-black/5 border border-white/[0.04]">
                        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                            <span className="text-[10px] font-mono text-white/30 ml-2">schema.json</span>
                        </div>
                        <pre className="p-5 text-[12px] font-mono text-indigo-300/90 leading-relaxed overflow-x-auto">
                            {JSON.stringify(INITIAL_SCHEMA, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
