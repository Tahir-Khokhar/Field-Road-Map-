import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CURATED_DOMAINS } from './src/data/curatedDomains.js';
import { MLDomainData } from './src/types/ml.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization with required telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for fuzzy matching curated domains
function findCuratedMatch(query: string): MLDomainData | null {
  const q = query.toLowerCase().trim();
  if (CURATED_DOMAINS[q]) return CURATED_DOMAINS[q];
  for (const [key, domain] of Object.entries(CURATED_DOMAINS)) {
    if (
      domain.domainName.toLowerCase().includes(q) ||
      q.includes(key) ||
      domain.badge.toLowerCase().includes(q) ||
      (q.includes('vision') && key === 'computer-vision') ||
      ((q.includes('nlp') || q.includes('llm') || q.includes('language')) && key === 'nlp-llms') ||
      ((q.includes('quant') || q.includes('finance') || q.includes('trading')) && key === 'quant-finance') ||
      ((q.includes('health') || q.includes('med') || q.includes('bio')) && key === 'healthcare-ai') ||
      ((q.includes('mlops') || q.includes('production') || q.includes('deploy')) && key === 'mlops-production')
    ) {
      return domain;
    }
  }
  return null;
}

// Fallback generator for custom domain in case Gemini API is offline or key missing
function buildFallbackDomain(fieldName: string): MLDomainData {
  const slug = fieldName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    domainId: slug || 'custom-ml-field',
    domainName: fieldName,
    badge: `${fieldName.slice(0, 15)} AI`,
    tagline: `Comprehensive end-to-end Machine Learning mastery path for ${fieldName}: core mathematical foundations, Python implementations, problem challenges, and portfolio projects.`,
    marketDemand: 'High',
    averageSalaryRange: '$150,000 - $225,000 / yr',
    keySkills: ['Python 3.11', 'PyTorch', 'Scikit-Learn', `${fieldName} Algorithms`, 'FastAPI', 'Docker', 'Evaluation Metrics'],
    recommendedLibraries: [
      { name: 'torch', purpose: 'Core deep learning tensors and automatic differentiation' },
      { name: 'scikit-learn', purpose: 'Baseline machine learning pipelines and metric computation' },
      { name: 'polars', purpose: 'High performance data ingestion and feature engineering' },
      { name: 'fastapi', purpose: 'Production inference API microservices' }
    ],
    concepts: [
      {
        id: `${slug}-math-foundations`,
        title: `Mathematical Foundations for ${fieldName}`,
        category: 'math',
        difficulty: 'Beginner',
        summary: `Vector calculus, loss function formulations, and probability distributions governing ${fieldName}.`,
        mathFormula: '\\mathcal{L}_{\\text{total}}(\\theta) = \\mathbb{E}_{(x, y) \\sim \\mathcal{D}}[\\ell(f_\\theta(x), y)] + \\lambda \\Omega(\\theta)',
        keyInsights: [
          `Understanding the loss landscape and gradient flow specific to ${fieldName} problem sets.`,
          'Ensuring numerical stability and preventing gradient explosion / vanishing.',
          'Selecting regularizers that preserve domain-specific structural constraints.'
        ],
        pythonCode: `import numpy as np

def compute_objective_and_gradients(X: np.ndarray, y: np.ndarray, weights: np.ndarray, l2_reg: float = 0.01):
    """Computes vectorized empirical risk loss and gradients with L2 regularization."""
    N = X.shape[0]
    predictions = X @ weights
    errors = predictions - y
    loss = (1.0 / (2.0 * N)) * np.sum(errors ** 2) + (l2_reg / 2.0) * np.sum(weights ** 2)
    gradients = (1.0 / N) * (X.T @ errors) + l2_reg * weights
    return loss, gradients

# Example verification
X_sample = np.random.randn(100, 5)
w_sample = np.random.randn(5)
y_sample = X_sample @ w_sample + np.random.normal(0, 0.1, 100)
loss, grad = compute_objective_and_gradients(X_sample, y_sample, w_sample)
print(f"Computed loss: {loss:.4f}, Gradient norm: {np.linalg.norm(grad):.4f}")`,
        codeExplanation: `Vectorized computation of regularized risk loss and exact analytical gradient vectors.`,
        interviewTrap: `Forgetting to divide gradients by batch size N, leading to batch-size dependent learning rates.`,
        industryUse: `Essential for training custom objective functions in ${fieldName}.`
      },
      {
        id: `${slug}-core-algorithms`,
        title: `Core Algorithms & Feature Pipelines in ${fieldName}`,
        category: 'core_ml',
        difficulty: 'Intermediate',
        summary: `Domain-specific feature representation, cross-validation discipline, and ensemble techniques.`,
        mathFormula: '\\hat{y} = \\sum_{m=1}^M \\gamma_m h_m(x)',
        keyInsights: [
          'Feature normalization and handling of domain-specific missing values or noise.',
          'Preventing subtle data leakage through strict split boundaries.',
          'Evaluating models with precision-recall and area-under-curve trade-offs.'
        ],
        pythonCode: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor

def build_ml_pipeline():
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42))
    ])
    return pipeline

