import { RefreshCcw } from 'lucide-react';

export default function Replacements() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* 1. Header Row */}
      <div className="flex items-center gap-3 px-1">
        <RefreshCcw className="text-pink-500" size={18} strokeWidth={2.5} />
        <span className="text-slate-700 font-semibold">Replacements</span>
        <span className="px-2 py-0.5 rounded-md bg-pink-100/50 text-pink-500 font-semibold text-[10px] uppercase tracking-wider">
          View Only
        </span>
      </div>

      {/* 2. Empty State area */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        
        {/* Box Header */}
        <div className="px-6 py-4 bg-pink-50/30 border-b border-pink-50">
          <span className="text-sm font-semibold text-slate-700">Replacement History</span>
        </div>

        {/* Empty State Body */}
        <div className="min-h-[120px] flex items-center justify-center p-6">
          <p className="text-slate-400 font-medium text-sm">No replacements yet</p>
        </div>
        
      </div>

    </div>
  );
}
