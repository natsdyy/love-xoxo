import { RotateCcw } from 'lucide-react';

export default function Refund() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* 1. Header Row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
        <div className="flex items-center gap-2">
          <RotateCcw className="text-red-500" size={20} strokeWidth={2.5} />
          <span className="text-slate-500 font-medium">Refunded items (deducted from sales):</span>
          <span className="font-bold text-red-600">0</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Total Refunded:</span>
          <span className="font-bold text-red-600">₱0</span>
        </div>
      </div>

      {/* 2. Data Table / Empty State */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-3.5 bg-pink-50/30 border-b border-pink-50 text-xs font-semibold text-slate-500">
          <div className="col-span-1">Service</div>
          <div className="col-span-1">Email</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Sold By</div>
          <div className="col-span-1 text-center">Date</div>
          <div className="col-span-1 text-right">Proof</div>
        </div>

        {/* Empty State Body */}
        <div className="min-h-[160px] flex items-center justify-center p-6">
          <p className="text-slate-400 font-medium text-sm">No refunds</p>
        </div>
        
      </div>

    </div>
  );
}