print(f"Pipeline ready for {fieldName} dataset ingestion.")`,
        codeExplanation: `Constructs an automated preprocessing and ensemble modeling pipeline.`,
        interviewTrap: `Fitting the StandardScaler on the entire dataset prior to train/test split.`,
        industryUse: `Deployed in production ${fieldName} inference services.`
      },
      {
        id: `${slug}-deep-learning`,
        title: `Deep Neural Architectures for ${fieldName}`,
        category: 'deep_learning',
        difficulty: 'Advanced',
        summary: `Custom neural network backbones, residual connections, and inductive biases tailored to ${fieldName}.`,
        mathFormula: 'y = \\sigma(W_2 \\cdot \\text{ReLU}(W_1 x + b_1) + b_2)',
        keyInsights: [
          'Designing layer depth and width appropriate for domain complexity.',
          'Utilizing modern activations (GELU/Swish) and normalization layers (LayerNorm/RMSNorm).',
          'Implementing learning rate warmups and cosine decay schedules.'
        ],
        pythonCode: `import torch
import torch.nn as nn

class DomainNeuralNet(nn.Module):
    def __init__(self, in_features: int, hidden_dim: int, out_features: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.LayerNorm(hidden_dim // 2),
            nn.GELU(),
            nn.Linear(hidden_dim // 2, out_features)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

model = DomainNeuralNet(in_features=32, hidden_dim=128, out_features=1)
sample = torch.randn(4, 32)
print("Forward output shape:", model(sample).shape)`,
        codeExplanation: `Production PyTorch feedforward architecture with LayerNorm and GELU activations.`,
        interviewTrap: `Forgetting model.eval() during inference, causing Dropout layers to remain active.`,
        industryUse: `Standard backbone for specialized regression and classification tasks in ${fieldName}.`
      }
    ],
    challenges: [
      {
        id: `ch-${slug}-1`,
        title: `Custom Metric & Loss Implementation for ${fieldName}`,
        difficulty: 'Medium',
        description: `Implement a specialized loss function and evaluation metric designed for high-stakes problem solving in ${fieldName}.`,
        constraints: ['Vectorized PyTorch implementation', 'Numerically stable across small and large values'],
        starterCode: `import torch

def custom_domain_loss(predictions: torch.Tensor, targets: torch.Tensor, penalty_weight: float = 2.0) -> torch.Tensor:
    """
    Args:
        predictions: (N,) tensor of model outputs
        targets: (N,) tensor of ground truth labels
        penalty_weight: scalar multiplier for underestimation errors
    Returns:
        scalar loss tensor
    """
    # Implement your custom loss here
    pass`,
        solutionCode: `import torch

def custom_domain_loss(predictions: torch.Tensor, targets: torch.Tensor, penalty_weight: float = 2.0) -> torch.Tensor:
    errors = predictions - targets
    # Asymmetric penalty: penalize under-predictions more heavily
    loss = torch.where(errors < 0, penalty_weight * (errors ** 2), errors ** 2)
    return torch.mean(loss)`,
        explanation: `Computes asymmetric quadratic loss penalizing dangerous under-predictions more severely than over-predictions.`,
        expectedOutput: `Scalar loss with weighted asymmetry`,
        hints: ['Use torch.where to conditionally apply penalty weights based on error sign.'],
        testCases: [{ input: 'predictions=[0.8, 1.2], targets=[1.0, 1.0]', expected: 'Weighted error calculation' }]
      }
    ],
    projects: [
      {
        id: `proj-${slug}-basic`,
        title: `${fieldName} Baseline Predictor & Exploratory Pipeline`,
        level: 'Basic',
        tagline: `End-to-end data processing, feature engineering, and baseline model with automated reporting.`,
        problemStatement: `Organizations in ${fieldName} lack rapid prototyping tools to benchmark ML feasibility on raw datasets.`,
        industryValue: `Demonstrates clean Python software engineering, reproducible data pipelines, and baseline model discipline.`,
        techStack: ['Python 3.11', 'Scikit-Learn', 'Pandas', 'Matplotlib', 'FastAPI'],
        architectureSteps: [
          { step: 1, title: 'Data Cleaning & Validation', description: 'Clean missing values, detect outliers, and perform stratified train/test split.', pythonModule: 'src/data.py' },
          { step: 2, title: 'Baseline Model Training', description: 'Train baseline gradient boosting model and evaluate with domain metrics.', pythonModule: 'src/train.py' },
          { step: 3, title: 'Inference API & Docker', description: 'Expose REST endpoint via FastAPI and containerize with Docker.', pythonModule: 'app/main.py' }
        ],
        datasetRecommendation: {
          name: `${fieldName} Benchmark Dataset`,
          source: 'Kaggle / OpenData',
          format: 'CSV / Parquet',
          description: `Representative real-world dataset for ${fieldName}.`
        },
        metricsToTrack: ['Validation F1 / RMSE', 'Inference Latency (< 20ms)', 'Container Size (< 600MB)'],
        pythonCode: `# Baseline Project implementation for ${fieldName}
print("Baseline model pipeline loaded.")`,
        readmeContent: `# ${fieldName} Baseline Predictor\n\nA clean, reproducible machine learning pipeline with FastAPI and Docker.`,
        interviewTalkingPoints: [`Why setting a strong linear/tree baseline is critical before introducing deep learning in ${fieldName}.`]
      },
      {
        id: `proj-${slug}-inter`,
        title: `Production ${fieldName} Microservice with Automated Monitoring`,
        level: 'Intermediate',
        tagline: `Full-stack API serving optimized models with data drift detection and Docker containerization.`,
        problemStatement: `Models deployed in ${fieldName} silently degrade when live data shifts away from training distributions.`,
        industryValue: `Demonstrates API design, drift detection, logging, and automated testing.`,
        techStack: ['Python 3.11', 'PyTorch', 'FastAPI', 'Evidently AI', 'Docker'],
        architectureSteps: [
          { step: 1, title: 'Model Optimization', description: 'Optimize model weights and export to ONNX format for accelerated runtime.', pythonModule: 'src/optimize.py' },
          { step: 2, title: 'Drift Detection Service', description: 'Evaluate live request distributions against baseline training distribution.', pythonModule: 'src/monitor.py' },
          { step: 3, title: 'FastAPI Production Server', description: 'Async endpoints with Pydantic validation and logging.', pythonModule: 'app/server.py' }
        ],
        datasetRecommendation: {
          name: `Time-Series / Tabular ${fieldName} Dataset`,
          source: 'OpenML / Kaggle',
          format: 'Parquet',
          description: 'High dimensional dataset with temporal variation.'
        },
        metricsToTrack: ['P99 Response Time (< 25ms)', 'Drift Detection Precision', 'Throughput (> 100 req/s)'],
        pythonCode: `# Intermediate Project implementation for ${fieldName}
print("Production microservice pipeline loaded.")`,
        readmeContent: `# Production ${fieldName} Serving Engine\n\nHigh-performance ML serving with real-time drift detection and automated alerts.`,
        interviewTalkingPoints: ['How we implemented non-parametric Kolmogorov-Smirnov tests to catch data drift in production.']
      },
      {
        id: `proj-${slug}-adv`,
        title: `Enterprise Distributed AI Platform for ${fieldName}`,
        level: 'Advanced',
        tagline: `Flagship distributed ML system featuring modern deep learning, vector embeddings, and cloud orchestration.`,
        problemStatement: `Scaling ${fieldName} models to millions of concurrent predictions requires distributed compute and low latency.`,
        industryValue: `Premier resume flagship demonstrating distributed training, advanced deep learning, and cloud-native MLOps.`,
        techStack: ['Python', 'PyTorch', 'Ray / Triton', 'Qdrant / Milvus', 'Kubernetes', 'FastAPI'],
        architectureSteps: [
          { step: 1, title: 'Deep Architecture & Representation Learning', description: 'Train state-of-the-art transformer or neural backbone with custom domain objectives.', pythonModule: 'src/model.py' },
          { step: 2, title: 'Distributed Vector / Feature Indexing', description: 'Index high-dimensional embeddings for low-latency similarity search.', pythonModule: 'src/index.py' },
          { step: 3, title: 'Kubernetes Scaled Deployment', description: 'Deploy autoscaling inference cluster with Prometheus monitoring.', pythonModule: 'k8s/deployment.yaml' }
        ],
        datasetRecommendation: {
          name: `Large-Scale ${fieldName} Corpus`,
          source: 'Industry Benchmark / Research Hub',
          format: 'HDF5 / Sharded Parquet',
          description: 'Over 500,000 real-world records or high-res assets.'
        },
        metricsToTrack: ['Top-1 Accuracy / F1', 'P99 Latency (< 15ms)', 'Zero-downtime rolling updates'],
        pythonCode: `# Advanced Project implementation for ${fieldName}
print("Distributed AI Platform initialized.")`,
        readmeContent: `# Enterprise ${fieldName} AI Platform\n\nProduction distributed architecture with vector indexing and Kubernetes deployment.`,
        interviewTalkingPoints: ['Managing distributed inference throughput and memory bottlenecks in production.']
      }
    ],
    roadmap: [
      { week: 1, phase: 'Foundations', focus: 'Math, Data Ingestion & NumPy/PyTorch', milestones: ['Master matrix operations and gradient formulations', 'Ingest and clean domain raw datasets', 'Train linear/logistic baseline'], deliverables: 'Data preprocessing and exploratory notebook' },
      { week: 2, phase: 'Foundations', focus: 'Classical ML & Feature Engineering', milestones: ['Engineer domain-specific features', 'Implement cross-validation with temporal buffers', 'Train tree-based ensembles (XGBoost/LightGBM)'], deliverables: 'Evaluated tree-based model with feature importance rankings' },
      { week: 3, phase: 'Foundations', focus: 'Portfolio Project 1: Baseline Predictor', milestones: ['Build end-to-end Python pipeline', 'Wrap with FastAPI REST endpoint', 'Author comprehensive GitHub README'], deliverables: 'Portfolio Project 1 repository ready for showcase' },
      { week: 4, phase: 'Deep Learning', focus: 'Neural Architectures & PyTorch Mastery', milestones: ['Build custom PyTorch Dataset and DataLoader', 'Implement domain loss functions with gradient checks', 'Train multi-layer neural network with learning rate schedules'], deliverables: 'Trained neural network checkpoint with training curves' },
      { week: 5, phase: 'Deep Learning', focus: 'Modern Architectures & Regularization', milestones: ['Incorporate modern normalization and attention mechanisms', 'Apply data augmentation tailored to the domain', 'Log experiments using MLflow or Weights & Biases'], deliverables: 'Experiment comparison tracking table' },
      { week: 6, phase: 'Production Engineering', focus: 'Portfolio Project 2: Production Microservice', milestones: ['Containerize application with multi-stage Dockerfile', 'Implement data and concept drift detection', 'Benchmark API latency under concurrency'], deliverables: 'Portfolio Project 2 containerized service' },
      { week: 7, phase: 'Advanced Topics', focus: 'Representation Learning & Vector Embeddings', milestones: ['Extract and analyze high-dimensional embeddings', 'Set up vector database indexing (Qdrant/Chroma)', 'Evaluate nearest neighbor retrieval accuracy'], deliverables: 'Vector search benchmark notebook' },
      { week: 8, phase: 'Advanced Topics', focus: 'Model Optimization & Compression', milestones: ['Quantize weights to INT8 precision', 'Export computational graph to ONNX', 'Measure speedup and memory reduction'], deliverables: 'Optimization benchmarking report' },
      { week: 9, phase: 'Advanced Topics', focus: 'Portfolio Project 3: Flagship Architecture', milestones: ['Implement scalable distributed pipeline', 'Build interactive UI demonstration (Streamlit/React)', 'Set up automated CI/CD pipeline'], deliverables: 'Portfolio Project 3 flagship repository' },
      { week: 10, phase: 'Production & MLOps', focus: 'Observability & Monitoring', milestones: ['Expose Prometheus metrics for model latency and drift', 'Design automated alert rules for model degradation', 'Write system design documentation'], deliverables: 'Production architecture diagram and runbook' },
      { week: 11, phase: 'Interview Preparation', focus: 'Domain Questions & System Design', milestones: ['Review core mathematical proofs', 'Practice 15 high-frequency technical interview questions', 'Refine resume project bullet points with quantified impact'], deliverables: 'Tailored interview cheat sheet and updated resume' },
      { week: 12, phase: 'Launch & Networking', focus: 'Portfolio Presentation & Demos', milestones: ['Record 90-second video demo showcasing projects', 'Publish codebases with polished badges and documentation', 'Share learning journey and results on LinkedIn/GitHub'], deliverables: 'Complete portfolio live and ready for hiring managers' }
    ],
    interviewPrep: [
      {
        id: `q-${slug}-1`,
        type: 'Theory',
        difficulty: 'Senior',
        question: `What are the primary failure modes when applying machine learning to ${fieldName}, and how do you mitigate them?`,
        answer: `In ${fieldName}, the primary failure modes are: 1. Data leakage across temporal or contextual boundaries, producing artificially inflated validation scores. 2. Severe class or target distribution imbalance. 3. Concept drift where live operational dynamics diverge from historical training data. Mitigation requires causal walk-forward splitting, domain-calibrated asymmetric loss functions, and continuous statistical drift monitoring (KS-test / Wasserstein distance).`,
        followUp: `How would you diagnose whether a performance drop is caused by data drift versus label drift?`
      },
      {
        id: `q-${slug}-2`,
        type: 'System Design',
        difficulty: 'Senior',
        question: `Design an end-to-end ML production architecture for ${fieldName} capable of handling 5,000 requests per second with under 30ms latency.`,
        answer: `1. Ingestion: Kafka stream buffer decoupling clients from inferencing. 2. Preprocessing: Vectorized feature transformation using C++ / Rust or optimized Polars pipelines. 3. Inference: Triton Inference Server with dynamic batching and TensorRT INT8 compiled engines. 4. Caching: Redis semantic vector cache for identical or near-duplicate queries. 5. Observability: Asynchronous logging to ClickHouse / OpenTelemetry for drift detection without blocking the hot request path.`,
        followUp: `What is your fallback strategy if the inference cluster exceeds 90% GPU memory utilization?`
      }
    ]
  };
}

