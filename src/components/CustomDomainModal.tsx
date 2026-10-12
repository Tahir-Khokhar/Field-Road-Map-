import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (fieldName: string, focusLevel: string, customGoals: string) => Promise<void>;
  isLoading: boolean;
}

const PRESET_EXAMPLES = [
  'Autonomous Drone Navigation & SLAM',
  'Graph Neural Networks for Drug Discovery',
  'Audio & Speech Processing (Whisper / TTS)',
  'Cybersecurity Threat & Anomaly Detection',
  'Physics-Informed Neural Networks (PINNs)',
  'Sports Analytics & 3D Pose Estimation',
  'Recommender Systems & Search Ranking',
  'Edge AI & Neuromorphic Computing',
];

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
}) => {
  const [fieldName, setFieldName] = useState('');
  const [focusLevel, setFocusLevel] = useState('Comprehensive');
  const [customGoals, setCustomGoals] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim() || isLoading) return;
    await onGenerate(fieldName.trim(), focusLevel, customGoals.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Architect Any Machine Learning Field
              </h3>
              <p className="text-xs text-slate-400">
                Generate core concepts, Python exercises, and tiered portfolio projects
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Machine Learning Field or Specialized Sub-domain:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Autonomous Drones, Audio AI, Fraud Detection, Graph ML..."
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Quick Preset Ideas */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Or pick an emerging niche:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_EXAMPLES.map((ex) => (
                <button
                  type="button"
                  key={ex}
                  onClick={() => setFieldName(ex)}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Target Focus Level */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Comprehensive', label: 'Full Career Track' },
              { id: 'Production-Engineering', label: 'Production MLOps' },
              { id: 'Research-Oriented', label: 'Theory & SOTA' },
            ].map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setFocusLevel(lvl.id)}
                className={`rounded-xl border p-2 text-center text-xs font-medium transition-all cursor-pointer ${
                  focusLevel === lvl.id
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Specific Career Goals (Optional) */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Target Career Goals / Dream Role (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Machine Learning Engineer at Autonomous Robotics Startup"
              value={customGoals}
              onChange={(e) => setCustomGoals(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!fieldName.trim() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Architecting Domain Path...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Mastery Path</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
