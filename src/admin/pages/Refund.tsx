import { useState } from 'react';
import { RotateCcw, Search, Filter, Image as ImageIcon, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RefundEntry {
  id: string;
  service: string;
  email: string;
  price: string;
  reason: string;
  approvedBy: string;
  date: string;
  status: 'Refunded' | 'Pending';
  receipt?: string;
}

export default function Refund() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for Admin visibility
  const [refunds] = useState<RefundEntry[]>([
    {
      id: '1',
      service: 'Netflix Premium',
      email: 'alex.v@gmail.com',
      price: '₱149',
      reason: 'Incorrect profile type',
      approvedBy: 'Admin Sarah',
      date: '2024-03-21 10:15',
      status: 'Refunded',
      receipt: 'r_01.jpg'
    },
    {
      id: '2',
      service: 'Disney+ Annual',
      email: 'marian.p@yahoo.com',
      price: '₱2,490',
      reason: 'Login issues',
      approvedBy: 'Pending Approval',
      date: '2024-03-21 11:30',
      status: 'Pending'
    }
  ]);

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <RotateCcw size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Refunded</p>
            <p className="text-2xl font-black text-slate-800">₱149</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <AlertCircle size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Requests</p>
            <p className="text-2xl font-black text-slate-800">1</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Refund History</h1>
            <p className="text-xs text-slate-500 font-medium italic">Items deducted from total sales records</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search refunds..."
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
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reason</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Approved By</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic text-xs">No records found</td>
                </tr>
              ) : (
                refunds.map((rf) => (
                  <tr key={rf.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {rf.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{rf.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500">{rf.email}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-[#ee6996]">{rf.price}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs text-slate-400 italic truncate max-w-[120px] mx-auto">"{rf.reason}"</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        <User size={10} />
                        {rf.approvedBy}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rf.status === 'Refunded' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'
                      }`}>
                        {rf.status === 'Refunded' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {rf.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       {rf.receipt ? (
                         <button className="p-2 hover:bg-white rounded-xl text-[#ee6996] transition-all border border-pink-50 shadow-sm">
                            <ImageIcon size={14} />
                         </button>
                       ) : (
                         <span className="text-[10px] text-slate-300 italic">No proof</span>
                       )}
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
