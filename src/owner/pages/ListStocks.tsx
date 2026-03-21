import { useState } from 'react';
import { Search, LayoutGrid, List as ListIcon, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface StockEntry {
  id: string;
  service: string;
  duration: string;
  email: string;
  password: string;
  category: string;
  devices: string;
  price: string;
  qty: number;
  dateTime: string;
  serviceCategory: string;
}

export default function ListStocks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Dummy data for visualization
  const [stocks] = useState<StockEntry[]>([
    {
      id: '1',
      service: 'Netflix',
      duration: '1 Month',
      email: 'netflix-user1@xoxo.com',
      password: 'password123',
      category: 'Solo Profile',
      devices: '1 Device',
      price: '₱149',
      qty: 5,
      dateTime: '2024-03-21 14:30',
      serviceCategory: 'Entertainment'
    },
    {
      id: '2',
      service: 'Disney+',
      duration: '12 Months',
      email: 'disney-premium@xoxo.com',
      password: 'disney-pass-456',
      category: 'Shared',
      devices: '4 Devices',
      price: '₱2,490',
      qty: 2,
      dateTime: '2024-03-21 15:00',
      serviceCategory: 'Entertainment'
    },
    {
      id: '3',
      service: 'Canva Pro',
      duration: 'Lifetime',
      email: 'design-pro@xoxo.com',
      password: 'canva-life-top',
      category: 'Solo Profile',
      devices: 'Unlimited',
      price: '₱499',
      qty: 15,
      dateTime: '2024-03-21 10:15',
      serviceCategory: 'Editing'
    }
  ]);

  const categories = ['Entertainment', 'Educational', 'Editing', 'Other Services'];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">List of Stocks</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium italic">Manage and organize your service inventory</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
            />
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border-2 border-pink-50 shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-pink-50 text-[#ee6996]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-pink-50 text-[#ee6996]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#ee6996] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-200/50 hover:bg-[#d95d85] transition-all">
            <Plus size={16} strokeWidth={3} />
            Add Manual
          </button>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-1.5 h-6 bg-[#ee6996] rounded-full" />
            <h2 className="text-lg font-bold text-gray-700 tracking-tight uppercase text-[12px] tracking-widest opacity-80">{cat}</h2>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fff9fb] border-b border-pink-50">
                      <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Duration</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Credentials</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Category</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Qty</th>
                      <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    {stocks.filter(s => s.serviceCategory === cat).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <ExternalLink size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-400 font-medium text-xs italic">No entries in {cat}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      stocks.filter(s => s.serviceCategory === cat).map((stock) => (
                        <tr key={stock.id} className="hover:bg-pink-50/10 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                                {stock.service.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700 text-sm">{stock.service}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{stock.duration}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-700">{stock.email}</p>
                              <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{stock.password}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-bold text-[#ee6996] uppercase tracking-wider">{stock.category}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-sm font-black text-slate-700">{stock.price}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs ring-1 ring-slate-100">
                              {stock.qty}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100 shadow-sm">
                                <Edit2 size={14} />
                              </button>
                              <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 shadow-sm">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                 {stocks.filter(s => s.serviceCategory === cat).length === 0 ? (
                   <div className="col-span-full py-10 text-center opacity-30">
                      <p className="text-gray-400 font-medium text-xs italic">No entries in {cat}</p>
                   </div>
                 ) : (
                   stocks.filter(s => s.serviceCategory === cat).map((stock) => (
                     <div key={stock.id} className="bg-[#fff9fb]/50 border-2 border-pink-50 rounded-3xl p-6 hover:shadow-lg hover:shadow-pink-100/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/20 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                        
                        <div className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-lg shadow-sm">
                                {stock.service.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800">{stock.service}</h3>
                                <span className="text-[10px] font-bold text-[#ee6996] uppercase tracking-wider">{stock.category}</span>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <button className="p-2 bg-white rounded-xl text-slate-400 hover:text-blue-500 shadow-sm border border-pink-50 transition-all">
                                <Edit2 size={14} />
                              </button>
                              <button className="p-2 bg-white rounded-xl text-slate-400 hover:text-red-500 shadow-sm border border-pink-50 transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
  
                          <div className="space-y-4">
                            <div className="bg-white/60 rounded-2xl p-4 border border-pink-50/50">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Inventory Details</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[10px] text-slate-400 mb-0.5">Duration</p>
                                  <p className="text-xs font-bold text-slate-700">{stock.duration}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 mb-0.5">Quantity</p>
                                  <p className="text-xs font-bold text-slate-700">{stock.qty} pcs</p>
                                </div>
                              </div>
                            </div>
  
                            <div className="bg-white/60 rounded-2xl p-4 border border-pink-50/50">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Credentials</p>
                              <p className="text-xs font-bold text-slate-700 truncate">{stock.email}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">{stock.password}</p>
                            </div>
  
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xl font-black text-[#ee6996]">{stock.price}</span>
                              <span className="text-[10px] font-medium text-slate-400 italic">{stock.dateTime}</span>
                            </div>
                          </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
