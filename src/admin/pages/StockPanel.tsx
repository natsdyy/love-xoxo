import { Package, ShoppingCart, Eye, Check, Clock, Upload } from 'lucide-react';

export default function StockPanel() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Stock Availability Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Package className="text-pink-600" size={24} />
            <h2 className="text-xl font-semibold text-slate-800">Stock Availability</h2>
          </div>
          
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-400 font-medium">No stocks available right now</p>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Total Available Stock</span>
          <span className="text-sm font-semibold text-pink-600">0 items</span>
        </div>
      </div>

      {/* 2. Sell Stock Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="text-pink-600" size={24} />
          <h2 className="text-xl font-semibold text-slate-800">Sell Stock</h2>
        </div>

        <form className="space-y-6">
          {/* Select Stock */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Select Stock Email</label>
            <select className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-600 bg-white appearance-none cursor-pointer">
              <option value="" disabled selected>Select stock...</option>
            </select>
          </div>

          {/* Sale Status */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Sale Status</label>
            <div className="flex gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-600 font-bold text-sm transition-colors"
              >
                <Check size={16} strokeWidth={3} />
                SOLD
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                <Clock size={16} strokeWidth={2} />
                RESERVED
              </button>
            </div>
          </div>

          {/* Buyer Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">
              Buyer Name / Username <span className="text-slate-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter buyer's username or name"
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 placeholder-slate-400 text-slate-700"
            />
          </div>

          {/* Bulk Order Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">
              Bulk Order Quantity <span className="font-normal text-slate-400">(optional, only for bulk orders)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 5"
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 placeholder-slate-400 text-slate-700"
            />
          </div>

          {/* Receipt / Screenshot */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">
              Receipt / Screenshot * <span className="font-normal text-slate-400">(required)</span>
            </label>
            
            <div className="w-full border-2 border-dashed border-pink-200 rounded-2xl p-8 hover:bg-pink-50/50 transition-colors cursor-pointer group flex flex-col items-center justify-center gap-2">
              <Upload className="text-pink-500 mb-2 group-hover:-translate-y-1 transition-transform" size={32} />
              <p className="text-slate-500 font-medium">Click to upload receipt screenshot</p>
              <p className="text-xs text-slate-400">PNG, JPG, JPEG (max 5MB each)</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled
              className="px-8 py-3 rounded-xl bg-[#e3abba] hover:bg-[#d99fac] text-white font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Submit Sale
            </button>
          </div>
        </form>
      </div>

      {/* 3. Recent Transactions Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-8">
          <Eye className="text-pink-600" size={24} />
          <h2 className="text-xl font-semibold text-slate-800">Your Recent Transactions</h2>
        </div>
        
        <div className="flex items-center justify-center py-6">
          <p className="text-slate-400 font-medium">No transactions yet. Sell a stock above to see your history here.</p>
        </div>
      </div>

    </div>
  );
}
