import React from 'react';

export function GitCard({
    icon: Icon,
    iconColor,
    label,
    value,
}: {
    icon: React.ElementType;
    iconColor: string;
    label: string;
    value: string;
}) {
    return (
        <div className="p-5 rounded-xl bg-surface-alt border border-border-subtle hover:border-border transition-colors duration-200">
            <p className="text-[11px] font-medium text-ink-tertiary mb-3">{label}</p>
            <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <span className="text-[15px] font-semibold text-ink">{value}</span>
            </div>
        </div>
    );
}
