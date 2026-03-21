import { Percent } from 'lucide-react';

export default function OnSale() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* 1. Header Row */}
      <div className="flex items-center gap-3 px-1">
        <Percent className="text-pink-500" size={20} strokeWidth={2.5} />
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">Active Discounts:</span>
          <span className="font-bold text-slate-700">0</span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-pink-100/50 text-pink-500 font-semibold text-[10px] uppercase tracking-wider">
          View Only
        </span>
      </div>

      {/* 2. Empty State */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm min-h-[120px] flex items-center justify-center p-6">
        <p className="text-slate-400 font-medium text-sm">No discounts yet. Add one to get started.</p>
      </div>

    </div>
  );
}
