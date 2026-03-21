import { Monitor } from 'lucide-react';

export default function Monitoring() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* 1. Header Row */}
      <div className="flex items-center gap-2 px-1">
        <Monitor className="text-pink-500" size={20} strokeWidth={2.5} />
        <span className="text-slate-600 font-medium">Stock Monitoring</span>
      </div>

      {/* 2. Empty State */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm min-h-[120px] flex items-center justify-center p-6">
        <p className="text-slate-400 font-medium text-sm">No stocks to monitor</p>
      </div>

    </div>
  );
}
