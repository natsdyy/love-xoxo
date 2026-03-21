import { useState } from 'react';
import { Package, ShoppingCart, Eye, Check, Clock, Upload, ChevronRight } from 'lucide-react';

interface AvailableStock {
  id: string;
  service: string;
  category: string;
  qty: number;
  price: string;
}

export default function StockPanel() {
  const [saleStatus, setSaleStatus] = useState<'SOLD' | 'RESERVED'>('SOLD');
  
  // Dummy data for visibility
  const [availableStocks] = useState<AvailableStock[]>([
    { id: '1', service: 'Netflix', category: 'Solo Profile', qty: 12, price: '₱149' },
    { id: '2', service: 'Disney+', category: 'Shared', qty: 5, price: '₱2,490' },
    { id: '3', service: 'Canva Pro', category: 'Solo Profile', qty: 28, price: '₱499' },
  ]);

  const [recentTransactions] = useState([
    { id: '1', buyer: 'Juan D.', service: 'Netflix', status: 'SOLD', date: '2 mins ago', price: '₱149' },
    { id: '2', buyer: 'Maria C.', service: 'Canva Pro', status: 'RESERVED', date: '15 mins ago', price: '₱499' },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. Stock Availability Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-[#4a1d4a]">Stock Availability</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableStocks.map((stock) => (
              <div key={stock.id} className="bg-pink-50/30 rounded-2xl p-4 border border-pink-50 flex items-center justify-between group hover:bg-pink-50 transition-colors cursor-pointer">
                <div>
                  <p className="text-[10px] font-black text-[#ee6996] uppercase tracking-widest mb-1">{stock.service}</p>
                  <p className="text-sm font-bold text-slate-700">{stock.qty} items left</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-[#ee6996]" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-8 py-5 bg-[#fff9fb] border-t border-pink-50 flex justify-between items-center transition-all">
          <span className="text-xs font-black text-[#ee6996] uppercase tracking-widest">Total Available Stock</span>
          <span className="text-sm font-black text-slate-700">
            {availableStocks.reduce((acc, curr) => acc + curr.qty, 0)} items
          </span>
        </div>
      </div>

      {/* 2. Sell Stock Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[#4a1d4a]">Sell Stock</h2>
        </div>

        <form className="space-y-6">
          {/* Select Stock */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Stock Email</label>
            <select className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] bg-white text-sm font-bold text-slate-700 appearance-none cursor-pointer shadow-sm">
              <option value="" disabled selected>Select stock...</option>
              {availableStocks.map(stock => (
                <option key={stock.id} value={stock.id}>{stock.service} - {stock.category} ({stock.price})</option>
              ))}
            </select>
          </div>

          {/* Sale Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sale Status</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSaleStatus('SOLD')}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl border-2 font-black text-xs tracking-widest uppercase transition-all shadow-sm ${
                  saleStatus === 'SOLD' 
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-600' 
                  : 'border-pink-50 bg-white text-slate-400 grayscale'
                }`}
              >
                <Check size={16} strokeWidth={4} />
                SOLD
              </button>
              <button
                type="button"
                onClick={() => setSaleStatus('RESERVED')}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl border-2 font-black text-xs tracking-widest uppercase transition-all shadow-sm ${
                  saleStatus === 'RESERVED' 
                  ? 'border-blue-400 bg-blue-50 text-blue-600' 
                  : 'border-pink-50 bg-white text-slate-400'
                }`}
              >
                <Clock size={16} strokeWidth={3} />
                RESERVED
              </button>
            </div>
          </div>

          {/* Buyer Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Buyer Name / Username <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter buyer's username or name"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] placeholder-slate-300 text-sm font-bold text-slate-700 shadow-sm"
            />
          </div>

          {/* Bulk Order Quantity */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Bulk Order Quantity <span className="font-medium text-slate-300 lowercase">(optional)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 5"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] placeholder-slate-300 text-sm font-bold text-slate-700 shadow-sm"
            />
          </div>

          {/* Receipt / Screenshot */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Receipt / Screenshot <span className="text-pink-400">*</span>
            </label>
            
            <div className="w-full border-2 border-dashed border-pink-100 rounded-2xl p-8 hover:bg-pink-50/50 transition-colors cursor-pointer group flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-pink-50 flex items-center justify-center text-[#ee6996] shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">Click to upload receipt</p>
                <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              className="w-full md:w-auto px-10 py-4 rounded-2xl bg-[#ee6996] hover:bg-[#d55a84] text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-pink-200 active:scale-95"
            >
              Submit Sale
            </button>
          </div>
        </form>
      </div>

      {/* 3. Recent Transactions Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
            <Eye size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[#4a1d4a]">Your Recent Transactions</h2>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-pink-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-pink-50 flex items-center justify-center text-[#ee6996] font-bold text-xs ring-2 ring-pink-50">
                  {tx.service.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{tx.buyer}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{tx.service} • {tx.price}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  tx.status === 'SOLD' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {tx.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 italic">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

