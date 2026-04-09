import React from 'react';
import { 
  Pin, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Type,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { VaultItem } from '../types';
import { cn } from '../lib/utils';

interface VaultCardProps {
  item: VaultItem;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onToggleComplete: (id: string, status: boolean) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ item, onDelete, onPin, onToggleComplete }) => {
  const categoryColors = {
    Learning: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Work: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Finance: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Shopping: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Entertainment: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Personal: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full"
    >
      {item.imageUrl && (
        <div className="h-32 w-full overflow-hidden relative">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border",
            categoryColors[item.category] || "bg-slate-800 text-slate-400 border-slate-700"
          )}>
            {item.category}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onPin(item.id)} 
              className={cn(
                "p-1.5 rounded-lg transition-colors", 
                item.pinned ? "text-indigo-400 bg-indigo-500/10" : "text-slate-500 hover:bg-slate-800"
              )}
            >
              <Pin size={14} className={item.pinned ? "fill-current" : ""} />
            </button>
            <button 
              onClick={() => onDelete(item.id)} 
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-100 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-slate-400 text-xs line-clamp-3 mb-4 flex-1">
          {item.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-slate-800/50 text-slate-500 px-2 py-0.5 rounded border border-slate-700/50">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <Calendar size={12} />
            {formatDistanceToNow(new Date(item.createdAt))} ago
          </div>
          
          <div className="flex items-center gap-2">
            {item.type === 'task' ? (
              <button 
                onClick={() => onToggleComplete(item.id, !item.completed)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold transition-colors",
                  item.completed ? "text-emerald-400" : "text-indigo-400 hover:text-indigo-300"
                )}
              >
                {item.completed ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 border-2 border-current rounded-md" />}
                <span className="hidden sm:inline">{item.completed ? 'Done' : 'Do it'}</span>
              </button>
            ) : item.sourceType === 'url' ? (
              <a 
                href={item.source} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
              >
                <ExternalLink size={16} />
              </a>
            ) : (
              <div className="text-slate-600 p-1">
                <Type size={16}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
