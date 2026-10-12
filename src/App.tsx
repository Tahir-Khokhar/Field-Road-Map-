import React, { useState, useEffect } from 'react';
import { CURATED_DOMAINS } from './data/curatedDomains';
import { MLDomainData } from './types/ml';
import { Navbar } from './components/Navbar';
import { DomainHero } from './components/DomainHero';
import { ConceptMasteryView } from './components/ConceptMasteryView';
import { ProblemGymView } from './components/ProblemGymView';
import { TieredProjectsView } from './components/TieredProjectsView';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { InterviewPrepView } from './components/InterviewPrepView';
import { PythonCodeLabModal } from './components/PythonCodeLabModal';
import { CustomDomainModal } from './components/CustomDomainModal';
import { AiMentorDrawer } from './components/AiMentorDrawer';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentDomain, setCurrentDomain] = useState<MLDomainData>(
    CURATED_DOMAINS['computer-vision']
  );
  const [activeTab, setActiveTab] = useState<string>('concepts');
  const [isLoadingDomain, setIsLoadingDomain] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mastered concepts tracking with localStorage
  const [masteredConceptIds, setMasteredConceptIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mlpath_mastered_concepts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mlpath_mastered_concepts', JSON.stringify(masteredConceptIds));
    } catch (e) {
      console.error('Failed to save mastered concepts:', e);
    }
  }, [masteredConceptIds]);

  const toggleMastered = (id: string) => {
    setMasteredConceptIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals & Drawers state
  const [isCodeLabOpen, setIsCodeLabOpen] = useState(false);
  const [codeLabInitialCode, setCodeLabInitialCode] = useState<string | undefined>(undefined);
  const [codeLabInitialTitle, setCodeLabInitialTitle] = useState<string | undefined>(undefined);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  // Curated domains summary list
  const curatedList = Object.values(CURATED_DOMAINS).map((d) => ({
    id: d.domainId,
    name: d.domainName,
    badge: d.badge,
  }));

  // Fetch or switch domain
  const handleSelectDomain = async (domainIdOrName: string) => {
    const trimmed = domainIdOrName.trim();
    // Check if directly in curated
    if (CURATED_DOMAINS[trimmed]) {
      setCurrentDomain(CURATED_DOMAINS[trimmed]);
      return;
    }

    // Call server endpoint
    setIsLoadingDomain(true);
    setLoadingMessage(`Architecting curriculum for "${trimmed}"...`);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/domain-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: trimmed }),
      });
      const data = await res.json();
      if (data.data) {
        setCurrentDomain(data.data);
      } else {
        setErrorMessage('Unable to load path. Please check domain name and try again.');
      }
    } catch (err) {
      console.error('Error fetching domain path:', err);
      // Fallback
      if (CURATED_DOMAINS['computer-vision']) {
        setCurrentDomain(CURATED_DOMAINS['computer-vision']);
      }
    } finally {
      setIsLoadingDomain(false);
    }
  };

  // Generate Custom Domain from Modal
  const handleGenerateCustomDomain = async (
    fieldName: string,
    focusLevel: string,
    customGoals: string
  ) => {
    setIsLoadingDomain(true);
    setLoadingMessage(`Synthesizing custom ML curriculum for "${fieldName}"...`);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/domain-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: fieldName,
          focusLevel,
          customGoals,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setCurrentDomain(data.data);
        setIsCustomModalOpen(false);
        setActiveTab('concepts');
      } else {
        setErrorMessage('Failed to generate custom domain curriculum.');
      }
    } catch (err) {
      console.error('Error creating custom domain:', err);
      setErrorMessage('Network error while synthesizing domain curriculum.');
    } finally {
      setIsLoadingDomain(false);
    }
  };

  const handleOpenCodeInLab = (code: string, title: string) => {
    setCodeLabInitialCode(code);
    setCodeLabInitialTitle(title);
    setIsCodeLabOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        currentDomain={currentDomain}
        curatedDomains={curatedList}
        onSelectDomain={handleSelectDomain}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenCodeLab={() => {
          setCodeLabInitialCode(undefined);
          setCodeLabInitialTitle(undefined);
          setIsCodeLabOpen(true);
        }}
        onOpenMentor={() => setIsMentorOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={
          currentDomain.concepts.filter((c) => masteredConceptIds.includes(c.id)).length
        }
        totalConcepts={currentDomain.concepts.length}
      />

      {/* Loading Overlay */}
      {isLoadingDomain && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            <div className="text-center">
              <h3 className="text-base font-bold text-white">{loadingMessage}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Formulating mathematical principles, Python implementations, and tiered portfolio projects...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Domain Hero Banner */}
      <DomainHero
        domain={currentDomain}
        curatedDomains={curatedList}
        onSelectDomain={handleSelectDomain}
        onOpenCodeLab={() => {
          setCodeLabInitialCode(undefined);
          setCodeLabInitialTitle(undefined);
          setIsCodeLabOpen(true);
        }}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'concepts' && (
          <ConceptMasteryView
            concepts={currentDomain.concepts}
            domainName={currentDomain.domainName}
            masteredIds={masteredConceptIds}
            onToggleMastered={toggleMastered}
            onOpenCodeInLab={handleOpenCodeInLab}
          />
        )}

        {activeTab === 'gym' && (
          <ProblemGymView
            challenges={currentDomain.challenges}
            domainName={currentDomain.domainName}
            onOpenCodeInLab={handleOpenCodeInLab}
          />
        )}

        {activeTab === 'projects' && (
          <TieredProjectsView
            projects={currentDomain.projects}
            domainName={currentDomain.domainName}
            onOpenCodeInLab={handleOpenCodeInLab}
          />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmapView
            roadmap={currentDomain.roadmap}
            domainName={currentDomain.domainName}
            domainId={currentDomain.domainId}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPrepView
            questions={currentDomain.interviewPrep}
            domainName={currentDomain.domainName}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <PythonCodeLabModal
        isOpen={isCodeLabOpen}
        onClose={() => setIsCodeLabOpen(false)}
        initialCode={codeLabInitialCode}
        initialTitle={codeLabInitialTitle}
      />

      <CustomDomainModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onGenerate={handleGenerateCustomDomain}
        isLoading={isLoadingDomain}
      />

      <AiMentorDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        domainName={currentDomain.domainName}
        currentCodeSnippet={codeLabInitialCode}
      />

      {/* Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-300">MLPath Forge</strong> — Machine Learning Domain Mastery & Portfolio Architect.
          </div>
          <div className="flex items-center gap-4">
            <span>Production Python Stack</span>
            <span>•</span>
            <span>PyTorch 2.2</span>
            <span>•</span>
            <span>Scikit-Learn</span>
            <span>•</span>
            <span>FastAPI & Docker</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