// 1. GET /api/curated-domains: Returns list of available curated domains
app.get('/api/curated-domains', (_req: Request, res: Response) => {
  const list = Object.values(CURATED_DOMAINS).map((d) => ({
    id: d.domainId,
    name: d.domainName,
    badge: d.badge,
    tagline: d.tagline,
    marketDemand: d.marketDemand,
    salary: d.averageSalaryRange,
    skills: d.keySkills,
  }));
  res.json({ domains: list });
});

// 2. POST /api/domain-path: Generates or retrieves full roadmap for any field
app.post('/api/domain-path', async (req: Request, res: Response) => {
  try {
    const { domain, focusLevel, customGoals } = req.body;
    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: 'Domain name is required.' });
      return;
    }

    const trimmed = domain.trim();
    const curated = findCuratedMatch(trimmed);

    // If user asked for a curated domain without custom prompt specifications, return instant curated
    if (curated && !customGoals && (!focusLevel || focusLevel === 'all')) {
      res.json({ data: curated, source: 'curated' });
      return;
    }

    // If Gemini API Key is available, invoke gemini-3.8-flash for rich structured custom curriculum
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a Principal Machine Learning Engineer and AI Curriculum Architect.
Generate an exhaustive, highly practical, production-grade Machine Learning learning path, concept mastery guide, and tiered portfolio projects for the following field:
Field: "${trimmed}"
Focus Level: "${focusLevel || 'Comprehensive'}"
User Specific Goals: "${customGoals || 'Build a world-class portfolio and master core theory'}"

