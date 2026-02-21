import { Database, Code2, GitBranch, Activity, Table as LucideTable } from 'lucide-react';
import { NavItem } from '../ui/NavItem';

type SidebarProps = {
    activeView: 'records' | 'logic' | 'git';
    setActiveView: (view: 'records' | 'logic' | 'git') => void;
    isLogVisible: boolean;
    setIsLogVisible: (visible: boolean) => void;
    hasLogs: boolean;
};

export function Sidebar({
    activeView,
    setActiveView,
    isLogVisible,
    setIsLogVisible,
    hasLogs,
}: SidebarProps) {
    return (
        <nav className="w-[68px] bg-surface flex flex-col items-center py-5 border-r border-border-subtle relative z-30">
            {/* Logo */}
            <button
                onClick={() => setActiveView('records')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-indigo-500 flex items-center justify-center shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-shadow duration-300 mb-8"
            >
                <Database className="text-white w-[18px] h-[18px]" />
            </button>

            {/* Nav Items */}
            <div className="flex flex-col items-center gap-1 flex-1">
                <NavItem icon={LucideTable} active={activeView === 'records'} label="Records" onClick={() => setActiveView('records')} />
                <NavItem icon={Code2} active={activeView === 'logic'} label="Logic" onClick={() => setActiveView('logic')} />
                <NavItem icon={GitBranch} active={activeView === 'git'} label="Git" onClick={() => setActiveView('git')} />
            </div>

            {/* Activity Toggle */}
            <div className="relative">
                <button
                    onClick={() => setIsLogVisible(!isLogVisible)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isLogVisible
                        ? 'bg-accent/10 text-accent'
                        : 'text-ink-tertiary hover:text-ink-secondary hover:bg-surface-alt'
                        }`}
                >
                    <Activity size={18} />
                </button>
                {hasLogs && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full animate-gentle-pulse" />
                )}
            </div>
        </nav>
    );
}
