import { Search, Radio, Plus } from 'lucide-react';
import { Record } from '../../types';
import { CellRenderer } from '../ui/CellRenderer';

export function RecordsView({
    schema,
    records,
    searchQuery,
    onSearchChange,
    selectedRecordId,
    onSelectRecord,
    liveCount,
    onUpdateRecord,
}: {
    schema: any;
    records: Record[];
    searchQuery: string;
    onSearchChange: (q: string) => void;
    selectedRecordId: string | null;
    onSelectRecord: (id: string | null) => void;
    liveCount: number;
    onUpdateRecord: (id: string, field: string, value: string) => void;
}) {
    return (
        <>
            {/* Toolbar */}
            <div className="h-12 bg-surface border-b border-border-subtle px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-tertiary" />
                        <input
                            type="text"
                            placeholder="Search records…"
                            className="pl-8 pr-3 py-1.5 bg-surface-alt rounded-lg text-[12px] text-ink placeholder:text-ink-tertiary border border-transparent focus:border-accent/30 focus:bg-white outline-none w-56 transition-all duration-200"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-ink-tertiary font-medium">
                            {records.length} records
                        </span>
                        {liveCount > 0 && (
                            <span className="flex items-center gap-1 text-[11px] text-accent font-medium">
                                <Radio className="w-3 h-3" />
                                {liveCount} live
                            </span>
                        )}
                    </div>
                </div>
                <button className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors shadow-sm shadow-accent/20">
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-surface-alt/80 backdrop-blur-sm">
                            <th className="w-10 px-3 py-2.5 border-b border-border-subtle" />
                            {schema.columns.map((col: any) => (
                                <th
                                    key={col.key}
                                    style={{ width: col.width }}
                                    className="px-4 py-2.5 border-b border-border-subtle text-[11px] font-medium text-ink-tertiary tracking-wide select-none"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, i) => (
                            <tr
                                key={record.id}
                                onClick={() => onSelectRecord(record.id)}
                                className={`group cursor-pointer transition-colors duration-150 animate-fade-in ${selectedRecordId === record.id
                                    ? 'bg-accent-soft/50'
                                    : 'hover:bg-surface-alt/60'
                                    }`}
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <td className="px-3 py-3.5 border-b border-border-subtle relative">
                                    {record.isLive && (
                                        <div className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-accent to-live" />
                                    )}
                                    <div className="flex items-center justify-center">
                                        {record.isLive ? (
                                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                                        ) : (
                                            <span className="w-1.5 h-1.5 rounded-full bg-border opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </div>
                                </td>
                                {schema.columns.map((col: any) => (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-3.5 border-b border-border-subtle text-[12px] transition-colors ${record.isLive ? 'text-ink font-medium' : 'text-ink-secondary'
                                            }`}
                                    >
                                        <CellRenderer
                                            type={col.type}
                                            value={record[col.key]}
                                            isLive={record.isLive}
                                            recordId={record.id}
                                            fieldKey={col.key}
                                            onUpdate={onUpdateRecord}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
