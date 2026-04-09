import React from 'react';
import { 
  LayoutGrid, 
  CheckSquare, 
  Settings as SettingsIcon, 
  BrainCircuit,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  taskCount: number;
  reviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, taskCount, reviewCount }) => {
  return (
    <nav className="w-20 md:w-64 border-r border-slate-800/50 bg-slate-900/20 backdrop-blur-xl flex flex-col p-4 h-full">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight hidden md:block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          NeuroVault
        </h1>
      </div>

      <div className="space-y-2 flex-1">
        <NavItem 
          active={currentView === 'dashboard'} 
          onClick={() => setView('dashboard')} 
          icon={<LayoutGrid size={20}/>} 
          label="Library" 
        />
        <NavItem 
          active={currentView === 'tasks'} 
          onClick={() => setView('tasks')} 
          icon={<CheckSquare size={20}/>} 
          label="Tasks" 
          count={taskCount} 
        />
        
        <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:block">
          Insight
        </div>
        <div className="flex items-center gap-3 px-4 py-2 text-sm text-amber-400/80">
          <Clock size={16} />
          <span className="hidden md:block">{reviewCount} for review</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/50">
        <NavItem 
          active={currentView === 'settings'} 
          onClick={() => setView('settings')} 
          icon={<SettingsIcon size={20}/>} 
          label="Settings" 
        />
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, count }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active ? "bg-indigo-600/10 text-indigo-400" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
      )}
    >
      <span className={cn(active && "text-indigo-400")}>{icon}</span>
      <span className="text-sm font-semibold hidden md:block flex-1 text-left">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="hidden md:block text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
          {count}
        </span>
      )}
    </button>
  );
};
