import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 shadow-xl">
        <BrainCircuit size={40} className="text-slate-700" />
      </div>
      <h3 className="text-xl font-bold text-slate-300 mb-2">No intelligence found</h3>
      <p className="text-slate-500 max-w-xs mx-auto text-sm">
        Start by capturing a URL, text snippet, or screenshot to build your vault.
      </p>
    </div>
  );
};
