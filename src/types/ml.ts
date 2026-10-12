export type ConceptCategory = 'math' | 'core_ml' | 'deep_learning' | 'specialized' | 'production';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Concept {
  id: string;
  title: string;
  category: ConceptCategory;
  difficulty: DifficultyLevel;
  summary: string;
  mathFormula?: string;
  keyInsights: string[];
  pythonCode: string;
  codeExplanation: string;
  interviewTrap: string;
  industryUse: string;
}

export interface ProblemChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  starterCode: string;
  solutionCode: string;
  explanation: string;
  expectedOutput: string;
  hints: string[];
  testCases: { input: string; expected: string }[];
}

export interface ArchitectureStep {
  step: number;
  title: string;
  description: string;
  pythonModule: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  tagline: string;
  problemStatement: string;
  industryValue: string;
  techStack: string[];
  architectureSteps: ArchitectureStep[];
  datasetRecommendation: {
    name: string;
    source: string;
    format: string;
    description: string;
  };
  metricsToTrack: string[];
  pythonCode: string;
  readmeContent: string;
  interviewTalkingPoints: string[];
  githubBadges?: string[];
}

export interface DomainRoadmapWeek {
  week: number;
  phase: string;
  focus: string;
  milestones: string[];
  deliverables: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'Theory' | 'Coding' | 'System Design' | 'MLOps';
  answer: string;
  followUp: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export interface MLDomainData {
  domainId: string;
  domainName: string;
  badge: string;
  tagline: string;
  marketDemand: 'Ultra High' | 'High' | 'Rapidly Growing' | 'Specialized';
  averageSalaryRange: string;
  keySkills: string[];
  recommendedLibraries: { name: string; purpose: string }[];
  concepts: Concept[];
  challenges: ProblemChallenge[];
  projects: PortfolioProject[];
  roadmap: DomainRoadmapWeek[];
  interviewPrep: InterviewQuestion[];
}

export interface PresetDomainSummary {
  id: string;
  name: string;
  iconName: string;
  tagline: string;
  demand: string;
}
