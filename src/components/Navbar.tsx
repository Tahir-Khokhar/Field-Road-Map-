import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Terminal, 
  Bot, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  Code2, 
  FolderGit2, 
  BrainCircuit,
  Plus
} from 'lucide-react';
import { MLDomainData } from '../types/ml';

interface NavbarProps {
  currentDomain: MLDomainData;
  curatedDomains: { id: string; name: string; badge: string }[];
  onSelectDomain: (domainIdOrName: string) => void;
  onOpenCustomModal: () => void;
  onOpenCodeLab: () => void;
  onOpenMentor: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  masteredCount: number;
  totalConcepts: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDomain,
  curatedDomains,
  onSelectDomain,
  onOpenCustomModal,
  onOpenCodeLab,
  onOpenMentor,
  activeTab,
  setActiveTab,
  masteredCount,
  totalConcepts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredPresets = curatedDomains.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectDomain(searchQuery.trim());
      setIsSearchOpen(false);
    }
  };

  const navTabs = [
    { id: 'concepts', label: 'Core Concepts', icon: BookOpen },
    { id: 'gym', label: 'ML Problem Gym', icon: Code2 },
    { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2 },
    { id: 'roadmap', label: '12-Week Roadmap', icon: Compass },
    { id: 'interview', label: 'Interview Blueprint', icon: BrainCircuit },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-lg shadow-emerald-500/20">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg font-sans">
                MLPath <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Forge</span>
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                Career Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Master Any Machine Learning Domain & Build Flagship Portfolios
            </p>
          </div>
        </div>

        {/* Global Field Search & Custom Input */}
        <div className="relative flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search or enter any ML field (e.g. CV, NLP, Robotics, BioML)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-10 pr-24 text-xs sm:text-sm text-slate-200 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors cursor-pointer"
              >
                Go
              </button>
            </div>
          </form>

          {/* Quick Dropdown on Focus/Search */}
          {isSearchOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSearchOpen(false)} 
              />
              <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Popular ML Disciplines</span>
                  <span className="text-[10px] text-emerald-400">Press Enter for Custom</span>
                </div>
                <div className="mt-1 space-y-1 max-h-60 overflow-y-auto">
                  {filteredPresets.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDomain(d.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentDomain.domainId === d.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="font-medium">{d.name}</div>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                        {d.badge}
                      </span>
                    </button>
                  ))}

                  {searchQuery.trim() && (
                    <button
                      onClick={() => {
                        onSelectDomain(searchQuery.trim());
                        setIsSearchOpen(false);
                      }}
                      className="w-full mt-1 flex items-center gap-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 px-3 py-2 text-left text-xs text-indigo-300 hover:bg-indigo-900/60 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>
                        Generate new path for: <strong className="text-white">"{searchQuery}"</strong>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Custom Field Modal Button */}
          <button
            onClick={onOpenCustomModal}
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Generate custom curriculum for any specialized ML field"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>Custom Field</span>
          </button>

          {/* Interactive Code Lab */}
          <button
            onClick={onOpenCodeLab}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Open Interactive Python Scratchpad"
          >
            <Terminal className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Python Lab</span>
          </button>

          {/* AI Mentor */}
          <button
            onClick={onOpenMentor}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-950 transition-all cursor-pointer"
            title="Ask ML Engineering AI Mentor"
          >
            <Bot className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          {/* Concept Mastery Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              <strong className="text-slate-200">{masteredCount}</strong>/{totalConcepts} Mastered
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-t border-slate-800/60 bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
