import { Clock } from 'lucide-react';

export default function Pending() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* 1. Header Row */}
      <div className="flex items-center gap-2 px-1">
        <Clock className="text-orange-500" size={20} strokeWidth={2.5} />
        <span className="text-slate-500 font-medium">Reserved items (not counted in sales):</span>
        <span className="font-bold text-orange-500">0</span>
      </div>

      {/* 2. Data Table / Empty State */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-9 gap-4 px-6 py-3.5 bg-pink-50/30 border-b border-pink-50 text-xs font-semibold text-slate-500">
          <div className="col-span-1">Service</div>
          <div className="col-span-1">Email</div>
          <div className="col-span-1">Buyer</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Reserved By</div>
          <div className="col-span-1 text-center">Date</div>
          <div className="col-span-1 text-center">Receipt</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Empty State Body */}
        <div className="min-h-[120px] flex items-center justify-center p-6">
          <p className="text-slate-400 font-medium text-sm">No pending reservations</p>
        </div>
        
      </div>

    </div>
  );
}