Requirements:
1. Provide accurate mathematical formulations and insights.
2. Provide realistic, runnable Python code snippets using modern libraries (PyTorch, Scikit-Learn, Polars, etc.).
3. Structure 3 distinct Portfolio Projects (Basic, Intermediate, Advanced) with clear industry problem statements, architecture steps, dataset recommendations, and interview talking points.
4. Detail a 12-week roadmap and 3-5 real technical interview questions.

Return strictly a valid JSON object matching this schema.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                domainId: { type: Type.STRING },
                domainName: { type: Type.STRING },
                badge: { type: Type.STRING },
                tagline: { type: Type.STRING },
                marketDemand: { type: Type.STRING, enum: ['Ultra High', 'High', 'Rapidly Growing', 'Specialized'] },
                averageSalaryRange: { type: Type.STRING },
                keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedLibraries: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING }
                    },
                    required: ['name', 'purpose']
                  }
                },
                concepts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: { type: Type.STRING, enum: ['math', 'core_ml', 'deep_learning', 'specialized', 'production'] },
                      difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                      summary: { type: Type.STRING },
                      mathFormula: { type: Type.STRING },
                      keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
                      pythonCode: { type: Type.STRING },
                      codeExplanation: { type: Type.STRING },
                      interviewTrap: { type: Type.STRING },
                      industryUse: { type: Type.STRING }
                    },
                    required: ['id', 'title', 'category', 'difficulty', 'summary', 'keyInsights', 'pythonCode', 'codeExplanation', 'interviewTrap', 'industryUse']
                  }
                },
                challenges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
                      description: { type: Type.STRING },
                      constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                      starterCode: { type: Type.STRING },
                      solutionCode: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      expectedOutput: { type: Type.STRING },
                      hints: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['id', 'title', 'difficulty', 'description', 'constraints', 'starterCode', 'solutionCode', 'explanation', 'expectedOutput', 'hints']
                  }
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      level: { type: Type.STRING, enum: ['Basic', 'Intermediate', 'Advanced'] },
                      tagline: { type: Type.STRING },
                      problemStatement: { type: Type.STRING },
                      industryValue: { type: Type.STRING },
                      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                      architectureSteps: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            step: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            pythonModule: { type: Type.STRING }
                          },
                          required: ['step', 'title', 'description', 'pythonModule']
                        }
                      },
                      datasetRecommendation: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          source: { type: Type.STRING },
                          format: { type: Type.STRING },
                          description: { type: Type.STRING }
                        },
                        required: ['name', 'source', 'format', 'description']
                      },
                      metricsToTrack: { type: Type.ARRAY, items: { type: Type.STRING } },
                      pythonCode: { type: Type.STRING },
                      readmeContent: { type: Type.STRING },
                      interviewTalkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['id', 'title', 'level', 'tagline', 'problemStatement', 'industryValue', 'techStack', 'architectureSteps', 'datasetRecommendation', 'metricsToTrack', 'pythonCode', 'readmeContent', 'interviewTalkingPoints']
                  }
                },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      week: { type: Type.INTEGER },
                      phase: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      milestones: { type: Type.ARRAY, items: { type: Type.STRING } },
                      deliverables: { type: Type.STRING }
                    },
                    required: ['week', 'phase', 'focus', 'milestones', 'deliverables']
                  }
                },
                interviewPrep: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['Theory', 'Coding', 'System Design', 'MLOps'] },
                      answer: { type: Type.STRING },
                      followUp: { type: Type.STRING },
                      difficulty: { type: Type.STRING, enum: ['Junior', 'Mid', 'Senior', 'Staff'] }
                    },
                    required: ['id', 'question', 'type', 'answer', 'followUp', 'difficulty']
                  }
                }
              },
              required: [
                'domainId',
                'domainName',
                'badge',
                'tagline',
                'marketDemand',
                'averageSalaryRange',
                'keySkills',
                'recommendedLibraries',
                'concepts',
                'challenges',
                'projects',
                'roadmap',
                'interviewPrep'
              ]
            }
          }
        });

        if (response.text) {
          const generatedData = JSON.parse(response.text);
          res.json({ data: generatedData, source: 'gemini' });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini generation error, falling back to structured generator:', geminiError);
      }
    }

    // Fallback: Use curated if close match or build custom fallback domain
    if (curated) {
      res.json({ data: curated, source: 'curated' });
    } else {
      res.json({ data: buildFallbackDomain(trimmed), source: 'fallback' });
    }
  } catch (error) {
    console.error('Error generating domain path:', error);
    res.status(500).json({ error: 'Failed to generate machine learning domain path.' });
  }
});

