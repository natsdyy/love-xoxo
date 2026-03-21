import { Search } from 'lucide-react';

export default function Inventory() {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      
      {/* 1. Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="px-5 py-2 rounded-xl bg-[#c05180] text-white font-medium text-sm transition-colors shadow-sm">
          All (0)
        </button>
        <button className="px-5 py-2 rounded-xl bg-white border border-pink-100 text-slate-600 font-medium text-sm hover:bg-pink-50 transition-colors shadow-sm">
          On Stock (0)
        </button>
        <button className="px-5 py-2 rounded-xl bg-white border border-pink-100 text-slate-600 font-medium text-sm hover:bg-pink-50 transition-colors shadow-sm">
          Low Stock (0)
        </button>
        <button className="px-5 py-2 rounded-xl bg-white border border-pink-100 text-slate-600 font-medium text-sm hover:bg-pink-50 transition-colors shadow-sm">
          No Stock (0)
        </button>
      </div>

      {/* 2. Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search email or service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 placeholder-slate-400 text-slate-700 shadow-sm transition-all"
          />
        </div>
        
        <div className="w-full sm:w-auto min-w-[160px]">
          <select className="w-full px-4 py-2.5 rounded-xl border border-pink-100 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 appearance-none cursor-pointer shadow-sm">
            <option value="all">All Services</option>
          </select>
        </div>
      </div>

      {/* 3. Empty State Area */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm min-h-[140px] flex items-center justify-center">
        <p className="text-slate-400 font-medium text-sm pt-[2px]">No stocks found</p>
      </div>

    </div>
  );
}
