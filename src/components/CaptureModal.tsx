import React, { useState, useRef } from 'react';
import { 
  X, 
  Globe, 
  Type, 
  Image as ImageIcon, 
  Cpu, 
  Loader2,
  Calendar,
  StickyNote,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useVault } from '../context/VaultContext';
import { processInput } from '../services/processor';
import { extractTextFromImage } from '../services/ocr';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({ isOpen, onClose }) => {
  const { settings, addItem } = useVault();
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [tab, setTab] = useState<'url' | 'text' | 'image'>('url');
  const [input, setInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setStep('input');
    setInput('');
    setAnalysisResult(null);
    setDueDate('');
    setNotes('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    try {
      let result = null;
      if (settings.aiEnabled && settings.apiKey) {
        result = await processInput(settings.apiKey, input, tab);
      }

      if (result) {
        setAnalysisResult(result);
        setStep('review');
      } else {
        addItem({
          title: tab === 'url' ? new URL(input).hostname : input.substring(0, 30),
          summary: tab === 'url' ? `Bookmark from ${input}` : input.substring(0, 100),
          tags: ['manual'],
          category: 'Personal',
          type: 'bookmark',
          priority: 'Medium',
          source: input,
          sourceType: tab,
        });
        handleClose();
      }
    } catch (error) {
      console.error(error);
      alert("Processing error. Please check your configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = () => {
    if (!analysisResult) return;
    
    addItem({
      ...analysisResult,
      source: input,
      sourceType: tab,
      notes: notes,
      dueDate: dueDate || undefined,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(analysisResult.imageSearchTerm || analysisResult.title)}/800/600`,
    });
    handleClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const text = await extractTextFromImage(file);
      setInput(text);
      setTab('text');
    } catch (err) {
      alert("Failed to read image content");
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Cpu size={18} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {step === 'input' ? 'Index Content' : 'Refine Entry'}
                </h2>
              </div>
              <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {step === 'input' ? (
                <>
                  <div className="flex p-1 bg-slate-950 rounded-xl mb-6">
                    {[
                      { id: 'url', label: 'URL', icon: <Globe size={14}/> },
                      { id: 'text', label: 'Notes', icon: <Type size={14}/> },
                      { id: 'image', label: 'Screenshot', icon: <ImageIcon size={14}/> },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id as any)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                          tab === t.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleProcess} className="space-y-4">
                    {tab === 'image' ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-800 rounded-2xl h-40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                      >
                        {ocrLoading ? (
                          <Loader2 className="animate-spin text-indigo-500" />
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                              <ImageIcon size={24} />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Click to upload screenshot</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          accept="image/*" 
                        />
                      </div>
                    ) : (
                      <textarea
                        autoFocus
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none text-sm"
                        placeholder={tab === 'url' ? "Paste a link to index..." : "Paste thoughts, snippets, or data..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    )}

                    <button
                      disabled={loading || (!input && tab !== 'image') || ocrLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Cpu size={18} /> 
                          {settings.aiEnabled ? "Index Content" : "Save to Vault"}
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img 
                      src={`https://picsum.photos/seed/${encodeURIComponent(analysisResult.imageSearchTerm || analysisResult.title)}/800/400`}
                      alt="Generated Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-indigo-400 mb-1 flex items-center gap-2">
                        <Cpu size={14} /> System Analysis
                      </h3>
                      <p className="text-lg font-bold text-white leading-tight">{analysisResult?.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{analysisResult?.summary}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult?.type === 'task' && (
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                          <Calendar size={14} /> Due Date
                        </label>
                        <input 
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <StickyNote size={14} /> Personal Notes
                      </label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your own thoughts or context..."
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 sticky bottom-0 bg-slate-900 pt-2 pb-1">
                    <button
                      onClick={() => setStep('input')}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleFinalSave}
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                    >
                      <Check size={18} /> Save Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
