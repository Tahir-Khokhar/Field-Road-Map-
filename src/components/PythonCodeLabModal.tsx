import React, { useState } from 'react';
import { 
  Terminal, 
  X, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { copyToClipboard, downloadFile } from '../utils/exportUtils';
import { simulatePythonExecution } from '../utils/pythonRunner';

interface PythonCodeLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  initialTitle?: string;
}

const TEMPLATES: { name: string; code: string }[] = [
  {
    name: 'PyTorch Tensor Math & AutoGrad',
    code: `import torch

# 1. Create tensors with gradient tracking
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
w = torch.tensor([[0.5, -0.5], [1.0, 2.0]], requires_grad=True)

# 2. Forward pass: matrix multiplication + non-linearity
z = torch.matmul(x, w)
loss = torch.sum(torch.relu(z))

# 3. Backward pass
loss.backward()

print("Forward Output Matrix Z:")
print(z.detach().numpy())
print(f"Computed Scalar Loss: {loss.item():.4f}")
print("Gradient dLoss/dx:")
print(x.grad.numpy())`,
  },
  {
    name: 'Self-Attention Matrix Computation',
    code: `import numpy as np

def softmax(x, axis=-1):
    e_x = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e_x / np.sum(e_x, axis=axis, keepdims=True)

# 4 tokens, embedding dimension 8
seq_len, d_k = 4, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

# Scaled dot-product
scores = np.matmul(Q, K.T) / np.sqrt(d_k)
attn_weights = softmax(scores, axis=-1)
output = np.matmul(attn_weights, V)

print("Attention Affinity Matrix (Tokens x Tokens):")
print(np.round(attn_weights, 3))
print("Contextualized Output Representation Shape:", output.shape)`,
  },
  {
    name: 'Scikit-Learn Pipeline & Metrics',
    code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import numpy as np

# Synthetic classification dataset
np.random.seed(42)
X = np.random.randn(200, 4)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

# Train/Test split
X_train, X_test = X[:150], X[150:]
y_train, y_test = y[:150], y[150:]

# Pipeline assembly
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('clf', LogisticRegression())
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, y_pred))`,
  },
];

export const PythonCodeLabModal: React.FC<PythonCodeLabModalProps> = ({
  isOpen,
  onClose,
  initialCode,
  initialTitle,
}) => {
  const [code, setCode] = useState(initialCode || TEMPLATES[0].code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = simulatePythonExecution(code);
      setOutput(`[Python 3.11 Execution - Completed in ${res.executionTimeMs}ms]\n${res.stdout}`);
      setIsRunning(false);
    }, 300);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile('sandbox_script.py', code, 'text/x-python');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-5 py-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Interactive Python Code Lab {initialTitle ? `— ${initialTitle}` : ''}
              </h3>
              <p className="text-[11px] text-slate-400">
                PyTorch & NumPy execution environment with simulated output
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Template Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Template:</span>
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setCode(t.code)}
                  className="rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  {t.name}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 px-5 py-2">
          <span className="text-xs font-mono text-emerald-400">
            Python 3.11 | PyTorch 2.2 | NumPy 1.26
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 cursor-pointer"
            >
              <Download className="h-3 w-3" />
              <span>Download .py</span>
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>{isRunning ? 'Running...' : 'Execute'}</span>
            </button>
          </div>
        </div>

        {/* Body: Split Code Textarea and Output Terminal */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 flex-1 overflow-hidden">
          {/* Editor */}
          <div className="p-4 flex flex-col overflow-y-auto">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Python Script
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full flex-1 resize-none bg-transparent font-mono text-xs text-slate-200 focus:outline-none leading-relaxed"
              style={{ tabSize: 4 }}
            />
          </div>

          {/* Console Output */}
          <div className="p-4 bg-slate-950 flex flex-col overflow-y-auto">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Standard Output (stdout)</span>
              <button
                onClick={() => setOutput('')}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </label>
            <div className="w-full flex-1 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-y-auto">
              {output || (
                <span className="text-slate-500 italic">
                  Click 'Execute' to run this script and inspect tensor shapes, loss gradients, or model metrics.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
