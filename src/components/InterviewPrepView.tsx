import React, { useState } from 'react';
import { 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  Zap, 
  MessageSquare
} from 'lucide-react';
import { InterviewQuestion } from '../types/ml';

interface InterviewPrepViewProps {
  questions: InterviewQuestion[];
  domainName: string;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  questions,
  domainName,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesType = selectedType === 'all' || q.type === selectedType;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeColor = (type: string) => {
    switch (type) {
      case 'Theory':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Coding':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'System Design':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'MLOps':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-emerald-400" />
            <span>Technical Interview Blueprint: {domainName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            High-frequency questions asked by leading AI labs, hedge funds, and tech companies.
          </p>
        </div>

        {/* Flashcard Mode Toggle */}
        <button
          onClick={() => setFlashcardMode(!flashcardMode)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer border ${
            flashcardMode
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>{flashcardMode ? 'Flashcard Mode Active' : 'Enable Flashcard Mode'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Theory', 'Coding', 'System Design', 'MLOps'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = Boolean(expandedIds[q.id]);

          return (
            <div
              key={q.id || idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3 hover:border-slate-700 transition-colors backdrop-blur-sm"
            >
              <div
                className="flex items-start justify-between gap-3 cursor-pointer select-none"
                onClick={() => toggleExpand(q.id)}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeColor(q.type)}`}>
                      {q.type}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Level: {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {q.question}
                  </h3>
                </div>

                <button className="text-slate-400 hover:text-white p-1">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {/* Collapsed answer in Flashcard Mode, or expanded view */}
              {(!flashcardMode || isExpanded) && (
                <div className="border-t border-slate-800/80 pt-3 space-y-3">
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400 block mb-1">Target Answer & Model Solution:</strong>
                    {q.answer}
                  </div>

                  {q.followUp && (
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-slate-300">
                      <strong className="text-indigo-400 block mb-0.5">Interviewer Follow-Up Probe:</strong>
                      {q.followUp}
                    </div>
                  )}
                </div>
              )}

              {flashcardMode && !isExpanded && (
                <div className="text-xs text-slate-500 italic">
                  [Click question to reveal model answer and follow-up probe]
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
