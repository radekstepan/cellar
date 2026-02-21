export function CellRenderer({ type, value }: { type: string; value: string | boolean; isLive?: boolean }) {
    if (type === 'id') {
        return <span className="font-mono text-[11px] text-ink-tertiary tracking-tight">{String(value)}</span>;
    }
    if (type === 'select') {
        const statusConfig: { [key: string]: { bg: string; text: string; dot: string } } = {
            Triage: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
            Researching: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
            Drafting: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-400' },
            Ready: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        };
        const cfg = statusConfig[String(value)] ?? statusConfig.Triage;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {String(value)}
            </span>
        );
    }
    if (!value) {
        return <span className="text-ink-tertiary/40 italic text-[11px]">—</span>;
    }
    return <span className="truncate block max-w-full">{String(value)}</span>;
}
