import { useState } from 'react';
import { RefreshCcw, Search, Filter, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReplacementEntry {
  id: string;
  service: string;
  email: string;
  buyer: string;
  reason: string;
  processedBy: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

export default function Replacements() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for Admin visibility
  const [replacements] = useState<ReplacementEntry[]>([
    {
      id: '1',
      service: 'Netflix Premium',
      email: 'old-acc@xoxo.com',
      buyer: 'Juan Dela Cruz',
      reason: 'Incorrect profile',
      processedBy: 'Admin Sarah',
      date: '2024-03-21 09:00',
      status: 'Completed'
    },
    {
      id: '2',
      service: 'Disney+',
      email: 'disney-fix@xoxo.com',
      buyer: 'Maria Clara',
      reason: 'Login failure',
      processedBy: 'Staff Mark',
      date: '2024-03-21 10:30',
      status: 'Processing'
    }
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RefreshCcw className="text-[#ee6996]" size={20} strokeWidth={3} />
              <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Replacement History</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">Track account replacements and fixes</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search replacements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
              />
            </div>
            <button className="p-2.5 bg-pink-50 text-[#ee6996] rounded-xl hover:bg-pink-100 transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Email</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Buyer</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reason</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Processed By</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {replacements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic text-xs">No records found</td>
                </tr>
              ) : (
                replacements.map((rp) => (
                  <tr key={rp.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {rp.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{rp.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500">{rp.email}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-700">{rp.buyer}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs text-slate-400 italic truncate max-w-[120px] mx-auto">"{rp.reason}"</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        <User size={10} />
                        {rp.processedBy}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rp.status === 'Completed' ? 'bg-green-50 text-green-500' : 
                        rp.status === 'Processing' ? 'bg-blue-50 text-blue-500' :
                        'bg-red-50 text-red-500'
                      }`}>
                        {rp.status === 'Completed' ? <CheckCircle2 size={12} /> : 
                         rp.status === 'Processing' ? <Clock size={12} /> :
                         <AlertCircle size={12} />}
                        {rp.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                       <span className="text-[10px] text-slate-400 font-medium italic">{rp.date}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
