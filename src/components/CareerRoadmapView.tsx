import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Download, 
  Sparkles, 
  TrendingUp,
  Award
} from 'lucide-react';
import { DomainRoadmapWeek } from '../types/ml';
import { downloadFile } from '../utils/exportUtils';

interface CareerRoadmapViewProps {
  roadmap: DomainRoadmapWeek[];
  domainName: string;
  domainId: string;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({
  roadmap,
  domainName,
  domainId,
}) => {
  const storageKey = `mlpath_roadmap_${domainId}`;

  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedMilestones));
    } catch (e) {
      console.error('Failed to save roadmap progress:', e);
    }
  }, [completedMilestones, storageKey]);

  const toggleMilestone = (milestoneKey: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [milestoneKey]: !prev[milestoneKey],
    }));
  };

  // Calculate total milestones
  let totalMilestonesCount = 0;
  let completedCount = 0;

  roadmap.forEach((week) => {
    week.milestones.forEach((_, idx) => {
      totalMilestonesCount++;
      if (completedMilestones[`${week.week}_${idx}`]) {
        completedCount++;
      }
    });
  });

  const progressPercent = totalMilestonesCount > 0 ? Math.round((completedCount / totalMilestonesCount) * 100) : 0;

  const handleDownloadRoadmap = () => {
    let md = `# 12-Week Career Mastery Roadmap: ${domainName}\n\n`;
    md += `Completion Status: ${completedCount}/${totalMilestonesCount} Milestones (${progressPercent}%)\n\n`;

    roadmap.forEach((w) => {
      md += `## Week ${w.week}: ${w.focus} (${w.phase})\n`;
      md += `**Deliverable:** ${w.deliverables}\n\n`;
      w.milestones.forEach((m, idx) => {
        const isDone = completedMilestones[`${w.week}_${idx}`];
        md += `- [${isDone ? 'x' : ' '}] ${m}\n`;
      });
      md += `\n`;
    });

    downloadFile(`${domainId}-12-week-roadmap.md`, md, 'text/markdown');
  };

  const getPhaseBadgeColor = (phase: string) => {
    if (phase.includes('Foundations')) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (phase.includes('Core')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (phase.includes('Advanced')) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Overall Progress */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-400" />
              <span>12-Week Structured Career Roadmap: {domainName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              From mathematical principles to portfolio project execution and hiring readiness.
            </p>
          </div>

          <button
            onClick={handleDownloadRoadmap}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Download Schedule (.md)</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Roadmap Progress: {completedCount} of {totalMilestonesCount} Completed
            </span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 12-Week Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roadmap.map((week) => (
          <div
            key={week.week}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  Week {week.week}
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getPhaseBadgeColor(week.phase)}`}>
                  {week.phase}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">
                {week.focus}
              </h4>

              {/* Milestones list with interactive checkboxes */}
              <div className="space-y-2 pt-1">
                {week.milestones.map((m, idx) => {
                  const mKey = `${week.week}_${idx}`;
                  const isChecked = Boolean(completedMilestones[mKey]);

                  return (
                    <button
                      key={idx}
                      onClick={() => toggleMilestone(mKey)}
                      className={`w-full flex items-start gap-2 text-left text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-500/10 text-slate-300'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                      )}
                      <span className={`leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>
                        {m}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly Deliverable */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400 block mb-0.5">Deliverable:</span>
              <span>{week.deliverables}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
