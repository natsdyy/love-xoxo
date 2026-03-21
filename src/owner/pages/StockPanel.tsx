import { ChevronDown } from 'lucide-react';

export default function StockPanel() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-pink-50">
          <h1 className="text-xl font-bold text-slate-800 font-serif">Stock Panel</h1>
        </div>

        {/* Form Body */}
        <div className="p-8 pb-12">
          <div className="space-y-2 max-w-full">
            <label className="text-xs font-bold text-[#ee6996] ml-1">Stock Email</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3.5 text-sm text-slate-500 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                <option>Select email</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