// 3. POST /api/mentor: Machine Learning AI Mentor chat
app.post('/api/mentor', async (req: Request, res: Response) => {
  try {
    const { message, domainContext, codeSnippet } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        reply: `Here is guidance regarding your question about **${domainContext || 'Machine Learning'}**:\n\nWhen mastering ML concepts and building portfolio projects in Python, focus on:\n1. **Theoretical Intuition**: Understanding why an algorithm works mathematically and its optimization landscape.\n2. **Clean Vectorized Python**: Avoiding Python 'for' loops across tensor dimensions using PyTorch or NumPy.\n3. **Production Rigor**: Writing unit tests, measuring inference latency, and tracking data drift.\n\nKeep iterating on the starter code and challenges in this domain!`,
      });
      return;
    }

    const systemInstruction = `You are MLPath Mentor, an elite Senior Staff Machine Learning Engineer and AI Educator.
You provide clear, mathematically sound, yet accessible explanations.
Always include practical Python (PyTorch/Scikit-Learn) examples or code snippets when helpful.
Focus on interview clarity and industry production standards.
Keep responses concise, well-structured with markdown headings, bold points, and code blocks.`;

    const contents = `Domain Context: ${domainContext || 'General Machine Learning'}
${codeSnippet ? `Current Code Snippet:\n\`\`\`python\n${codeSnippet}\n\`\`\`\n` : ''}
User Question: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || 'Unable to generate response at this time.' });
  } catch (error) {
    console.error('Error in mentor endpoint:', error);
    res.status(500).json({ error: 'Failed to consult AI mentor.' });
  }
});

