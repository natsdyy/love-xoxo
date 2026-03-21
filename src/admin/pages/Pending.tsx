import { useState } from 'react';
import { Clock, Search, Filter, ExternalLink, User } from 'lucide-react';

interface PendingReservation {
  id: string;
  service: string;
  email: string;
  buyer: string;
  category: string;
  price: string;
  reservedBy: string;
  date: string;
  status: 'Reserved';
}

export default function Pending() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for Admin visibility
  const [reservations] = useState<PendingReservation[]>([
    {
      id: '1',
      service: 'Netflix',
      email: 'premium-gold@xoxo.com',
      buyer: 'Alice Smith',
      category: 'Solo Profile',
      price: '₱149',
      reservedBy: 'Admin Sarah',
      date: '2024-03-21 16:45',
      status: 'Reserved'
    },
    {
      id: '2',
      service: 'Spotify Family',
      email: 'music-lover@xoxo.com',
      buyer: 'Bob Wilson',
      category: 'Shared',
      price: '₱199',
      reservedBy: 'Staff Mark',
      date: '2024-03-21 17:10',
      status: 'Reserved'
    }
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="text-[#ee6996]" size={20} strokeWidth={3} />
              <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Pending Reservations</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">Reserved items not yet finalized in sales</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search reservations..."
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
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reserved By</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <Clock size={32} className="text-gray-400 mb-2" />
                       <p className="text-gray-400 font-medium text-xs italic">No pending reservations</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {res.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{res.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[140px] block">{res.email}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-500">{res.buyer}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-bold text-[#ee6996] uppercase tracking-wider bg-pink-50 px-2.5 py-1 rounded-lg">
                        {res.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-slate-700">{res.price}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <User size={10} />
                        {res.reservedBy}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] text-slate-400 font-medium italic">{res.date}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#ee6996] transition-all border border-transparent shadow-sm">
                          <ExternalLink size={14} />
                       </button>
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
