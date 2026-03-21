import { useState } from 'react';
import { Search, Filter, Box, AlertTriangle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  service: string;
  category: string;
  qty: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for Admin visibility
  const [inventory] = useState<InventoryItem[]>([
    { id: '1', service: 'Netflix Premium', category: 'Solo Profile', qty: 12, status: 'In Stock', lastUpdated: '1 hour ago' },
    { id: '2', service: 'Disney+ Shared', category: 'Shared', qty: 3, status: 'Low Stock', lastUpdated: '3 hours ago' },
    { id: '3', service: 'Canva Pro', category: 'Solo Profile', qty: 28, status: 'In Stock', lastUpdated: '30 mins ago' },
    { id: '4', service: 'Spotify Family', category: 'Shared', qty: 0, status: 'Out of Stock', lastUpdated: '1 day ago' },
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Inventory Management</h1>
            <p className="text-xs text-slate-500 font-medium italic">Monitor stock levels and availability across all services</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search inventory..."
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
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Stock Level</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Last Updated</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-pink-50/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
                        <Box size={16} strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{item.service}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-sm font-black ${
                      item.qty === 0 ? 'text-red-500' : 
                      item.qty <= 5 ? 'text-amber-500' : 
                      'text-slate-700'
                    }`}>
                      {item.qty} items
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'In Stock' ? 'bg-green-50 text-green-500' :
                      item.status === 'Low Stock' ? 'bg-amber-50 text-amber-500' :
                      'bg-red-50 text-red-500'
                    }`}>
                      {item.status === 'In Stock' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-[10px] text-slate-400 font-medium italic">{item.lastUpdated}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#ee6996] transition-all border border-transparent hover:border-pink-50 shadow-sm">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-50 shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
