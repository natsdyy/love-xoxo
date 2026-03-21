import { Clock, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Pending() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Pending Section</h1>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="text-[#ee6996]" size={14} strokeWidth={2.5} />
            <span className="text-slate-500 text-xs font-medium italic">Reserved items waiting for receipt/approval</span>
            <span className="font-bold text-[#ee6996] text-xs ml-1">0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-2 border-pink-50 rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border-2 border-pink-50 rounded-2xl text-gray-400 hover:text-[#ee6996] hover:border-[#ee6996] transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden min-h-[400px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#fff9fb] border-b border-pink-50 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">
          <div className="col-span-2">Service</div>
          <div className="col-span-2 text-center">Email</div>
          <div className="col-span-2 text-center">Buyer</div>
          <div className="col-span-1 text-center">Category</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Reserved By</div>
          <div className="col-span-1 text-center">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Empty State Body */}
        <div className="flex flex-col items-center justify-center p-20 text-center opacity-60">
           <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center mb-4">
              <Clock className="text-[#ee6996]" size={32} />
           </div>
           <p className="text-slate-500 font-bold text-sm">No Pending Reservations Found</p>
           <p className="text-slate-400 text-xs mt-1">Reserved items will appear here before approval</p>
        </div>
      </div>
    </div>
  );
}