// 4. POST /api/generate-readme: Generates production GitHub README
app.post('/api/generate-readme', async (req: Request, res: Response) => {
  try {
    const { project, domainName, authorName = 'ML Engineer', repoName } = req.body;
    if (!project) {
      res.status(400).json({ error: 'Project data is required.' });
      return;
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Generate an exceptional, professional, portfolio-grade GitHub README.md for the following Machine Learning project:
Project Title: ${project.title}
Domain: ${domainName}
Level: ${project.level}
Tagline: ${project.tagline}
Problem Statement: ${project.problemStatement}
Tech Stack: ${project.techStack?.join(', ')}
Key Metrics: ${project.metricsToTrack?.join(', ')}
Dataset: ${project.datasetRecommendation?.name} (${project.datasetRecommendation?.source})

Format requirements:
- Clean Markdown with GitHub Badges (Python, PyTorch, License, Docker)
- Architecture overview diagram (ASCII / Mermaid)
- Detailed Key Results & Benchmarks table
- Project Directory Tree
- Step-by-Step Installation & Quickstart
- Evaluation & Inference script usage
- Citation & License

Return only the markdown text.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response.text) {
          res.json({ readme: response.text });
          return;
        }
      } catch (e) {
        console.warn('Gemini README generation fallback:', e);
      }
    }

    // Default README fallback if Gemini offline
    const fallbackReadme = `# ${project.title}

[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2+-ee4c2c.svg)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

> **${project.tagline}**

## 📌 Executive Summary
${project.problemStatement}

### 💡 Industry Impact
${project.industryValue}

## 🚀 Key Highlights & Metrics
${project.metricsToTrack?.map((m: string) => `- **${m}**`).join('\n') || '- Verified production accuracy\n- Low latency inference'}

## 🛠️ Tech Stack
${project.techStack?.map((t: string) => `- \`${t}\``).join('\n') || '- Python\n- PyTorch'}

