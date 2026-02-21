import { Eye, X, FileText, Zap, CheckCircle2 } from 'lucide-react';
import { Record } from '../../types';
import { FieldGroup } from '../ui/FieldGroup';

export function InspectorPanel({ record, onClose }: { record: Record; onClose: () => void }) {
    return (
        <aside className="w-80 bg-surface border-l border-border-subtle flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-ink-tertiary uppercase tracking-wider">Inspector</p>
                        <p className="text-[13px] font-semibold text-ink">{record.id}</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-surface-alt flex items-center justify-center transition-colors">
                    <X className="w-3.5 h-3.5 text-ink-tertiary" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Target */}
                <FieldGroup label="Target" icon={FileText}>
                    <input
                        className="w-full px-3 py-2 bg-surface-alt border border-border-subtle rounded-lg text-[12px] font-medium text-ink placeholder:text-ink-tertiary focus:border-accent/30 focus:ring-1 focus:ring-accent/10 outline-none transition-all"
                        defaultValue={record.target}
                    />
                </FieldGroup>

                {/* Draft */}
                <FieldGroup label="Draft Payload">
                    <textarea
                        className="w-full h-28 px-3 py-2.5 bg-surface-alt border border-border-subtle rounded-lg text-[12px] text-ink-secondary leading-relaxed resize-none focus:border-accent/30 focus:ring-1 focus:ring-accent/10 outline-none transition-all"
                        value={record.draft_email}
                        readOnly
                    />
                </FieldGroup>

                {/* Raw JSON */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-[11px] font-medium text-accent">Raw Source</span>
                    </div>
                    <div className="bg-[#1B1B1F] rounded-xl overflow-hidden border border-white/[0.04]">
                        <pre className="p-4 text-[10px] font-mono text-emerald-400/80 leading-relaxed overflow-x-auto">
                            {JSON.stringify(record, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    <span className="text-[10px] font-medium text-ink-tertiary">Valid JSON</span>
                </div>
                <button className="text-[11px] font-medium text-accent hover:underline underline-offset-2">Edit Source</button>
            </div>
        </aside>
    );
}
