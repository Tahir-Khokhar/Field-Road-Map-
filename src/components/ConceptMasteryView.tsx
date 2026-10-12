import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Briefcase, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Play, 
  ChevronDown, 
  ChevronUp,
  Sigma,
  Layers,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { Concept, ConceptCategory, DifficultyLevel } from '../types/ml';
import { copyToClipboard } from '../utils/exportUtils';
import { simulatePythonExecution } from '../utils/pythonRunner';

interface ConceptMasteryViewProps {
  concepts: Concept[];
  domainName: string;
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
  onOpenCodeInLab: (code: string, title: string) => void;
}

export const ConceptMasteryView: React.FC<ConceptMasteryViewProps> = ({
  concepts,
  domainName,
  masteredIds,
  onToggleMastered,
  onOpenCodeInLab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ConceptCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCodeIds, setExpandedCodeIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [executionOutput, setExecutionOutput] = useState<Record<string, string>>({});

  const categories: { id: ConceptCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Concepts', icon: '⚡' },
    { id: 'math', label: 'Math & Formulations', icon: '📐' },
    { id: 'core_ml', label: 'Core ML Theory', icon: '⚙️' },
    { id: 'deep_learning', label: 'Deep Learning', icon: '🧠' },
    { id: 'specialized', label: 'Domain Tech', icon: '🔬' },
    { id: 'production', label: 'Production / MLOps', icon: '🚀' },
  ];

  const filteredConcepts = concepts.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.mathFormula && c.mathFormula.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const toggleCodeExpansion = (id: string) => {
    setExpandedCodeIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (id: string, code: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleQuickRun = (id: string, code: string) => {
    const res = simulatePythonExecution(code);
    setExecutionOutput((prev) => ({
      ...prev,
      [id]: `>>> Execution Success (${res.executionTimeMs}ms)\n${res.stdout}`,
    }));
  };

  const categoryColor = (cat: ConceptCategory) => {
    switch (cat) {
      case 'math':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'core_ml':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'deep_learning':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'specialized':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'production':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const difficultyColor = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'Beginner':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Intermediate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Advanced':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-400" />
            <span>Core Concepts to Master in {domainName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Carefully curated mathematical intuition, Python algorithms, interview traps, and real-world architectures.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search concepts or math..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills & Difficulty Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1 text-[11px] uppercase font-semibold">Level:</span>
          {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`rounded-md px-2 py-1 text-xs transition-colors cursor-pointer ${
                selectedDifficulty === lvl
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'all' ? 'All' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Cards Grid */}
      {filteredConcepts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <p className="text-sm text-slate-400">No concepts found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredConcepts.map((concept) => {
            const isMastered = masteredIds.includes(concept.id);
            const isCodeExpanded = expandedCodeIds[concept.id] !== false; // expanded by default

            return (
              <div
                key={concept.id}
                className={`rounded-2xl border transition-all ${
                  isMastered
                    ? 'border-emerald-500/40 bg-slate-900/60'
                    : 'border-slate-800/90 bg-slate-900/40 hover:border-slate-700'
                } p-5 sm:p-6 backdrop-blur-sm`}
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${categoryColor(concept.category)}`}>
                        {concept.category.replace('_', ' ')}
                      </span>
                      <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${difficultyColor(concept.difficulty)}`}>
                        {concept.difficulty}
                      </span>
                      {isMastered && (
                        <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          Mastered
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {concept.title}
                    </h3>
                  </div>

                  {/* Mastered Toggle Button */}
                  <button
                    onClick={() => onToggleMastered(concept.id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto ${
                      isMastered
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${isMastered ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>

                {/* Concept Summary */}
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {concept.summary}
                </p>

                {/* Mathematical Formulation Box */}
                {concept.mathFormula && (
                  <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5">
                      <Sigma className="h-3.5 w-3.5 text-amber-400" />
                      <span>Mathematical Formulation:</span>
                    </div>
                    <div className="overflow-x-auto py-1 font-mono text-xs sm:text-sm text-emerald-300 font-semibold tracking-wide">
                      {concept.mathFormula}
                    </div>
                  </div>
                )}

                {/* Key Insights Bullet Points */}
                <div className="mb-4 space-y-1.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Core Engineering Insights:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {concept.keyInsights.map((insight, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Python Implementation Block */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden mb-4">
                  <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 bg-slate-900/60">
                    <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-300">
                      <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Python Implementation</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(concept.id, concept.pythonCode)}
                        className="flex items-center gap-1 rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {copiedId === concept.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleQuickRun(concept.id, concept.pythonCode)}
                        className="flex items-center gap-1 rounded-md bg-emerald-600/80 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors cursor-pointer"
                        title="Execute in sandbox"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Run Test</span>
                      </button>

                      <button
                        onClick={() => onOpenCodeInLab(concept.pythonCode, concept.title)}
                        className="rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-amber-300 transition-colors cursor-pointer"
                        title="Open in Code Lab"
                      >
                        Code Lab ↗
                      </button>

                      <button
                        onClick={() => toggleCodeExpansion(concept.id)}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                        title="Toggle Code"
                      >
                        {isCodeExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isCodeExpanded && (
                    <div className="p-3 overflow-x-auto max-h-96">
                      <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                        <code>{concept.pythonCode}</code>
                      </pre>
                    </div>
                  )}

                  {/* Real-time execution output console */}
                  {executionOutput[concept.id] && (
                    <div className="border-t border-slate-800 bg-slate-900/90 p-3">
                      <div className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                        {executionOutput[concept.id]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Code Explanation Note */}
                {concept.codeExplanation && (
                  <p className="text-xs text-slate-400 mb-4 italic">
                    💡 <strong>Breakdown:</strong> {concept.codeExplanation}
                  </p>
                )}

                {/* Callout Boxes: Interview Trap & Industry Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Interview Trap */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>Interview Trap & Candidate Pitfall</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {concept.interviewTrap}
                    </p>
                  </div>

                  {/* Industry Context */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                      <Briefcase className="h-3.5 w-3.5 shrink-0" />
                      <span>Industry & Production Application</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {concept.industryUse}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