## 📊 Dataset Recommendation
- **Dataset:** ${project.datasetRecommendation?.name || 'Standard Benchmark'}
- **Source:** ${project.datasetRecommendation?.source || 'OpenML / Kaggle'}
- **Format:** ${project.datasetRecommendation?.format || 'Parquet / CSV'}

## 📁 Repository Structure
\`\`\`text
├── configs/           # YAML hyperparameters
├── data/              # Data ingestion & schema validation
├── notebooks/         # Exploratory data analysis (EDA)
├── src/
│   ├── model.py       # Neural network / algorithm architecture
│   ├── dataset.py     # Vectorized data loaders & augmentations
│   ├── train.py       # Mixed-precision training pipeline
│   └── evaluate.py    # Metric calculation & confusion matrices
├── app/
│   └── main.py        # FastAPI inference microservice
├── Dockerfile
├── requirements.txt
└── README.md
\`\`\`

## ⚡ Quickstart

\`\`\`bash
# 1. Clone repository
git clone https://github.com/${authorName.toLowerCase().replace(/\s+/g, '')}/${(repoName || project.id || 'ml-project')}.git
cd ${(repoName || project.id || 'ml-project')}

# 2. Setup virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt

# 3. Run training
python src/train.py --epochs 20 --batch-size 32

# 4. Launch Inference API
uvicorn app.main:app --host 0.0.0.0 --port 8000
\`\`\`

## 🎙️ Interview Talking Points
${project.interviewTalkingPoints?.map((p: string) => `- ${p}`).join('\n') || '- Discussed trade-offs between model complexity and latency.'}

## 📄 License
Distributed under the MIT License. Built by [${authorName}](https://github.com/).
`;
    res.json({ readme: fallbackReadme });
  } catch (error) {
    console.error('Error generating README:', error);
    res.status(500).json({ error: 'Failed to generate README.' });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MLPath Forge server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
