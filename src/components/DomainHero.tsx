import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Terminal, 
  Download, 
  Sparkles, 
  Share2, 
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { MLDomainData } from '../types/ml';
import { downloadFile } from '../utils/exportUtils';

interface DomainHeroProps {
  domain: MLDomainData;
  curatedDomains: { id: string; name: string; badge: string }[];
  onSelectDomain: (id: string) => void;
  onOpenCodeLab: () => void;
  onOpenCustomModal: () => void;
}

export const DomainHero: React.FC<DomainHeroProps> = ({
  domain,
  curatedDomains,
  onSelectDomain,
  onOpenCodeLab,
  onOpenCustomModal,
}) => {
  const handleExportMarkdown = () => {
    let md = `# Machine Learning Mastery Blueprint: ${domain.domainName}\n\n`;
    md += `> ${domain.tagline}\n\n`;
    md += `**Market Demand:** ${domain.marketDemand} | **Salary Range:** ${domain.averageSalaryRange}\n\n`;
    md += `## 🛠️ Recommended Libraries & Tools\n`;
    domain.recommendedLibraries.forEach((lib) => {
      md += `- **${lib.name}**: ${lib.purpose}\n`;
    });
    md += `\n## 🧠 Core Concepts to Master\n`;
    domain.concepts.forEach((c) => {
      md += `### ${c.title} (${c.difficulty})\n`;
      md += `- **Summary:** ${c.summary}\n`;
      if (c.mathFormula) md += `- **Math:** \`${c.mathFormula}\`\n`;
      md += `- **Interview Trap:** ${c.interviewTrap}\n`;
      md += `\`\`\`python\n${c.pythonCode}\n\`\`\`\n\n`;
    });
    md += `\n## 🚀 Tiered Portfolio Projects\n`;
    domain.projects.forEach((p) => {
      md += `### [${p.level}] ${p.title}\n`;
      md += `- **Tagline:** ${p.tagline}\n`;
      md += `- **Problem:** ${p.problemStatement}\n`;
      md += `- **Tech Stack:** ${p.techStack.join(', ')}\n\n`;
    });

    downloadFile(`${domain.domainId}-curriculum.md`, md, 'text/markdown');
  };

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Background visual accents */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Curated Field Quick Switcher */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Top Tracks:
          </span>
          {curatedDomains.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectDomain(item.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                domain.domainId === item.id
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={onOpenCustomModal}
            className="rounded-lg bg-indigo-950/60 border border-indigo-500/40 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-900/80 cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>Generate Any Custom Field</span>
          </button>
        </div>

        {/* Hero Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                {domain.badge}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300">
                <TrendingUp className="h-3 w-3" />
                Demand: {domain.marketDemand}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                <DollarSign className="h-3 w-3" />
                {domain.averageSalaryRange}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              {domain.domainName}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {domain.tagline}
            </p>

            {/* Recommended Libraries Chips */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Core Python Stack & Frameworks:
              </span>
              <div className="flex flex-wrap gap-2">
                {domain.recommendedLibraries.map((lib) => (
                  <div
                    key={lib.name}
                    className="group relative flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200"
                  >
                    <Cpu className="h-3 w-3 text-emerald-400" />
                    <span className="font-mono font-medium">{lib.name}</span>
                    <span className="hidden sm:inline text-[11px] text-slate-400">
                      — {lib.purpose}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export Full Curriculum (.md)</span>
              </button>

              <button
                onClick={onOpenCodeLab}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all cursor-pointer"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Interactive Python Scratchpad</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Highlights Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Curriculum Architecture</span>
              <span className="text-emerald-400 font-mono text-[11px]">Production Standard</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                <div className="text-2xl font-black text-white font-mono">
                  {domain.concepts.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Core Concepts</div>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {domain.challenges.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Python Challenges</div>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {domain.projects.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Tiered Projects</div>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                <div className="text-2xl font-black text-indigo-400 font-mono">
                  12
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Weeks Roadmap</div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Basic, Intermediate & Advanced Portfolios</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Ready-to-use GitHub README Generator</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Interview traps & production edge cases</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
