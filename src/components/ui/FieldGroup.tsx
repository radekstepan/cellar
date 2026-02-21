import React from 'react';

export function FieldGroup({
    label,
    icon: Icon,
    children,
}: {
    label: string;
    icon?: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
                {Icon && <Icon className="w-3 h-3 text-ink-tertiary" />}
                <label className="text-[11px] font-medium text-ink-tertiary">{label}</label>
            </div>
            {children}
        </div>
    );
}
