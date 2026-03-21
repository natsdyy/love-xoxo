import { 
  CheckCircle2, 
  Lock, 
  ArchiveRestore, 
  FileText, 
  Search 
} from 'lucide-react';

export default function Sold() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Left Side: Stats and Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="text-emerald-500" size={18} strokeWidth={2.5} />
              <span className="text-slate-500 font-medium">Approved Sales:</span>
              <span className="font-bold text-emerald-600">0</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Total:</span>
              <span className="font-bold text-pink-600">₱0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
            <Lock size={12} className="text-amber-500" />
            <span>All sales are permanently preserved for historical records</span>
          </div>
        </div>

        {/* Right Side: Actions and Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Action Buttons */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 font-semibold text-xs transition-colors">
            <ArchiveRestore size={14} strokeWidth={2.5} />
            Bulk Recover
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-500 bg-blue-50/50 hover:bg-blue-50 font-semibold text-xs transition-colors">
            <FileText size={14} strokeWidth={2.5} />
            Manual Recover
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 font-semibold text-xs transition-colors">
            <Search size={14} strokeWidth={2.5} />
            Debug Sales
          </button>

          {/* Select dropdowns */}
          <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
          
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-pink-200 bg-pink-50/50 text-slate-600 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer min-w-[120px]">
              <option value="all">All Services</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
               <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/20 cursor-pointer min-w-[110px]">
              <option value="all">All Admins</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
               <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Empty State Area */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm min-h-[160px] flex flex-col items-center justify-center gap-3">
        <CheckCircle2 size={40} strokeWidth={1.5} className="text-slate-300" />
        <p className="text-slate-400 font-medium text-sm">No approved sales yet.</p>
      </div>

    </div>
  );
}
