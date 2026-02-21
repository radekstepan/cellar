import React from 'react';

export function NavItem({
    icon: Icon,
    active,
    label,
    onClick,
}: {
    icon: React.ElementType;
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <div className="group relative">
            <button
                onClick={onClick}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${active
                        ? 'bg-accent/10 text-accent shadow-sm'
                        : 'text-ink-tertiary hover:text-ink-secondary hover:bg-surface-alt'
                    }`}
            >
                <Icon size={18} strokeWidth={active ? 2 : 1.5} />
            </button>
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-ink text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                {label}
            </span>
        </div>
    );
}
