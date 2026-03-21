import { useState } from 'react';
import { Percent, Tag, Clock, Search, Filter } from 'lucide-react';

interface ActiveDiscount {
  id: string;
  service: string;
  discount: string;
  originalPrice: string;
  salePrice: string;
  expiry: string;
  status: 'Active' | 'Scheduled';
}

export default function OnSale() {
  const [discounts] = useState<ActiveDiscount[]>([
    { id: '1', service: 'Netflix Premium', discount: '20% OFF', originalPrice: '₱149', salePrice: '₱119', expiry: '2 days left', status: 'Active' },
    { id: '2', service: 'Disney+', discount: '₱50 OFF', originalPrice: '₱249', salePrice: '₱199', expiry: '5 days left', status: 'Active' },
    { id: '3', service: 'Canva Pro', discount: 'FLASH SALE', originalPrice: '₱499', salePrice: '₱299', expiry: 'Starts in 1h', status: 'Scheduled' },
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="text-[#ee6996]" size={20} strokeWidth={3} />
              <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Active Promotions</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">Manage discounts and seasonal offers</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search promos..."
                  className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-48 shadow-sm"
                />
              </div>
             <button className="p-2.5 bg-pink-50 text-[#ee6996] rounded-xl hover:bg-pink-100 transition-all shadow-sm">
                <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Grid Area */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((promo) => (
            <div key={promo.id} className="bg-white border-2 border-pink-50/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-pink-100/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                   promo.status === 'Active' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'
                 }`}>
                   {promo.status}
                 </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996] mb-6">
                <Percent size={24} strokeWidth={2.5} />
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-sm font-black text-[#4a1d4a]">{promo.service}</h3>
                <div className="flex items-baseline gap-2">
                   <span className="text-lg font-black text-[#ee6996]">{promo.salePrice}</span>
                   <span className="text-xs text-slate-300 line-through font-bold">{promo.originalPrice}</span>
                </div>
              </div>

              <div className="bg-[#fff9fb] rounded-2xl p-4 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{promo.expiry}</span>
                 </div>
                 <span className="text-[10px] font-black text-[#ee6996] bg-white px-2 py-1 rounded-lg shadow-sm border border-pink-50">
                    {promo.discount}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
