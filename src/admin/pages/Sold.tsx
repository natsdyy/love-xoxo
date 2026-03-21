import { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  ExternalLink, 
  User,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface SoldTransaction {
  id: string;
  service: string;
  email: string;
  buyer: string;
  category: string;
  price: string;
  soldBy: string;
  date: string;
  status: 'Approved';
}

export default function Sold() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for Admin visibility
  const [transactions] = useState<SoldTransaction[]>([
    {
      id: '1',
      service: 'Netflix Premium',
      email: 'juan.d@gmail.com',
      buyer: 'Juan Dela Cruz',
      category: 'Solo Profile',
      price: '₱149',
      soldBy: 'Admin Sarah',
      date: '2024-03-21 14:30',
      status: 'Approved'
    },
    {
      id: '2',
      service: 'Canva Pro',
      email: 'm.clara@outlook.com',
      buyer: 'Maria Clara',
      category: 'Shared',
      price: '₱499',
      soldBy: 'Staff Mark',
      date: '2024-03-21 15:45',
      status: 'Approved'
    }
  ]);

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Sales</p>
            <p className="text-2xl font-black text-slate-800">{transactions.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black text-slate-800">₱648</p>
          </div>
        </div>

        <div className="bg-[#ee6996] rounded-[2rem] p-6 shadow-lg shadow-pink-100 flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Top Seller</p>
            <p className="text-lg font-bold">Admin Sarah</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Sales History</h1>
            <p className="text-xs text-slate-500 font-medium italic">Permanently preserved historical records</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm font-medium"
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
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Sold By</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-medium text-xs italic">No transactions found</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-pink-50/10 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {tx.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{tx.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500">{tx.email}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-700">{tx.buyer}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-bold text-[#ee6996] bg-pink-50 px-2 py-1 rounded-lg uppercase">{tx.category}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-slate-800">{tx.price}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        <User size={10} />
                        {tx.soldBy}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] text-slate-400 font-medium">{tx.date}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 hover:bg-white rounded-xl text-[#ee6996] transition-all border border-pink-50 shadow-sm">
                          <ExternalLink size={14} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-8 py-5 bg-[#fff9fb] border-t border-pink-50 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 1 to {transactions.length} of {transactions.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-white border border-pink-100 flex items-center justify-center text-[#ee6996] shadow-sm disabled:opacity-50" disabled>
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-[#ee6996] flex items-center justify-center text-white font-bold text-xs">1</div>
            <button className="w-8 h-8 rounded-lg bg-white border border-pink-100 flex items-center justify-center text-[#ee6996] shadow-sm disabled:opacity-50" disabled>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
