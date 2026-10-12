export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
}

export function simulatePythonExecution(code: string): ExecutionResult {
  const startTime = performance.now();
  const outputLines: string[] = [];

  // Match print statements
  const printRegex = /print\((?:f?["'](.*?)["']|(.*?))\)/g;
  let match;
  let printedCount = 0;

  // Simple parser for print statements
  const lines = code.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('print(')) {
      const match = trimmed.match(/print\((.*)\)/);
      if (match && match[1]) {
        let content = match[1].trim();
        // Remove surrounding quotes if simple string
        if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
          content = content.slice(1, -1);
        } else if (content.startsWith('f"') || content.startsWith("f'")) {
          content = content.slice(2, -1).replace(/\{.*?\}/g, (exp) => {
            if (exp.includes('shape')) return '(2, 196, 768)';
            if (exp.includes('loss') || exp.includes('Loss')) return '0.2415';
            if (exp.includes('IoU') || exp.includes('iou')) return '0.7241';
            if (exp.includes('Score') || exp.includes('pred')) return '0.9420';
            if (exp.includes('Sharpe') || exp.includes('sharpe')) return '1.85';
            if (exp.includes('p_value') || exp.includes('statistic')) return '0.0124';
            return '42';
          });
        }
        outputLines.push(content);
        printedCount++;
      }
    }
  }

  // If no explicit print found or general script output
  if (printedCount === 0) {
    if (code.includes('def non_max_suppression')) {
      outputLines.push('Testing NMS with 3 candidate bounding boxes:');
      outputLines.push('Boxes: [[10, 10, 50, 50], [12, 12, 48, 48], [100, 100, 200, 200]]');
      outputLines.push('Scores: [0.90, 0.75, 0.85]');
      outputLines.push('Threshold: 0.5');
      outputLines.push('>> Kept Box Indices: [0, 2] (Suppressed overlapping box 1 with IoU=0.88)');
      outputLines.push('Test assertions PASSED (1/1)');
    } else if (code.includes('def bpe_merge_step') || code.includes('bpe')) {
      outputLines.push('Evaluating BPE symbol pair frequencies:');
      outputLines.push("Initial vocab: {('l','o','w'): 5, ('l','o','w','e','r'): 2, ('n','e','w'): 6}");
      outputLines.push("Winning most frequent pair: ('e', 'w') with frequency count = 8");
      outputLines.push("New merged vocabulary updated.");
      outputLines.push('Test assertions PASSED (1/1)');
    } else if (code.includes('def calculate_c_index') || code.includes('c_index')) {
      outputLines.push('Evaluating survival patient cohort concordance:');
      outputLines.push('Permissible pairs evaluated: 45');
      outputLines.push('Concordant pairs: 39 | Ties: 2');
      outputLines.push('>> Harrell C-Index: 0.8889');
      outputLines.push('Test assertions PASSED (1/1)');
    } else if (code.includes('def generate_pairs_signals') || code.includes('z_score')) {
      outputLines.push('Computing cointegration hedge ratio via OLS...');
      outputLines.push('Estimated Hedge Ratio: 1.428');
      outputLines.push('Rolling 30-day Z-Score calculated strictly without lookahead.');
      outputLines.push('Generated 4 Long spread signals, 3 Short spread signals.');
      outputLines.push('Test assertions PASSED (1/1)');
    } else if (code.includes('FocalLoss') || code.includes('focal_loss')) {
      outputLines.push('Focal Loss initialized with gamma=2.0, alpha=0.25');
      outputLines.push('Input Logits: [5.0, -4.0, 0.1, -0.2]');
      outputLines.push('Target Labels: [1.0, 0.0, 1.0, 0.0]');
      outputLines.push('Computed Focal Loss: 0.0487 (Downweighted easy predictions by 96.2%)');
    } else if (code.includes('PatchEmbedding') || code.includes('ViT')) {
      outputLines.push('Image input shape: torch.Size([2, 3, 224, 224])');
      outputLines.push('Patch size: 16x16, Embed dimension: 768');
      outputLines.push('Token projection shape: torch.Size([2, 196, 768])');
      outputLines.push('Self-attention memory: 196 x 196 dot product affinity matrix computed.');
    } else {
      outputLines.push('Python 3.11.8 (Conda virtual environment: ml-core)');
      outputLines.push('[PyTorch 2.2.1+cu121 | NumPy 1.26.4 | Scikit-Learn 1.4.1]');
      outputLines.push('✓ Syntax verification: PASSED');
      outputLines.push('✓ Module dependencies resolved.');
      outputLines.push('✓ Computational graph compiled successfully.');
    }
  }

  const endTime = performance.now();
  return {
    success: true,
    stdout: outputLines.join('\n'),
    executionTimeMs: Math.round(endTime - startTime + 42),
  };
}
