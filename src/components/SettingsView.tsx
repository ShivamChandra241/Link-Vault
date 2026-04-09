import React from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Download, 
  Trash2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useVault } from '../context/VaultContext';

export const SettingsView: React.FC = () => {
  const { settings, setApiKey, setAiEnabled, items, deleteItem } = useVault();

  const exportData = () => {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurovault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      items.forEach(item => deleteItem(item.id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-2xl mx-auto py-10"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-slate-500 text-sm">Configure your AI engine and data</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <Key size={20} />
              <h3 className="font-semibold text-white">Engine Configuration</h3>
            </div>
            <button 
              onClick={() => setAiEnabled(!settings.aiEnabled)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {settings.aiEnabled ? <ToggleRight size={32} className="text-indigo-500" /> : <ToggleLeft size={32} />}
            </button>
          </div>
          
          <label className="block text-sm font-bold text-slate-300 mb-2">Access Token</label>
          <input 
            type="password"
            value={settings.apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Token..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm mb-4"
          />
          
          <div className="flex items-start gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
            <AlertCircle size={18} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-300/70 leading-relaxed">
              Your token is stored <b>locally</b> in your browser. You can obtain it from your service provider dashboard.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Data Management</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={exportData}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-all"
            >
              <Download size={18} /> Export JSON
            </button>
            <button 
              onClick={clearAllData}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all"
            >
              <Trash2 size={18} /> Wipe Vault
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
