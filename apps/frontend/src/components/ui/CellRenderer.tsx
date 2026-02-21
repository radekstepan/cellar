import { useState, useEffect } from 'react';

export function CellRenderer({ type, value, recordId, fieldKey, onUpdate }: { type: string; value: string | boolean; isLive?: boolean; recordId: string; fieldKey: string; onUpdate: (id: string, field: string, val: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(String(value || ''));

    useEffect(() => {
        setEditValue(String(value || ''));
    }, [value]);

    const handleSave = () => {
        setIsEditing(false);
        if (editValue !== String(value || '')) {
            onUpdate(recordId, fieldKey, editValue);
        }
    };
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
    if (type === 'id') {
        return <span className="font-mono text-[11px] text-ink-tertiary tracking-tight">{String(value)}</span>;
    }

    if (isEditing) {
        return (
            <input
                autoFocus
                className="w-full bg-surface-alt text-ink border border-accent/30 rounded px-1 outline-none text-[12px]"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                onClick={(e) => e.stopPropagation()}
            />
        );
    }

    if (!value && type !== 'select') {
        return (
            <span
                className="text-ink-tertiary/40 italic text-[11px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -mx-1"
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            >
                —
            </span>
        );
    }

    return (
        <span
            className="truncate block max-w-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -mx-1"
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        >
            {String(value)}
        </span>
    );
}
