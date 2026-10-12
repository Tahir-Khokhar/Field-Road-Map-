import React, { useState } from 'react';
import { 
  FolderGit2, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  FileCode, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Database, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Award
} from 'lucide-react';
import { PortfolioProject } from '../types/ml';
import { copyToClipboard, downloadFile } from '../utils/exportUtils';

interface TieredProjectsViewProps {
  projects: PortfolioProject[];
  domainName: string;
  onOpenCodeInLab: (code: string, title: string) => void;
}

export const TieredProjectsView: React.FC<TieredProjectsViewProps> = ({
  projects,
  domainName,
  onOpenCodeInLab,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Basic');
  const [activeTab, setActiveTab] = useState<'code' | 'readme' | 'resume'>('code');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [customReadme, setCustomReadme] = useState<string | null>(null);
  const [isGeneratingReadme, setIsGeneratingReadme] = useState(false);

  const currentProject = projects.find((p) => p.level === selectedLevel) || projects[0];

  if (!currentProject) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-400">
        No projects configured for this domain yet.
      </div>
    );
  }

  const handleCopyCode = async () => {
    const ok = await copyToClipboard(currentProject.pythonCode);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownloadCode = () => {
    downloadFile(
      `${currentProject.id}.py`,
      currentProject.pythonCode,
      'text/x-python'
    );
  };

  const handleCopyReadme = async () => {
    const content = customReadme || currentProject.readmeContent;
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    }
  };

  const handleDownloadReadme = () => {
    const content = customReadme || currentProject.readmeContent;
    downloadFile('README.md', content, 'text/markdown');
  };

  const handleGenerateCustomReadme = async () => {
    setIsGeneratingReadme(true);
    try {
      const res = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: currentProject,
          domainName,
          authorName: 'Machine Learning Portfolio Engineer',
        }),
      });
      const data = await res.json();
      if (data.readme) {
        setCustomReadme(data.readme);
        setActiveTab('readme');
      }
    } catch (err) {
      console.error('Failed to generate customized README:', err);
    } finally {
      setIsGeneratingReadme(false);
    }
  };

  const levelColor = (lvl: 'Basic' | 'Intermediate' | 'Advanced') => {
    switch (lvl) {
      case 'Basic':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Intermediate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Advanced':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-emerald-400" />
            <span>Tiered Portfolio Projects for Your Profile</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build stand-out resume flagships: clean architecture, production Python scripts, and instant GitHub READMEs.
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {(['Basic', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setCustomReadme(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl} Level
            </button>
          ))}
        </div>
      </div>

      {/* Main Project Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 backdrop-blur-sm">
        {/* Project Header Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${levelColor(currentProject.level)}`}>
              {currentProject.level} Portfolio Project
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Domain: {domainName}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {currentProject.title}
          </h3>

          <p className="text-sm sm:text-base text-emerald-300 font-medium">
            "{currentProject.tagline}"
          </p>
        </div>

        {/* Problem Statement & Industry ROI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Business Problem Statement:
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentProject.problemStatement}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
              Industry Value & Portfolio Impact:
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentProject.industryValue}
            </p>
          </div>
        </div>

        {/* Tech Stack & Target Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Technology Stack:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-mono text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Production Benchmark Metrics:
            </h4>
            <div className="space-y-1">
              {currentProject.metricsToTrack.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dataset Recommendation Card */}
        {currentProject.datasetRecommendation && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Database className="h-4 w-4 text-cyan-400" />
                <span>Recommended Dataset:</span>
                <span className="text-slate-200 font-bold">{currentProject.datasetRecommendation.name}</span>
              </div>
              <p className="text-xs text-slate-400">
                {currentProject.datasetRecommendation.description} ({currentProject.datasetRecommendation.format})
              </p>
            </div>
            <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-mono text-cyan-400">
              Source: {currentProject.datasetRecommendation.source}
            </span>
          </div>
        )}

        {/* System Architecture Flow Pipeline */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>End-to-End System Architecture Pipeline:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentProject.architectureSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[100px]">
                    {step.pythonModule}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{step.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Workspace: Code, GitHub README & Resume Bullets */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="h-4 w-4" />
                <span>Production Python Script</span>
              </button>

              <button
                onClick={() => setActiveTab('readme')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'readme'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>GitHub README.md Generator</span>
              </button>

              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'resume'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Resume Talking Points</span>
              </button>
            </div>

            {/* Action Buttons for current tab */}
            {activeTab === 'code' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownloadCode}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>Download .py</span>
                </button>

                <button
                  onClick={() => onOpenCodeInLab(currentProject.pythonCode, currentProject.title)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Open in Lab ↗
                </button>
              </div>
            )}

            {activeTab === 'readme' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateCustomReadme}
                  disabled={isGeneratingReadme}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isGeneratingReadme ? 'Generating...' : 'Enhance with AI'}</span>
                </button>

                <button
                  onClick={handleCopyReadme}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedReadme ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedReadme ? 'Copied' : 'Copy Markdown'}</span>
                </button>

                <button
                  onClick={handleDownloadReadme}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>Download README.md</span>
                </button>
              </div>
            )}
          </div>

          {/* Tab Content Display */}
          {activeTab === 'code' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto max-h-[500px]">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                <code>{currentProject.pythonCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 overflow-x-auto max-h-[500px]">
              <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {customReadme || currentProject.readmeContent}
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Resume-Ready Project Bullets (Copy directly to your CV)</span>
              </h4>

              <div className="space-y-3">
                {currentProject.interviewTalkingPoints.map((point, i) => (
                  <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                    <span className="font-bold text-emerald-400 shrink-0">•</span>
                    <div>
                      <strong>Architectural highlight:</strong> {point}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-slate-300">
                💡 <strong>Tip for hiring managers:</strong> Highlight the baseline comparison and the measured production trade-off (e.g. "achieved 3.2x latency reduction with zero accuracy penalty using INT8 dynamic quantization").
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
