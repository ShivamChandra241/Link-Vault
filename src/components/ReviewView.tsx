import React from 'react';
import { VaultCard } from './VaultCard';
import { VaultItem } from '../types';
import { differenceInDays, parseISO } from 'date-fns';
import { Clock, Info } from 'lucide-react';

interface ReviewViewProps {
  items: VaultItem[];
}

export const ReviewView: React.FC<ReviewViewProps> = ({ items }) => {
  const reviewItems = items.filter(item => {
    const days = differenceInDays(new Date(), parseISO(item.createdAt));
    return days >= 3 && !item.completed;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Clock className="text-amber-400" /> System Review
          </h2>
          <p className="text-slate-500 mt-1">Items that haven't been processed in over 3 days.</p>
        </div>
      </div>

      {reviewItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewItems.map(item => (
            <VaultCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/20 rounded-3xl border border-slate-800/50 border-dashed">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800">
            <Info size={32} className="text-slate-700" />
          </div>
          <h3 className="text-lg font-bold text-slate-300">All caught up</h3>
          <p className="text-slate-500 text-sm mt-1">No items currently require immediate review.</p>
        </div>
      )}
    </div>
  );
};
