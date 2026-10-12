import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  Code2, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { copyToClipboard } from '../utils/exportUtils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  domainName: string;
  currentCodeSnippet?: string;
}

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
  domainName,
  currentCodeSnippet,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your **MLPath Mentor** for **${domainName}**.\n\nAsk me about:\n- Mathematical intuitions and derivations\n- PyTorch vs NumPy implementation patterns\n- Debugging and optimizing inference latency\n- How to answer tricky system design interview questions`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          domainContext: domainName,
          codeSnippet: currentCodeSnippet,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'No response.' }]);
    } catch (err) {
      console.error('Mentor error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue contacting the mentor service. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (idx: number, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ML Engineering AI Mentor</h3>
            <p className="text-[11px] text-slate-400">Context: {domainName}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed relative group ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.role === 'assistant' && (
                <button
                  onClick={() => handleCopyMessage(idx, m.content)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 rounded bg-slate-800 p-1 text-slate-400 hover:text-white transition-opacity cursor-pointer"
                  title="Copy response"
                >
                  {copiedIdx === idx ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Consulting ML Staff Engineer Mentor...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950 flex gap-1.5 overflow-x-auto scrollbar-none">
        {[
          'Explain why we use AdamW over Adam',
          'How do I prevent data leakage in time series?',
          'What is the intuition behind KV caching?',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="border-t border-slate-800 p-3 bg-slate-900/60">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask mentor about math, algorithms, or code..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-3 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-600 hover:bg-emerald-500 p-1.5 text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
