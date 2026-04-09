import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { VaultCard } from './components/VaultCard';
import { CaptureModal } from './components/CaptureModal';
import { SettingsView } from './components/SettingsView';
import { EmptyState } from './components/EmptyState';
import { ReviewView } from './components/ReviewView';
import { VaultProvider, useVault } from './context/VaultContext';
import { cn } from './lib/utils';
import { isAfter, subDays } from 'date-fns';

const NeuroVaultApp = () => {
  const { items, settings, updateItem, deleteItem } = useVault();
  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                            item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = filter === 'All' || item.category === filter;
      const matchesView = view === 'tasks' ? item.type === 'task' : true;
      return matchesSearch && matchesFilter && matchesView;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [items, search, filter, view]);

  const taskCount = items.filter(i => i.type === 'task' && !i.completed).length;
  const reviewCount = items.filter(i => isAfter(subDays(new Date(), 3), new Date(i.createdAt)) && !i.completed).length;

  const renderContent = () => {
    if (view === 'settings') return <SettingsView />;
    if (view === 'review') return <ReviewView items={items} />;
    
    return (
      <>
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <Filter size={14} className="text-slate-500 mr-2" />
          {['All', 'Learning', 'Work', 'Finance', 'Shopping', 'Entertainment', 'Personal'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap",
                filter === cat 
                  ? "bg-white text-black border-white" 
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <VaultCard 
                key={item.id} 
                item={item} 
                onDelete={deleteItem} 
                onPin={(id) => updateItem(id, { pinned: !item.pinned })} 
                onToggleComplete={(id, status) => updateItem(id, { completed: status })} 
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </>
    );
  };

  return (
    <div className="flex h-screen bg-[#020408] text-slate-300 font-sans antialiased overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <Sidebar 
        currentView={view} 
        setView={setView} 
        taskCount={taskCount} 
        reviewCount={reviewCount} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        <header className="h-20 border-b border-slate-800/40 flex items-center justify-between px-8 bg-[#020408]/50 backdrop-blur-md">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {!settings.apiKey && settings.aiEnabled && (
              <div className="hidden lg:flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                <AlertCircle size={14} /> Configure Access Token
              </div>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} /> Capture
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-800">
          {renderContent()}
        </div>
      </main>

      <CaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <VaultProvider>
      <NeuroVaultApp />
    </VaultProvider>
  );
}
