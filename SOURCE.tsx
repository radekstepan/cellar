import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Bell, LayoutGrid, BarChart2, User, Settings,
  MoreHorizontal, Sliders, Check, ChevronDown, Globe, Zap,
  AlertTriangle, X, Info, Activity, Maximize2, LogOut, ShieldCheck, Cpu,
  Terminal, Database, Network, Command, Eye, EyeOff, Copy, 
  Download, RefreshCw, Wifi, Moon, ArrowRight, ArrowLeft, 
  Hash, Clock, MapPin, Shield, Key, Radio,
  GitBranch, GitMerge, Code, HardDrive,
  Server, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle,
  Target, Sparkles
} from 'lucide-react';

// --- Tooltip Primitive ---
const Tooltip: React.FC<{children: React.ReactNode; content: string}> = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] px-3 py-1.5 bg-[#12101c] border border-violet-500/40 text-[9px] text-slate-200 uppercase tracking-[0.2em] whitespace-nowrap shadow-2xl pointer-events-none animate-fadeIn">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-violet-500/40"></div>
        </div>
      )}
    </div>
  );
};

// --- Badge Component ---
const Badge: React.FC<{children: React.ReactNode; variant?: 'default'|'success'|'warning'|'danger'|'info'}> = ({ children, variant = 'default' }) => {
  const styles: Record<string, string> = {
    default: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] border ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Avatar ---
const Avatar: React.FC<{initials: string; size?: 'sm'|'md'|'lg'; status?: 'online'|'offline'|'away'}> = ({ initials, size = 'md', status }) => {
  const sizeClasses = { sm: 'w-7 h-7 text-[8px]', md: 'w-8 h-8 text-[9px]', lg: 'w-11 h-11 text-[11px]' };
  const statusSizes = { sm: 'w-2 h-2 border', md: 'w-2.5 h-2.5 border-[1.5px]', lg: 'w-3 h-3 border-2' };
  const statusColors = { online: 'bg-emerald-500', offline: 'bg-slate-600', away: 'bg-amber-500' };
  return (
    <div className="relative inline-flex">
      <div className={`${sizeClasses[size]} rounded-[4px] bg-[#1a1528] border border-violet-500/25 flex items-center justify-center font-bold uppercase tracking-widest text-violet-400`}>
        {initials}
      </div>
      {status && <div className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} ${statusColors[status]} border-[#08070b] rounded-full`}></div>}
    </div>
  );
};

// --- Skeleton Loader ---
const Skeleton: React.FC<{className?: string}> = ({ className = '' }) => (
  <div className={`bg-white/[0.04] animate-pulse ${className}`}></div>
);

// --- Kbd (keyboard shortcut) ---
const Kbd: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-mono text-slate-500 bg-white/[0.04] border border-white/10 min-w-[20px]">
    {children}
  </kbd>
);

export function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  
  // Dropdown & Popover States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Search Autocomplete State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const suggestions = [
    "NODE-AL-1 (Oregon)", "NODE-SG-4 (Singapore)", "NODE-TK-9 (Tokyo)", 
    "RSA-4096 Key Rotation", "gRPC Stream v2", "Delta-7 Resonance"
  ];

  // Form States
  const [selectedProtocol, setSelectedProtocol] = useState('Secure WebSocket (WSS)');
  const [sliderVal, setSliderVal] = useState(72);
  const [toggle, setToggle] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);
  const [checkbox, setCheckbox] = useState(true);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(true);
  const [radioValue, setRadioValue] = useState('performance');
  const [openAccordion, setOpenAccordion] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Refs
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const sections: Record<string, React.RefObject<HTMLElement | null>> = {
    overview: useRef<HTMLElement>(null),
    infrastructure: useRef<HTMLElement>(null),
    stats: useRef<HTMLElement>(null),
    config: useRef<HTMLElement>(null),
    terminal: useRef<HTMLElement>(null),
  };

  // Chart Tooltip States
  const [lineTooltip, setLineTooltip] = useState({ visible: false, x: 0, y: 0, value: 0 });
  const [barTooltip, setBarTooltip] = useState({ visible: false, id: null as number|null, x: 0, y: 0, value: 0 });

  // Animated counters
  const [counters, setCounters] = useState({ uptime: 0, bandwidth: 0, latency: 0, nodes: 0 });

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    showToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animate counters
      const duration = 1200;
      const steps = 40;
      const targets = { uptime: 99.98, bandwidth: 4.2, latency: 12, nodes: 124 };
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const ease = 1 - Math.pow(1 - progress, 3);
        setCounters({
          uptime: parseFloat((targets.uptime * ease).toFixed(2)),
          bandwidth: parseFloat((targets.bandwidth * ease).toFixed(1)),
          latency: Math.round(targets.latency * ease),
          nodes: Math.round(targets.nodes * ease),
        });
        if (step >= steps) clearInterval(interval);
      }, duration / steps);
    }, 1800);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsSelectOpen(false);
      if (splitRef.current && !splitRef.current.contains(event.target as Node)) setIsSplitOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) setIsPopoverOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    setActiveTab(id);
    sections[id].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLineMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const val = Math.floor((1 - y / rect.height) * 100);
    setLineTooltip({ visible: true, x, y, value: val });
  };

  const handleBarHover = (e: React.MouseEvent, h: number, i: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const chartRect = e.currentTarget.parentElement!.getBoundingClientRect();
    setBarTooltip({ 
      visible: true, 
      id: i, 
      x: rect.left - chartRect.left + (rect.width / 2), 
      y: rect.top - chartRect.top + (rect.height * (1 - h/100)), 
      value: h 
    });
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Node data
  const nodeData = [
    { id: 'NODE-AL-1', region: 'Oregon, US', load: '78%', status: 'Nominal', latency: '8ms', uptime: '99.99%' },
    { id: 'NODE-SG-4', region: 'Singapore', load: '92%', status: 'Warning', latency: '24ms', uptime: '99.95%', warning: true },
    { id: 'NODE-TK-9', region: 'Tokyo, JP', load: '65%', status: 'Nominal', latency: '12ms', uptime: '99.98%' },
    { id: 'NODE-FR-2', region: 'Frankfurt, DE', load: '43%', status: 'Nominal', latency: '18ms', uptime: '99.97%' },
    { id: 'NODE-SP-6', region: 'São Paulo, BR', load: '87%', status: 'Critical', latency: '45ms', uptime: '99.82%', warning: true },
    { id: 'NODE-SY-3', region: 'Sydney, AU', load: '56%', status: 'Nominal', latency: '31ms', uptime: '99.96%' },
  ];

  // Terminal lines
  const terminalLines = [
    { time: '00:00:01', level: 'INFO', msg: 'System bootstrap sequence initiated' },
    { time: '00:00:02', level: 'INFO', msg: 'Loading kernel modules... [OK]' },
    { time: '00:00:03', level: 'INFO', msg: 'Establishing encrypted tunnel to NODE-AL-1' },
    { time: '00:00:04', level: 'WARN', msg: 'NODE-SG-4 latency exceeds threshold (24ms > 20ms)' },
    { time: '00:00:05', level: 'INFO', msg: 'RSA-4096 key rotation complete' },
    { time: '00:00:06', level: 'OK', msg: 'All 124 nodes reporting nominal status' },
    { time: '00:00:07', level: 'INFO', msg: 'Telemetry stream synchronized at 4.2 TB/s' },
    { time: '00:00:08', level: 'ERR', msg: 'NODE-SP-6 buffer overflow detected — auto-recovery initiated' },
    { time: '00:00:09', level: 'OK', msg: 'Buffer recovery complete. Resuming normal operation.' },
    { time: '00:00:10', level: 'INFO', msg: 'Awaiting next command...' },
  ];

  // Accordion data
  const accordionItems = [
    { title: 'Encryption Protocol', content: 'End-to-end AES-256-GCM encryption with perfect forward secrecy. Key rotation occurs every 3600 seconds across all active nodes.' },
    { title: 'Load Balancing', content: 'Adaptive round-robin with health-check weighting. Nodes below 90% health are deprioritized. Geographic proximity factored for latency optimization.' },
    { title: 'Disaster Recovery', content: 'Multi-region failover with < 500ms switchover. Cold standby nodes maintain 15-minute data snapshots. RPO: 0, RTO: < 30s.' },
    { title: 'Compliance & Audit', content: 'SOC 2 Type II certified. Full audit trail with immutable logging. GDPR-compliant data handling with regional data sovereignty controls.' },
  ];

  // Activity feed
  const activityFeed = [
    { user: 'SA', action: 'deployed v2.4.1 to production', time: '2m ago', icon: <GitMerge size={12} /> },
    { user: 'JK', action: 'rotated encryption keys', time: '14m ago', icon: <Key size={12} /> },
    { user: 'ML', action: 'scaled NODE-AL-1 to 16 cores', time: '1h ago', icon: <Cpu size={12} /> },
    { user: 'RP', action: 'resolved alert on NODE-SP-6', time: '2h ago', icon: <CheckCircle size={12} /> },
    { user: 'SA', action: 'updated firewall rules', time: '4h ago', icon: <Shield size={12} /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08070b] flex flex-col items-center justify-center text-violet-500 space-y-8">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute w-6 h-6 border border-violet-500/30 rotate-45 animate-[ping_2s_ease-in-out_infinite]"></div>
          <div className="absolute w-10 h-10 border border-violet-500/50 rotate-45 animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute w-16 h-16 border-2 border-violet-500 rotate-45 animate-[spin_3s_linear_infinite_reverse] shadow-[0_0_20px_rgba(139,92,246,0.3)]"></div>
          <div className="absolute w-2 h-2 bg-violet-500 animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.8em] font-black text-violet-400">Lumina_Core</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-slate-600">Initializing Handshake Protocol</span>
          </div>
          <div className="w-72 h-[2px] bg-white/[0.03] relative overflow-hidden rounded-full">
             <div className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          </div>
          <div className="flex gap-1">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-1.5 h-1.5 bg-violet-500/30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08070b] text-slate-400 font-sans selection:bg-violet-500/30 overflow-hidden text-[13px]">
      
      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-8 right-8 z-[200] animate-slideUp">
          <div className="bg-[#12101c] border border-violet-500/40 px-5 py-3 shadow-2xl shadow-violet-500/10 flex items-center gap-3">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-300">{toastMsg}</span>
            <button onClick={() => setToastVisible(false)} className="ml-2 text-slate-600 hover:text-white transition-colors">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Command Palette */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCommandOpen(false)}></div>
          <div className="relative w-full max-w-[520px] bg-[#0c0a14] border border-violet-500/30 shadow-2xl shadow-violet-500/10 animate-fadeIn">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Command size={16} className="text-violet-500" />
              <input
                type="text"
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-[12px] uppercase tracking-widest text-white placeholder:text-slate-700 outline-none"
                autoFocus
              />
              <Kbd>ESC</Kbd>
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="px-3 py-2 text-[8px] uppercase tracking-[0.2em] text-slate-700 font-bold">Quick Actions</div>
              {[
                { icon: <LayoutGrid size={14} />, label: 'Go to Dashboard', shortcut: '⌘D' },
                { icon: <Server size={14} />, label: 'View Infrastructure', shortcut: '⌘I' },
                { icon: <BarChart2 size={14} />, label: 'Open Analytics', shortcut: '⌘A' },
                { icon: <Settings size={14} />, label: 'Configuration', shortcut: '⌘,' },
                { icon: <Terminal size={14} />, label: 'Open Terminal', shortcut: '⌘T' },
                { icon: <RefreshCw size={14} />, label: 'Refresh All Nodes', shortcut: '⌘R' },
                { icon: <Download size={14} />, label: 'Export Telemetry Data', shortcut: '⌘E' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setIsCommandOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] uppercase tracking-widest text-slate-500 hover:text-white hover:bg-violet-500/10 transition-colors"
                >
                  <span className="text-slate-600">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <Kbd>{item.shortcut}</Kbd>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-[420px] bg-[#0c0a14] border border-violet-500/30 p-10 shadow-2xl shadow-violet-500/10 animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
            <div className="flex justify-between items-start mb-8 text-left">
              <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500">
                <AlertTriangle size={26} />
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-white transition-colors p-1"><X size={20} /></button>
            </div>
            <h3 className="text-xl font-light text-white mb-3 tracking-tight uppercase text-left">Execute Final Sync</h3>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed mb-6 text-left">
              Initiating final synchronization for <span className="text-violet-400 font-bold">Environment_Alpha</span>. This procedure is irreversible and will propagate to all 124 active nodes.
            </p>
            <div className="bg-red-500/[0.05] border border-red-500/20 p-4 mb-8 flex gap-3 items-start text-left">
              <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[9px] uppercase tracking-widest text-red-300/70 leading-relaxed">
                All in-flight transactions will be committed. Estimated downtime: <span className="text-red-400 font-bold">0.3s</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setIsModalOpen(false); showToast('Sync initiated successfully'); }} className="w-full py-4 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-violet-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-[0.98]">
                <span className="flex items-center justify-center gap-2"><Zap size={14} /> Confirm Sync</span>
              </button>
              <button onClick={() => setIsModalOpen(false)} className="w-full py-4 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-[72px] border-r border-white/[0.04] flex flex-col items-center py-6 gap-8 bg-[#060509] z-50">
          <div className="w-10 h-10 flex items-center justify-center relative group cursor-pointer mb-2" onClick={() => handleScrollTo('overview')}>
            <div className="w-6 h-6 border border-violet-500 rotate-45 group-hover:bg-violet-500/10 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"></div>
            <div className="absolute w-2 h-2 bg-violet-500 rotate-45 animate-pulse"></div>
          </div>
          
          <nav className="flex flex-col gap-2 flex-1">
            <Tooltip content="Dashboard"><NavIcon icon={<LayoutGrid size={18} />} active={activeTab === 'overview'} onClick={() => handleScrollTo('overview')} /></Tooltip>
            <Tooltip content="Infrastructure"><NavIcon icon={<Server size={18} />} active={activeTab === 'infrastructure'} onClick={() => handleScrollTo('infrastructure')} /></Tooltip>
            <Tooltip content="Analytics"><NavIcon icon={<BarChart2 size={18} />} active={activeTab === 'stats'} onClick={() => handleScrollTo('stats')} /></Tooltip>
            <Tooltip content="Configuration"><NavIcon icon={<Sliders size={18} />} active={activeTab === 'config'} onClick={() => handleScrollTo('config')} /></Tooltip>
            <Tooltip content="Terminal"><NavIcon icon={<Terminal size={18} />} active={activeTab === 'terminal'} onClick={() => handleScrollTo('terminal')} /></Tooltip>
          </nav>

          <div className="flex flex-col items-center gap-4 mt-auto">
            <div className="w-8 h-[1px] bg-white/[0.06]"></div>
            <Tooltip content="Command ⌘K">
              <button onClick={() => setIsCommandOpen(true)} className="p-2 text-slate-800 hover:text-violet-400 transition-colors">
                <Command size={16} />
              </button>
            </Tooltip>
            <Tooltip content="Security: Active">
              <div className="relative">
                <ShieldCheck size={16} className="text-emerald-600 hover:text-emerald-400 transition-colors cursor-pointer" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </Tooltip>
          </div>
        </aside>

        {/* Main Interface Wrapper */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <header className="h-16 px-8 flex items-center justify-between border-b border-white/[0.04] bg-[#08070b]/90 backdrop-blur-xl z-40">
            <div className="flex items-center gap-4">
              <span className="text-slate-100 font-light tracking-wide text-base uppercase">Lumina <span className="text-violet-500 font-black italic">Core</span></span>
              <span className="text-white/[0.06] text-xs px-2 select-none">/</span>
              <span className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.4em]">{activeTab}</span>
              <Badge variant="success">v2.4.1</Badge>
            </div>
            
            <div className="flex items-center gap-5">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setIsCommandOpen(true)}
                className="hidden md:flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[10px] text-slate-600 uppercase tracking-widest hover:border-violet-500/30 transition-colors group"
              >
                <Search size={12} className="group-hover:text-violet-500 transition-colors" />
                <span>Search...</span>
                <span className="flex gap-0.5 ml-3"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
              </button>

              {/* Search Box */}
              <div className="relative" ref={searchRef}>
                <div className="flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-1.5 focus-within:border-violet-500/50 transition-colors group">
                  <Search size={14} className="text-slate-600 group-focus-within:text-violet-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Filter nodes..."
                    className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest text-slate-200 placeholder:text-slate-600 w-36"
                    onFocus={() => setIsSearchFocused(true)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {isSearchFocused && searchQuery.length > 0 && (
                  <div className="absolute top-[100%] left-0 right-0 bg-[#0c0a14] border border-violet-500/30 z-[70] p-1 shadow-2xl animate-fadeIn mt-[-1px]">
                    {filteredSuggestions.length > 0 ? filteredSuggestions.map((s, idx) => (
                      <button key={idx} onClick={() => { setSearchQuery(s); setIsSearchFocused(false); }} className="w-full text-left px-3 py-2 text-[9px] uppercase tracking-widest text-slate-500 hover:text-white hover:bg-violet-500/10 transition-colors flex items-center gap-2">
                        <Hash size={10} className="text-slate-700" />
                        {s}
                      </button>
                    )) : (
                      <div className="px-3 py-2 text-[9px] uppercase tracking-widest text-slate-700">No matches found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`relative p-2 transition-colors ${isNotificationsOpen ? 'text-violet-500' : 'text-slate-700 hover:text-slate-300'}`}>
                  <Bell size={16} />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-violet-500 shadow-[0_0_8px_#8b5cf6] rounded-full"></div>
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full w-80 bg-[#0c0a14] border border-violet-500/30 shadow-2xl z-[70] animate-fadeIn mt-[-1px]">
                    <div className="flex justify-between items-center p-4 border-b border-white/[0.04]">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Activity Feed</span>
                      <div className="flex items-center gap-2">
                        <Badge>3 new</Badge>
                        <button onClick={() => setIsNotificationsOpen(false)} className="text-[9px] text-violet-500 uppercase hover:underline">Clear</button>
                      </div>
                    </div>
                    <div className="p-2 space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                      <NotificationItem title="Anomalous Signal" msg="Node_7G reporting 14% variance in harmonic frequency." time="2m ago" urgent />
                      <NotificationItem title="Security Log" msg="Successful rotation of RSA-4096 keys across all clusters." time="1h ago" />
                      <NotificationItem title="Deployment" msg="v2.4.1 deployed to production environment. All checks passed." time="3h ago" />
                      <NotificationItem title="Scaling Event" msg="NODE-AL-1 auto-scaled to 16 cores due to traffic spike." time="5h ago" />
                    </div>
                    <div className="p-3 border-t border-white/[0.04]">
                      <button className="w-full text-center text-[9px] uppercase tracking-widest text-violet-500 hover:text-violet-400 transition-colors py-1">
                        View All Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
                  <Avatar initials="SA" status="online" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full w-60 bg-[#0c0a14] border border-violet-500/30 shadow-2xl z-[70] animate-fadeIn mt-[-1px]">
                    <div className="p-5 border-b border-white/[0.04] flex items-center gap-3">
                      <Avatar initials="SA" size="lg" status="online" />
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-white uppercase tracking-widest">Sys_Admin_01</div>
                        <div className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-tighter">Clearance Level 4</div>
                        <Badge variant="success">Online</Badge>
                      </div>
                    </div>
                    <div className="p-1">
                      <ProfileMenuItem icon={<User size={14}/>} label="Profile" />
                      <ProfileMenuItem icon={<Settings size={14}/>} label="Preferences" />
                      <ProfileMenuItem icon={<Key size={14}/>} label="API Keys" />
                      <ProfileMenuItem icon={<Shield size={14}/>} label="Security" />
                      <div className="my-1 h-[1px] bg-white/[0.04]"></div>
                      <ProfileMenuItem icon={<LogOut size={14}/>} label="Terminate Session" danger />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Master Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-20 custom-scrollbar">
            
            {/* ═══════════════════════════════════════════════════════ */}
            {/* OVERVIEW SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section ref={sections.overview} className="space-y-10 scroll-mt-16">
              <SectionHeader title="Global_Insights" badge={<div className="flex items-center gap-2 text-[9px] text-emerald-500 uppercase tracking-widest"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> System_Live</div>} />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatWidget label="Uptime" value={`${counters.uptime}%`} trend="+0.01%" icon={<Activity size={14} />} color="violet" />
                <StatWidget label="Bandwidth" value={`${counters.bandwidth} TB/s`} trend="+12%" icon={<Wifi size={14} />} color="cyan" />
                <StatWidget label="Latency" value={`${counters.latency}ms`} trend="-2ms" icon={<Zap size={14} />} color="amber" />
                <StatWidget label="Active Nodes" value={`${counters.nodes}`} trend="stable" icon={<Server size={14} />} color="emerald" />
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard icon={<Cpu size={16} />} label="CPU Cluster" value="67%" status="nominal" />
                <StatusCard icon={<HardDrive size={16} />} label="Storage Pool" value="2.4 PB" status="nominal" />
                <StatusCard icon={<Network size={16} />} label="Network I/O" value="12.8 Gbps" status="warning" />
              </div>

              {/* Callout */}
              <div className="border border-violet-500/20 bg-gradient-to-r from-violet-500/[0.04] to-transparent p-5 flex gap-4 items-center group hover:border-violet-500/30 transition-colors">
                <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Info size={16} className="text-violet-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] uppercase tracking-widest text-violet-200/70 leading-relaxed">
                    Maintenance scheduled for <span className="text-violet-400 font-bold">Node_Sigma</span> in 12 hours. European clusters will assume priority routing.
                  </p>
                </div>
                <button className="text-[9px] uppercase tracking-widest text-violet-500 hover:text-violet-400 transition-colors whitespace-nowrap border border-violet-500/20 px-3 py-1.5 hover:bg-violet-500/10">
                  Details
                </button>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="border border-white/[0.04] bg-white/[0.01] p-6 space-y-6 group relative overflow-hidden text-left hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Signal Resonance</h3>
                    <div className="flex items-center gap-2">
                      <button className="text-[8px] uppercase tracking-widest text-violet-500 bg-violet-500/10 px-2 py-1 border border-violet-500/20">24H</button>
                      <button className="text-[8px] uppercase tracking-widest text-slate-600 hover:text-slate-400 px-2 py-1 border border-transparent hover:border-white/10 transition-colors">7D</button>
                      <button className="text-[8px] uppercase tracking-widest text-slate-600 hover:text-slate-400 px-2 py-1 border border-transparent hover:border-white/10 transition-colors">30D</button>
                    </div>
                  </div>
                  <div className="h-64 relative cursor-crosshair" onMouseMove={handleLineMouseMove} onMouseLeave={() => setLineTooltip({ ...lineTooltip, visible: false })}>
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0,1,2,3,4].map(i => (
                        <div key={i} className="w-full h-[1px] bg-white/[0.03]"></div>
                      ))}
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 900 256" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      <path d="M0 140 Q 80 180, 150 120 T 300 100 T 450 60 T 600 90 T 750 50 T 900 80 L 900 256 L 0 256 Z" fill="url(#areaGlow)" />
                      <path d="M0 140 Q 80 180, 150 120 T 300 100 T 450 60 T 600 90 T 750 50 T 900 80" fill="none" stroke="url(#lineGrad)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      {/* Second line for comparison */}
                      <path d="M0 180 Q 100 160, 200 170 T 400 130 T 600 150 T 900 110" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" vectorEffect="non-scaling-stroke" />
                    </svg>
                    {/* Crosshair & tooltip overlay */}
                    {lineTooltip.visible && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 bottom-0 w-[1px] bg-violet-500/20" style={{ left: lineTooltip.x }}></div>
                        <div className="absolute w-[10px] h-[10px] border-2 border-violet-500 bg-[#08070b] rounded-full -translate-x-1/2 -translate-y-1/2" style={{ left: lineTooltip.x, top: lineTooltip.y }}></div>
                        <div className="absolute w-[4px] h-[4px] bg-violet-500 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ left: lineTooltip.x, top: lineTooltip.y }}></div>
                        <div 
                          className="absolute bg-[#12101c] border border-violet-500/50 p-2.5 text-[8px] uppercase tracking-widest text-violet-400 shadow-2xl"
                          style={{ 
                            left: lineTooltip.x > (window.innerWidth * 0.3) ? lineTooltip.x - 140 : lineTooltip.x + 16,
                            top: Math.max(0, lineTooltip.y - 30)
                          }}
                        >
                          <div className="font-bold border-b border-violet-500/20 mb-1 pb-1 text-violet-300">Telemetry</div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-violet-500"></span>
                            {lineTooltip.value}% Amplitude
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-[8px] uppercase tracking-widest text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-violet-500"></span> Primary</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-cyan-500 opacity-40" style={{borderTop: '1px dashed'}}></span> Baseline</span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="border border-white/[0.04] bg-white/[0.01] p-6 space-y-6 text-left hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Utilization Spectrum</h3>
                    <Badge variant="info">Real-time</Badge>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 relative">
                    {[45, 75, 55, 95, 65, 85, 50, 90, 40, 70, 60, 80].map((h, i) => (
                      <div key={i} className="flex-1 h-full relative group cursor-help" onMouseEnter={(e) => handleBarHover(e, h, i)} onMouseLeave={() => setBarTooltip({ ...barTooltip, visible: false })}>
                        <div className={`absolute bottom-0 left-[1px] right-[1px] transition-all duration-500 ${h > 90 ? 'bg-gradient-to-t from-red-900/40 via-red-600/30 to-red-500/50' : 'bg-gradient-to-t from-violet-900/30 via-violet-700/25 to-violet-500/45'}`} style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}>
                          <div className={`absolute top-0 left-0 w-full h-[2px] ${h > 90 ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]'}`}></div>
                          <div className="absolute inset-0 bg-violet-400/0 group-hover:bg-violet-400/[0.08] transition-colors duration-200"></div>
                        </div>
                      </div>
                    ))}
                    {barTooltip.visible && barTooltip.id !== null && (
                      <div className="absolute pointer-events-none bg-[#12101c] border border-violet-500/50 p-2.5 text-[8px] uppercase tracking-widest text-violet-400 z-[100] shadow-2xl -translate-x-1/2" style={{ left: barTooltip.x, top: barTooltip.y - 50 }}>
                        <div className="font-bold text-violet-300 mb-0.5">Node_{barTooltip.id + 1}</div>
                        {barTooltip.value}% Utilization
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-violet-500/50"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-[7px] uppercase tracking-widest text-slate-600">
                    {['N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12'].map(n => <span key={n}>{n}</span>)}
                  </div>
                </div>
              </div>

              {/* Mini Charts Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MiniChart label="Requests/s" value="847K" change="+12.4%" positive data={[30,45,40,60,55,70,65,80,75,90]} />
                <MiniChart label="Error Rate" value="0.02%" change="-0.01%" positive data={[50,45,40,35,30,25,20,15,10,8]} />
                <MiniChart label="P99 Latency" value="18ms" change="+2ms" positive={false} data={[20,25,22,28,24,30,26,32,28,35]} />
                <MiniChart label="Throughput" value="4.2 TB" change="+0.3TB" positive data={[40,50,55,60,65,70,72,75,78,82]} />
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* INFRASTRUCTURE SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section ref={sections.infrastructure} className="space-y-10 scroll-mt-16">
              <SectionHeader title="Infrastructure_Grid" badge={<Badge>6 Regions</Badge>} />

              {/* Node Table */}
              <div className="border border-white/[0.04] bg-white/[0.01] overflow-hidden hover:border-white/[0.08] transition-colors">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Node Registry</h3>
                    <Badge variant="success">All Synced</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 border border-white/[0.06] text-slate-600 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                      <RefreshCw size={12} />
                    </button>
                    <button className="p-1.5 border border-white/[0.06] text-slate-600 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                      <Download size={12} />
                    </button>
                    <button className="p-1.5 border border-white/[0.06] text-slate-600 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                      <Maximize2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.04]">
                        <th className="px-6 py-3 text-left text-[8px] uppercase tracking-[0.3em] text-slate-700 font-bold">ID</th>
                        <th className="px-6 py-3 text-left text-[8px] uppercase tracking-[0.3em] text-slate-700 font-bold">Region</th>
                        <th className="px-6 py-3 text-left text-[8px] uppercase tracking-[0.3em] text-slate-700 font-bold">Load</th>
                        <th className="px-6 py-3 text-left text-[8px] uppercase tracking-[0.3em] text-slate-700 font-bold">Latency</th>
                        <th className="px-6 py-3 text-left text-[8px] uppercase tracking-[0.3em] text-slate-700 font-bold">Uptime</th>
                        <th className="px-6 py-3 text-left text-[8px] uppercase tracking-[0.3em] text-slate-700 font-bold">Status</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {nodeData.map((node, i) => (
                        <TableRow key={i} {...node} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.04]">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500">Showing 6 of 124 nodes</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2.5 py-1 border border-white/[0.06] text-[9px] text-slate-600 hover:text-white hover:border-violet-500/30 transition-all">
                      <ArrowLeft size={10} />
                    </button>
                    <button className="px-2.5 py-1 border border-violet-500/30 bg-violet-500/10 text-[9px] text-violet-400">1</button>
                    <button className="px-2.5 py-1 border border-white/[0.06] text-[9px] text-slate-600 hover:text-white hover:border-violet-500/30 transition-all">2</button>
                    <button className="px-2.5 py-1 border border-white/[0.06] text-[9px] text-slate-600 hover:text-white hover:border-violet-500/30 transition-all">3</button>
                    <button className="px-2.5 py-1 border border-white/[0.06] text-[9px] text-slate-600 hover:text-white hover:border-violet-500/30 transition-all">
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Node Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodeData.map((node, i) => (
                  <NodeCard key={i} {...node} />
                ))}
              </div>

              {/* World Map Visualization (abstract) */}
              <div className="border border-white/[0.04] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Global Topology</h3>
                  <div className="flex items-center gap-4 text-[8px] uppercase tracking-widest text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Online</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Warning</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Critical</span>
                  </div>
                </div>
                <div className="relative h-48 bg-[#0a0913] border border-white/[0.03] overflow-hidden">
                  {/* Abstract grid background */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({length: 12}).map((_, i) => (
                      <div key={`h-${i}`} className="absolute w-full h-[1px] bg-violet-500/10" style={{top: `${(i+1) * 100/13}%`}}></div>
                    ))}
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={`v-${i}`} className="absolute h-full w-[1px] bg-violet-500/10" style={{left: `${(i+1) * 100/21}%`}}></div>
                    ))}
                  </div>
                  {/* Node points */}
                  {[
                    { x: '15%', y: '35%', status: 'online', label: 'Oregon' },
                    { x: '25%', y: '65%', status: 'critical', label: 'São Paulo' },
                    { x: '48%', y: '30%', status: 'online', label: 'Frankfurt' },
                    { x: '70%', y: '40%', status: 'warning', label: 'Singapore' },
                    { x: '80%', y: '30%', status: 'online', label: 'Tokyo' },
                    { x: '85%', y: '70%', status: 'online', label: 'Sydney' },
                  ].map((point, i) => (
                    <div key={i} className="absolute group" style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}>
                      <div className={`w-3 h-3 rounded-full ${point.status === 'online' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]' : point.status === 'warning' ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'} animate-pulse`}></div>
                      <div className={`absolute w-8 h-8 rounded-full border ${point.status === 'online' ? 'border-emerald-500/20' : point.status === 'warning' ? 'border-amber-500/20' : 'border-red-500/20'} -inset-2.5 animate-ping opacity-30`}></div>
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#12101c] border border-violet-500/40 px-2 py-1 text-[8px] uppercase tracking-widest text-slate-300 z-10">
                        {point.label}
                      </div>
                      {/* Connection lines */}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* ANALYTICS / STATS SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section ref={sections.stats} className="space-y-10 scroll-mt-16">
              <SectionHeader title="Analytics_Engine" badge={<Badge variant="info">Deep Insights</Badge>} />

              {/* Donut + Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donut Chart */}
                <div className="border border-white/[0.04] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Resource Distribution</h3>
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="155 238.76" strokeLinecap="butt" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="48 238.76" strokeDashoffset="-155" strokeLinecap="butt" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="24 238.76" strokeDashoffset="-203" strokeLinecap="butt" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-light text-white">65%</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-600">Compute</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-slate-500"><span className="w-2 h-2 bg-violet-500"></span>Compute</span>
                      <span className="text-[9px] font-mono text-slate-400">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-slate-500"><span className="w-2 h-2 bg-cyan-500"></span>Storage</span>
                      <span className="text-[9px] font-mono text-slate-400">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-slate-500"><span className="w-2 h-2 bg-amber-500"></span>Network</span>
                      <span className="text-[9px] font-mono text-slate-400">10%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-slate-500"><span className="w-2 h-2 bg-white/10"></span>Reserved</span>
                      <span className="text-[9px] font-mono text-slate-400">5%</span>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="border border-white/[0.04] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Activity Timeline</h3>
                  <div className="space-y-0">
                    {activityFeed.map((item, i) => (
                      <div key={i} className="flex gap-3 py-3 border-b border-white/[0.03] last:border-0 group hover:bg-white/[0.01] -mx-2 px-2 transition-colors">
                        <div className="flex flex-col items-center gap-1">
                          <Avatar initials={item.user} size="sm" />
                          {i < activityFeed.length - 1 && <div className="w-[1px] flex-1 bg-white/[0.04]"></div>}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            <span className="text-white font-bold uppercase tracking-wider">{item.user}</span>
                            <span className="text-slate-600"> — </span>
                            {item.action}
                          </p>
                          <span className="text-[8px] uppercase tracking-widest text-slate-700 mt-1 flex items-center gap-1">
                            <Clock size={8} /> {item.time}
                          </span>
                        </div>
                        <span className="text-slate-700 group-hover:text-violet-500 transition-colors pt-1">{item.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Stack */}
                <div className="space-y-4">
                  <MetricBar label="CPU Usage" value={78} color="violet" />
                  <MetricBar label="Memory" value={62} color="cyan" />
                  <MetricBar label="Disk I/O" value={45} color="emerald" />
                  <MetricBar label="Network" value={88} color="amber" />
                  <MetricBar label="GPU Compute" value={34} color="pink" />
                  <MetricBar label="Cache Hit Rate" value={96} color="violet" />
                  
                  {/* Code snippet */}
                  <div className="border border-white/[0.04] bg-[#0a0913] p-4 mt-4 text-left relative group hover:border-white/[0.08] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[8px] uppercase tracking-widest text-slate-700 flex items-center gap-1.5"><Code size={10} /> API Endpoint</span>
                      <button 
                        onClick={() => handleCopy('curl -X POST https://api.lumina.core/v2/sync')}
                        className="text-slate-700 hover:text-violet-400 transition-colors"
                      >
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <code className="text-[10px] font-mono text-violet-400 leading-relaxed block">
                      <span className="text-emerald-500">curl</span> <span className="text-slate-500">-X POST</span><br/>
                      <span className="text-cyan-400">https://api.lumina.core/v2/sync</span><br/>
                      <span className="text-slate-500">-H</span> <span className="text-amber-400">"Authorization: Bearer $TOKEN"</span>
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* CONFIGURATION SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section ref={sections.config} className="space-y-10 scroll-mt-16">
              <div className="flex justify-between items-end border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-light text-white uppercase tracking-widest leading-none">Interface_Matrix</h2>
                  <Badge>Components</Badge>
                </div>
                <div className="relative" ref={popoverRef}>
                  <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="p-2 border border-white/[0.06] hover:border-violet-500/50 text-slate-600 hover:text-violet-400 transition-all">
                    <Info size={14} />
                  </button>
                  {isPopoverOpen && (
                    <div className="absolute bottom-[calc(100%+12px)] right-0 w-72 bg-[#0c0a14] border border-violet-500/30 p-5 z-[90] shadow-2xl animate-fadeIn">
                       <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2 text-left">Matrix_Metadata</h4>
                       <p className="text-[9px] text-slate-500 uppercase tracking-tighter leading-relaxed italic text-left">Atomic primitives designed for systematic resonance across the Lumina Core ecosystem. Every element follows strict design tokens.</p>
                       <div className="absolute top-full right-[13px] border-x-6 border-x-transparent border-t-6 border-t-violet-500/30"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-white/[0.04]">
                <div className="flex gap-0">
                  {['Controls', 'Inputs', 'Feedback', 'Actions'].map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setTabIndex(i)}
                      className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${tabIndex === i ? 'text-violet-400 border-violet-500 bg-violet-500/[0.03]' : 'text-slate-600 border-transparent hover:text-slate-400 hover:bg-white/[0.01]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                
                {/* Column 1: Inputs & Selection */}
                <div className="space-y-6">
                  <div className="space-y-8 bg-[#0c0a14] border border-white/[0.04] p-6 relative overflow-visible hover:border-white/[0.08] transition-colors">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Selection_Primitives</h3>
                    
                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Uplink Configuration</label>
                      {[
                        { label: 'Establish Secure Uplink', state: checkbox, setter: setCheckbox },
                        { label: 'Enable Compression', state: checkbox2, setter: setCheckbox2 },
                        { label: 'Auto-reconnect', state: checkbox3, setter: setCheckbox3 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => item.setter(!item.state)}>
                          <div className={`w-4 h-4 border transition-all flex items-center justify-center ${item.state ? 'bg-violet-600 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'border-white/20 group-hover:border-violet-500/50'}`}>
                            {item.state && <Check size={10} className="text-white" strokeWidth={4} />}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 select-none group-hover:text-slate-300 transition-colors">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Radio Group */}
                    <div className="space-y-3">
                       <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Optimization Protocol</label>
                       <div className="flex flex-col gap-2">
                         {[
                           { value: 'performance', label: 'Performance', desc: 'Maximum throughput' },
                           { value: 'redundancy', label: 'Redundancy', desc: 'Triple replication' },
                           { value: 'efficiency', label: 'Efficiency', desc: 'Cost optimized' },
                         ].map((mode) => (
                           <div key={mode.value} className={`flex items-start gap-3 cursor-pointer group p-2.5 border transition-all ${radioValue === mode.value ? 'border-violet-500/30 bg-violet-500/[0.03]' : 'border-transparent hover:bg-white/[0.01]'}`} onClick={() => setRadioValue(mode.value)}>
                             <div className={`w-4 h-4 border flex items-center justify-center transition-all mt-0.5 shrink-0 ${radioValue === mode.value ? 'border-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.2)]' : 'border-white/20 group-hover:border-white/40'}`}>
                                {radioValue === mode.value && <div className="w-1.5 h-1.5 bg-violet-400"></div>}
                             </div>
                             <div>
                               <span className={`text-[10px] uppercase tracking-widest transition-colors block ${radioValue === mode.value ? 'text-violet-200 font-bold' : 'text-slate-500'}`}>{mode.label}</span>
                               <span className="text-[8px] uppercase tracking-widest text-slate-700">{mode.desc}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>

                    {/* Select */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Resonance Channel</label>
                      <div className="relative" ref={selectRef}>
                        <button onClick={() => setIsSelectOpen(!isSelectOpen)} className={`w-full flex items-center justify-between border px-4 py-3 text-[10px] uppercase tracking-widest transition-all ${isSelectOpen ? 'border-violet-500 bg-violet-500/5 shadow-[0_0_15px_rgba(139,92,246,0.05)]' : 'border-white/10 hover:border-white/20'}`}>
                          <span>{selectedProtocol}</span>
                          <ChevronDown size={14} className={`transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSelectOpen && (
                          <div className="absolute top-[100%] left-0 right-0 bg-[#0c0a14] border border-violet-500/30 z-[80] p-1 shadow-2xl mt-[-1px] animate-fadeIn">
                            {['Secure WebSocket (WSS)', 'gRPC Stream v2', 'Legacy REST', 'GraphQL Federation'].map(p => (
                              <button key={p} onClick={() => {setSelectedProtocol(p); setIsSelectOpen(false);}} className={`w-full text-left px-4 py-3 text-[9px] uppercase tracking-widest transition-colors flex items-center justify-between group ${selectedProtocol === p ? 'bg-violet-500/10 text-violet-400' : 'text-slate-500 hover:bg-violet-500/5 hover:text-white'}`}>
                                {p} {selectedProtocol === p && <Check size={12} className="text-violet-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Inputs & Toggles */}
                <div className="space-y-6">
                  <div className="bg-[#0c0a14] border border-white/[0.04] p-6 space-y-8 hover:border-white/[0.08] transition-colors">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Input_Primitives</h3>
                    
                    {/* Text Input */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Node Identifier</label>
                      <input 
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Enter node ID..."
                        className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[11px] uppercase tracking-tighter text-slate-200 focus:outline-none focus:border-violet-500/50 transition-colors placeholder:text-slate-800"
                      />
                      <span className="text-[8px] uppercase tracking-widest text-slate-600">Alphanumeric, max 32 characters</span>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Access Token</label>
                      <div className="relative">
                        <input 
                          type={passwordVisible ? 'text' : 'password'}
                          defaultValue="sk_live_lumina_4096_xk9"
                          className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 pr-10 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                        <button 
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-violet-400 transition-colors"
                        >
                          {passwordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Resonance Frequency</label>
                        <span className="text-[10px] font-mono text-violet-400 font-bold">{sliderVal}%</span>
                      </div>
                      <div className="relative py-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderVal} 
                          onChange={(e) => setSliderVal(Number(e.target.value))} 
                          className="w-full appearance-none cursor-pointer accent-violet-500 [&::-webkit-slider-runnable-track]:h-[6px] [&::-webkit-slider-runnable-track]:rounded-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(139,92,246,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-4px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-violet-500 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-track]:h-[6px]"
                          style={{ background: `linear-gradient(to right, #7c3aed ${sliderVal}%, rgba(255,255,255,0.04) ${sliderVal}%)` }}
                        />
                      </div>
                      <div className="flex justify-between text-[7px] uppercase tracking-widest text-slate-600">
                        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">System Toggles</label>
                      {[
                        { label: 'Dark Mode Protocol', state: toggle, setter: setToggle, icon: <Moon size={12} /> },
                        { label: 'Auto-scaling', state: toggle2, setter: setToggle2, icon: <TrendingUp size={12} /> },
                        { label: 'Telemetry Stream', state: toggle3, setter: setToggle3, icon: <Radio size={12} /> },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <span className="text-slate-600">{item.icon}</span>
                            {item.label}
                          </span>
                          <button
                            onClick={() => item.setter(!item.state)}
                            className={`w-10 h-5 relative transition-all ${item.state ? 'bg-violet-600 shadow-[0_0_12px_rgba(139,92,246,0.3)]' : 'bg-white/[0.06]'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${item.state ? 'left-[22px]' : 'left-0.5'} shadow-sm`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 3: Feedback & Actions */}
                <div className="space-y-6">
                  <div className="bg-[#0c0a14] border border-white/[0.04] p-6 space-y-8 hover:border-white/[0.08] transition-colors">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Feedback_Matrix</h3>
                    
                    {/* Progress bars */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                          <span>Buffer Utilization</span>
                          <span className="text-violet-500 font-mono">84.2%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.04] relative overflow-hidden">
                          <div className="absolute h-full bg-gradient-to-r from-violet-700 to-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.4)] transition-all duration-1000" style={{ width: '84.2%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                          <span>Memory Pool</span>
                          <span className="text-cyan-500 font-mono">62.8%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.04] relative overflow-hidden">
                          <div className="absolute h-full bg-gradient-to-r from-cyan-700 to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-1000" style={{ width: '62.8%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                          <span>Threat Level</span>
                          <span className="text-emerald-500 font-mono">LOW</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.04] relative overflow-hidden">
                          <div className="absolute h-full bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-1000" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">System Log</label>
                      <textarea 
                        className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-[10px] font-mono text-slate-400 focus:outline-none focus:border-violet-500/50 transition-colors h-28 resize-none placeholder:text-slate-800 custom-scrollbar overflow-y-auto cursor-text"
                        defaultValue={`[OK] SESSION_ALPHA_ID_0x99\n[OK] NODE_HANDSHAKE_COMPLETE\n[OK] ENCRYPTION_STREAM_SYNCED\n[..] BUFFER_FLUSH_SCHEDULED\n[OK] TELEMETRY_LATENCY_NOMINAL\n[>>] AWAITING_DEPLOYMENT...`}
                      />
                    </div>

                    {/* Blockquote */}
                    <div className="border-l-2 border-violet-500/40 bg-violet-500/[0.02] p-4 relative">
                      <Sparkles size={10} className="text-violet-800 absolute top-2 right-2" />
                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 leading-relaxed italic">
                        "The resonance of the nodes defines the architecture beyond physical silicon."
                      </p>
                      <span className="text-[8px] uppercase tracking-widest text-slate-700 mt-2 block">— Chief Architect</span>
                    </div>

                    {/* Badges showcase */}
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">Status Badges</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="danger">Critical</Badge>
                        <Badge variant="info">Info</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-[#0c0a14] border border-white/[0.04] p-6 space-y-6 hover:border-white/[0.08] transition-colors">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Action_Primitives</h3>
                    
                    {/* Typography */}
                    <div className="space-y-2">
                      <h1 className="text-2xl font-light text-white tracking-tighter uppercase leading-none">Header_A</h1>
                      <h2 className="text-lg font-light text-slate-300 tracking-tight uppercase">Header_B</h2>
                      <h3 className="text-sm text-slate-500 uppercase tracking-widest">Header_C</h3>
                      <code className="bg-violet-500/10 text-violet-400 px-2 py-1 text-[10px] font-mono border border-violet-500/20 inline-block">0xFF_LINK_ESTABLISHED</code>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 border-t border-white/[0.04] space-y-3">
                      <div className="flex gap-3">
                        <button onClick={() => showToast('Deployment initiated')} className="flex-1 py-3 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-violet-500 transition-all shadow-[0_4px_15px_rgba(139,92,246,0.3)] active:scale-[0.98] flex items-center justify-center gap-2">
                          <Zap size={12} /> Deploy
                        </button>
                        <button className="flex-1 py-3 border border-violet-500/40 text-violet-400 text-[10px] font-bold uppercase tracking-widest hover:bg-violet-500/10 transition-all flex items-center justify-center gap-2">
                          <Shield size={12} /> Verify
                        </button>
                      </div>
                      <button className="w-full py-3 border border-white/[0.06] text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-white/[0.02] hover:text-white transition-all flex items-center justify-center gap-2">
                        <Download size={12} /> Export Configuration
                      </button>
                      
                      {/* Split Button */}
                      <div className="flex relative" ref={splitRef}>
                        <button onClick={() => setIsModalOpen(true)} className="flex-1 py-3.5 bg-violet-900/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-violet-900/30 text-left px-5 flex items-center gap-2">
                          <Target size={12} /> Execute Final Sync
                        </button>
                        <button onClick={() => setIsSplitOpen(!isSplitOpen)} className="w-10 bg-violet-900/20 border border-violet-500/30 border-l-0 text-violet-400 flex items-center justify-center transition-all hover:bg-violet-900/30">
                          <ChevronDown size={14} className={`transition-transform ${isSplitOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSplitOpen && (
                          <div className="absolute bottom-full right-0 w-52 mb-[-1px] bg-[#0c0a14] border border-violet-500/30 z-[90] shadow-2xl animate-fadeIn">
                            {[
                              { icon: <Database size={10} />, label: 'Backup Local' },
                              { icon: <Download size={10} />, label: 'Export Metrics' },
                              { icon: <RefreshCw size={10} />, label: 'Flush Buffer' },
                              { icon: <GitBranch size={10} />, label: 'Create Branch' },
                            ].map(o => (
                              <button key={o.label} onClick={() => { setIsSplitOpen(false); showToast(`${o.label} initiated`); }} className="w-full text-left px-4 py-2.5 text-[9px] uppercase tracking-widest text-slate-500 hover:text-white hover:bg-violet-500/10 transition-colors border-b border-white/[0.03] last:border-0 flex items-center gap-2">
                                <span className="text-slate-700">{o.icon}</span> {o.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion */}
              <div className="border border-white/[0.04] bg-white/[0.01] overflow-hidden hover:border-white/[0.08] transition-colors">
                <div className="px-6 py-4 border-b border-white/[0.04]">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Protocol Documentation</h3>
                </div>
                {accordionItems.map((item, i) => (
                  <div key={i} className="border-b border-white/[0.03] last:border-0">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.01] transition-colors group"
                    >
                      <span className={`text-[11px] uppercase tracking-widest transition-colors ${openAccordion === i ? 'text-violet-400 font-bold' : 'text-slate-400 group-hover:text-slate-300'}`}>
                        {item.title}
                      </span>
                      <ChevronDown size={14} className={`text-slate-600 transition-transform ${openAccordion === i ? 'rotate-180 text-violet-500' : ''}`} />
                    </button>
                    {openAccordion === i && (
                      <div className="px-6 pt-1 pb-6 animate-fadeIn">
                        <p className="text-[10px] text-slate-400 leading-relaxed border-l-2 border-violet-500/20 pl-4 mt-1">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TERMINAL SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section ref={sections.terminal} className="space-y-10 scroll-mt-16 pb-32">
              <SectionHeader title="System_Terminal" badge={<Badge variant="success">Connected</Badge>} />
              
              <div className="border border-white/[0.04] bg-[#06050a] overflow-hidden hover:border-white/[0.08] transition-colors">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></div>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-600 font-mono">lumina_core@sys — bash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-slate-700 hover:text-slate-400 transition-colors"><Maximize2 size={12} /></button>
                    <button className="text-slate-700 hover:text-slate-400 transition-colors"><Copy size={12} /></button>
                  </div>
                </div>
                {/* Terminal Body */}
                <div className="p-5 font-mono text-[11px] space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="flex gap-3 group hover:bg-white/[0.01] -mx-2 px-2 py-0.5 transition-colors">
                      <span className="text-slate-700 shrink-0">{line.time}</span>
                      <span className={`shrink-0 w-10 text-right ${
                        line.level === 'OK' ? 'text-emerald-500' :
                        line.level === 'WARN' ? 'text-amber-500' :
                        line.level === 'ERR' ? 'text-red-500' :
                        'text-slate-600'
                      }`}>[{line.level}]</span>
                      <span className={`${
                        line.level === 'ERR' ? 'text-red-300/70' :
                        line.level === 'WARN' ? 'text-amber-300/70' :
                        line.level === 'OK' ? 'text-emerald-300/70' :
                        'text-slate-400'
                      }`}>{line.msg}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.03]">
                    <span className="text-violet-500">$</span>
                    <span className="text-slate-400 animate-pulse">▌</span>
                  </div>
                </div>
              </div>

              {/* System Info Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SystemInfoCard icon={<Cpu size={16} />} label="Processor" value="ARM Neoverse V2" sub="128 Cores @ 3.6 GHz" />
                <SystemInfoCard icon={<HardDrive size={16} />} label="Storage" value="NVMe SSD Array" sub="2.4 PB / 4.0 PB" />
                <SystemInfoCard icon={<Database size={16} />} label="Memory" value="DDR5 ECC" sub="2 TB / 4 TB Allocated" />
                <SystemInfoCard icon={<Globe size={16} />} label="Network" value="25 GbE × 4" sub="Redundant Mesh Topology" />
              </div>

              {/* Skeleton Loading Demo */}
              <div className="border border-white/[0.04] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Pending Data Stream</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-2 w-2/5" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-2 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-14" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.04] pt-8 mt-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-violet-500/50 rotate-45 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-violet-500"></div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Lumina Core</span>
                    <span className="text-[8px] text-slate-600">© 2025</span>
                  </div>
                  <div className="flex items-center gap-6 text-[8px] uppercase tracking-widest text-slate-500">
                    <span className="hover:text-violet-400 cursor-pointer transition-colors">Documentation</span>
                    <span className="hover:text-violet-400 cursor-pointer transition-colors">API Reference</span>
                    <span className="hover:text-violet-400 cursor-pointer transition-colors">Status Page</span>
                    <span className="hover:text-violet-400 cursor-pointer transition-colors">Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-slate-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    All Systems Operational
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.15); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.3); }

        input[type=range]::-webkit-slider-runnable-track { height: 6px; }
      `}} />
    </div>
  );
}

// ─── Atomic Components ─────────────────────────────────────────────────

const NavIcon: React.FC<{icon: React.ReactNode; active: boolean; onClick: () => void}> = ({ icon, active, onClick }) => (
  <button onClick={onClick} className={`p-2.5 transition-all duration-300 relative group ${active ? 'text-violet-400' : 'text-slate-800 hover:text-slate-400'}`}>
    {icon}
    {active && (
      <>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-violet-500 shadow-[0_0_10px_#8b5cf6]"></div>
        <div className="absolute inset-0 bg-violet-500/[0.04]"></div>
      </>
    )}
  </button>
);

const SectionHeader: React.FC<{title: string; badge?: React.ReactNode}> = ({ title, badge }) => (
  <div className="flex justify-between items-end border-b border-white/[0.04] pb-4">
    <h2 className="text-xl font-light text-white uppercase tracking-widest leading-none">{title}</h2>
    {badge}
  </div>
);

const StatWidget: React.FC<{label: string; value: string; trend: string; icon: React.ReactNode; color: string}> = ({ label, value, trend, icon, color }) => {
  const colorMap: Record<string, string> = {
    violet: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };
  return (
    <div className="p-5 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative text-left">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">{label}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-xl font-light text-white tracking-tighter leading-none group-hover:text-violet-400 transition-colors">{value}</div>
        <div className={`text-[9px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : trend === 'stable' ? 'text-slate-700' : trend.startsWith('-') ? 'text-cyan-500' : 'text-slate-700'}`}>
          {trend !== 'stable' && (trend.startsWith('+') ? <TrendingUp size={10} className="inline mr-0.5" /> : <TrendingDown size={10} className="inline mr-0.5" />)}
          {trend}
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{icon: React.ReactNode; label: string; value: string; status: 'nominal'|'warning'|'critical'}> = ({ icon, label, value, status }) => {
  const statusStyles = {
    nominal: 'border-emerald-500/20 text-emerald-500',
    warning: 'border-amber-500/20 text-amber-500',
    critical: 'border-red-500/20 text-red-500',
  };
  return (
    <div className="p-4 border border-white/[0.04] bg-white/[0.01] flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
      <div className="text-slate-600 group-hover:text-violet-400 transition-colors">{icon}</div>
      <div className="flex-1 text-left">
        <div className="text-[9px] uppercase tracking-widest text-slate-600">{label}</div>
        <div className="text-sm font-light text-white">{value}</div>
      </div>
      <div className={`text-[8px] font-bold uppercase tracking-widest border px-2 py-1 ${statusStyles[status]}`}>
        {status}
      </div>
    </div>
  );
};

const MiniChart: React.FC<{label: string; value: string; change: string; positive: boolean; data: number[]}> = ({ label, value, change, positive, data }) => {
  const max = Math.max(...data);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 80}`).join(' ');
  const areaPoints = `0,100 ${points} 100,100`;
  return (
    <div className="p-4 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left group">
      <div className="text-[8px] uppercase tracking-widest text-slate-600 mb-1">{label}</div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-base font-light text-white">{value}</span>
        <span className={`text-[9px] font-bold ${positive ? 'text-emerald-500' : 'text-red-400'}`}>{change}</span>
      </div>
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points={areaPoints} fill={positive ? 'rgba(139,92,246,0.1)' : 'rgba(239,68,68,0.1)'} />
        <polyline points={points} fill="none" stroke={positive ? '#8b5cf6' : '#ef4444'} strokeWidth="2" />
      </svg>
    </div>
  );
};

const MetricBar: React.FC<{label: string; value: number; color: string}> = ({ label, value, color }) => {
  const colors: Record<string, string> = {
    violet: 'from-violet-700 to-violet-500',
    cyan: 'from-cyan-700 to-cyan-500',
    emerald: 'from-emerald-700 to-emerald-500',
    amber: 'from-amber-700 to-amber-500',
    pink: 'from-pink-700 to-pink-500',
  };
  const textColors: Record<string, string> = {
    violet: 'text-violet-500', cyan: 'text-cyan-500', emerald: 'text-emerald-500', amber: 'text-amber-500', pink: 'text-pink-500',
  };
  return (
    <div className="p-3 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors text-left">
      <div className="flex justify-between text-[9px] uppercase tracking-widest mb-2">
        <span className="text-slate-500">{label}</span>
        <span className={`font-mono font-bold ${textColors[color]}`}>{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/[0.04] relative overflow-hidden">
        <div className={`absolute h-full bg-gradient-to-r ${colors[color]} transition-all duration-1000`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

const TableRow: React.FC<{id: string; region: string; load: string; status: string; latency: string; uptime: string; warning?: boolean}> = ({ id, region, load, status, latency, uptime, warning }) => {
  const loadNum = parseInt(load);
  return (
    <tr className={`hover:bg-white/[0.02] transition-colors cursor-default border-b border-white/[0.02] last:border-0 ${warning ? 'bg-amber-500/[0.01]' : ''}`}>
      <td className="px-6 py-3.5 font-mono text-slate-300 text-[10px] tracking-widest text-left">{id}</td>
      <td className="px-6 py-3.5 text-slate-500 text-[10px] uppercase tracking-widest text-left flex items-center gap-2">
        <MapPin size={10} className="text-slate-700" /> {region}
      </td>
      <td className="px-6 py-3.5 text-left">
        <div className="flex items-center gap-3">
          <div className="w-20 h-1 bg-white/[0.04] relative overflow-hidden">
            <div className={`h-full ${loadNum > 90 ? 'bg-red-500' : loadNum > 75 ? 'bg-amber-500' : 'bg-violet-500'}`} style={{ width: load }}></div>
          </div>
          <span className="text-[9px] text-slate-600 font-mono">{load}</span>
        </div>
      </td>
      <td className="px-6 py-3.5 text-[9px] font-mono text-slate-500 text-left">{latency}</td>
      <td className="px-6 py-3.5 text-[9px] font-mono text-slate-500 text-left">{uptime}</td>
      <td className="px-6 py-3.5 text-left">
        <Badge variant={status === 'Nominal' ? 'success' : status === 'Warning' ? 'warning' : 'danger'}>
          {status}
        </Badge>
      </td>
      <td className="px-6 py-3.5 text-right">
        <MoreHorizontal size={14} className="text-slate-800 hover:text-slate-400 cursor-pointer inline transition-colors" />
      </td>
    </tr>
  );
};

const NodeCard: React.FC<{id: string; region: string; load: string; status: string; latency: string; uptime: string; warning?: boolean}> = ({ id, region, load, status, latency, uptime, warning }) => {
  const loadNum = parseInt(load);
  return (
    <div className={`p-5 border bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left group ${warning ? 'border-amber-500/20 hover:border-amber-500/30' : 'border-white/[0.04] hover:border-white/[0.08]'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'Nominal' ? 'bg-emerald-500' : status === 'Warning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
          <span className="text-[11px] font-mono text-white font-bold">{id}</span>
        </div>
        <Badge variant={status === 'Nominal' ? 'success' : status === 'Warning' ? 'warning' : 'danger'}>{status}</Badge>
      </div>
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-slate-600 mb-4">
        <MapPin size={10} /> {region}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] uppercase tracking-widest">
          <span className="text-slate-600">Load</span>
          <span className={`font-mono ${loadNum > 90 ? 'text-red-400' : 'text-slate-400'}`}>{load}</span>
        </div>
        <div className="w-full h-1 bg-white/[0.04] relative overflow-hidden">
          <div className={`h-full transition-all ${loadNum > 90 ? 'bg-red-500' : loadNum > 75 ? 'bg-amber-500' : 'bg-violet-500'}`} style={{ width: load }}></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/[0.03]">
        <div>
          <div className="text-[8px] uppercase tracking-widest text-slate-600">Latency</div>
          <div className="text-[11px] font-mono text-slate-400">{latency}</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-widest text-slate-600">Uptime</div>
          <div className="text-[11px] font-mono text-slate-400">{uptime}</div>
        </div>
      </div>
    </div>
  );
};

const SystemInfoCard: React.FC<{icon: React.ReactNode; label: string; value: string; sub: string}> = ({ icon, label, value, sub }) => (
  <div className="p-5 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left group">
    <div className="text-slate-700 group-hover:text-violet-400 transition-colors mb-3">{icon}</div>
    <div className="text-[8px] uppercase tracking-widest text-slate-600 mb-1">{label}</div>
    <div className="text-sm font-light text-white mb-0.5">{value}</div>
    <div className="text-[9px] text-slate-500 font-mono">{sub}</div>
  </div>
);

const NotificationItem: React.FC<{title: string; msg: string; time: string; urgent?: boolean}> = ({ title, msg, time, urgent }) => (
  <div className={`p-3 group hover:bg-white/[0.02] transition-colors cursor-pointer text-left ${urgent ? 'border-l-2 border-l-violet-500 bg-violet-500/[0.02]' : ''}`}>
    <div className="flex justify-between items-start mb-1">
      <span className={`text-[9px] font-bold uppercase tracking-widest ${urgent ? 'text-violet-400' : 'text-slate-300'}`}>{title}</span>
      <span className="text-[8px] text-slate-700 uppercase tracking-tighter flex items-center gap-1"><Clock size={8} />{time}</span>
    </div>
    <div className="text-[9px] text-slate-500 leading-relaxed">{msg}</div>
  </div>
);

const ProfileMenuItem: React.FC<{icon: React.ReactNode; label: string; danger?: boolean}> = ({ icon, label, danger }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-widest transition-colors hover:bg-violet-500/10 ${danger ? 'text-red-400 hover:text-red-300' : 'text-slate-500 hover:text-white'}`}>
    {icon}
    <span className="text-left">{label}</span>
  </button>
);

export default App;
