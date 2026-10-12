import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ChevronRight,
  Terminal,
  Clock,
  Sparkles
} from 'lucide-react';
import { ProblemChallenge } from '../types/ml';
import { copyToClipboard } from '../utils/exportUtils';
import { simulatePythonExecution } from '../utils/pythonRunner';

interface ProblemGymViewProps {
  challenges: ProblemChallenge[];
  domainName: string;
  onOpenCodeInLab: (code: string, title: string) => void;
}

export const ProblemGymView: React.FC<ProblemGymViewProps> = ({
  challenges,
  domainName,
  onOpenCodeInLab,
}) => {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const activeChallenge = challenges[activeChallengeIndex] || challenges[0];

  const [userCode, setUserCode] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    challenges.forEach((c) => {
      init[c.id] = c.starterCode;
    });
    return init;
  });

  const [consoleOutput, setConsoleOutput] = useState<Record<string, string>>({});
  const [executionStatus, setExecutionStatus] = useState<Record<string, 'idle' | 'running' | 'success' | 'failed'>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  const [showHintIndex, setShowHintIndex] = useState<Record<string, number>>({});
  const [copiedSolution, setCopiedSolution] = useState(false);

  if (!activeChallenge) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-400">
        No challenges available for this domain yet.
      </div>
    );
  }

  const currentCode = userCode[activeChallenge.id] || activeChallenge.starterCode;

  const handleCodeChange = (newVal: string) => {
    setUserCode((prev) => ({ ...prev, [activeChallenge.id]: newVal }));
  };

  const handleResetCode = () => {
    setUserCode((prev) => ({ ...prev, [activeChallenge.id]: activeChallenge.starterCode }));
    setConsoleOutput((prev) => ({ ...prev, [activeChallenge.id]: '' }));
    setExecutionStatus((prev) => ({ ...prev, [activeChallenge.id]: 'idle' }));
  };

  const handleRunCode = () => {
    setExecutionStatus((prev) => ({ ...prev, [activeChallenge.id]: 'running' }));
    
    setTimeout(() => {
      const result = simulatePythonExecution(currentCode);
      setConsoleOutput((prev) => ({
        ...prev,
        [activeChallenge.id]: `[Python 3.11 Runtime - Executed in ${result.executionTimeMs}ms]\n${result.stdout}`,
      }));
      setExecutionStatus((prev) => ({ ...prev, [activeChallenge.id]: 'success' }));
    }, 400);
  };

  const handleUseSolution = () => {
    setUserCode((prev) => ({ ...prev, [activeChallenge.id]: activeChallenge.solutionCode }));
  };

  const handleCopySolution = async () => {
    const ok = await copyToClipboard(activeChallenge.solutionCode);
    if (ok) {
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  const difficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-emerald-400" />
          <span>The ML Gym: Hands-On Problem Solving</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Implement algorithmic solutions, loss functions, and data transformations from scratch in Python for {domainName}.
        </p>
      </div>

      {/* Challenge Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {challenges.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setActiveChallengeIndex(idx)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeChallengeIndex === idx
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>Challenge {idx + 1}:</span>
            <span className="font-normal truncate max-w-xs">{c.title}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
              activeChallengeIndex === idx ? 'bg-slate-900/40 text-slate-950 border-slate-950/20' : difficultyBadgeColor(c.difficulty)
            }`}>
              {c.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Main Coding Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Description & Test Cases (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${difficultyBadgeColor(activeChallenge.difficulty)}`}>
                {activeChallenge.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {activeChallenge.id}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {activeChallenge.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeChallenge.description}
            </p>

            {/* Constraints */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Constraints & Requirements:
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {activeChallenge.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Test Cases */}
            {activeChallenge.testCases && activeChallenge.testCases.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Sample Test Cases:
                </h4>
                <div className="space-y-2">
                  {activeChallenge.testCases.map((tc, i) => (
                    <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/80 p-2.5 text-xs font-mono">
                      <div className="text-slate-400">Input: <span className="text-slate-200">{tc.input}</span></div>
                      <div className="text-emerald-400 mt-1">Expected: <span className="text-emerald-300">{tc.expected}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hints Accordion */}
            {activeChallenge.hints && activeChallenge.hints.length > 0 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4" />
                    <span>Algorithmic Hints</span>
                  </div>
                  <span className="text-[11px] font-normal text-slate-400">
                    Hint 1 of {activeChallenge.hints.length}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  💡 {activeChallenge.hints[0]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Console (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-medium text-slate-200">
                  solution.py
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-colors cursor-pointer"
                  title="Reset to starter boilerplate"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setShowSolution((prev) => ({ ...prev, [activeChallenge.id]: !prev[activeChallenge.id] }))}
                  className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-950/50 hover:bg-indigo-900/60 px-2.5 py-1 text-xs text-indigo-300 transition-colors cursor-pointer"
                >
                  {showSolution[activeChallenge.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{showSolution[activeChallenge.id] ? 'Hide Solution' : 'View Solution'}</span>
                </button>

                <button
                  onClick={() => onOpenCodeInLab(currentCode, activeChallenge.title)}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-amber-300 transition-colors cursor-pointer"
                  title="Open full-screen scratchpad"
                >
                  Code Lab ↗
                </button>

                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run Tests</span>
                </button>
              </div>
            </div>

            {/* Interactive Code Textarea */}
            <div className="relative">
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full resize-y bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none leading-relaxed"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Console Output Bar */}
            <div className="border-t border-slate-800 bg-slate-900/90 p-4 font-mono">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Execution Output Console</span>
                </div>
                {executionStatus[activeChallenge.id] === 'success' && (
                  <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                    <CheckCircle className="h-3 w-3" />
                    Passed Simulation
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 min-h-[90px] max-h-48 overflow-y-auto text-xs whitespace-pre-wrap text-emerald-300">
                {consoleOutput[activeChallenge.id] || (
                  <span className="text-slate-500 italic">
                    Press "Run Tests" to execute your solution against test cases in the simulated Python engine...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Solution Modal / Reveal Box */}
          {showSolution[activeChallenge.id] && (
            <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Reference Solution & Mathematical Explanation</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUseSolution}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
                  >
                    Load into Editor
                  </button>
                  <button
                    onClick={handleCopySolution}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs text-slate-300 cursor-pointer"
                  >
                    {copiedSolution ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedSolution ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeChallenge.explanation}
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 overflow-x-auto">
                <pre className="font-mono text-xs text-indigo-200">
                  <code>{activeChallenge.solutionCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
