import { Plus, Mail, ChevronDown } from 'lucide-react';

export default function NewStocks() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">Add Stock</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold border border-pink-100 hover:bg-pink-100 transition-colors">
              <Mail size={14} strokeWidth={2.5} />
              Bulk
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold border border-pink-100 hover:bg-pink-100 transition-colors">
              <Mail size={14} strokeWidth={2.5} />
              Bulk (Different)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 space-y-6">
          
          {/* Row 1: Category & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                  <option>Select</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                Service <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                  <option>Select</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Duration & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                  <option>Select</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter email"
                className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
          </div>

          {/* Row 3: Password */}
          <div className="space-y-2 max-w-md">
            <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              placeholder="Enter password"
              className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Nested Item Section */}
          <div className="bg-pink-50/20 border border-pink-100 rounded-3xl p-6 mt-8">
            <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center text-[10px]">#1</span>
              Item #1
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                    <option>Select category</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                    Devices <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., 2"
                    className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                    Price (₱) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="0.00"
                    className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              {/* Slot & Pin Entries */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 ml-1">Slot & Pin Entries</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-100/50 text-pink-600 rounded-xl text-[10px] font-bold border border-pink-100 hover:bg-pink-100 transition-colors">
                    <Plus size={12} strokeWidth={3} />
                    Add Slot/Pin
                  </button>
                </div>
                <div className="border-2 border-dashed border-pink-100 rounded-2xl p-6 flex items-center justify-center bg-white/50">
                  <p className="text-xs font-bold text-pink-400">Click "Add Slot/Pin" to add slot & pin entries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Another Item Button */}
          <button className="w-full py-4 border-2 border-dashed border-pink-100 rounded-2xl text-pink-500 font-bold text-sm bg-pink-50/10 hover:bg-pink-50/30 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} strokeWidth={2.5} />
            Add Another Item
          </button>

          {/* Notes */}
          <div className="space-y-2 mt-4">
            <label className="text-xs font-bold text-slate-700 ml-1">Notes</label>
            <textarea 
              placeholder="Additional notes (optional)"
              rows={3}
              className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button className="w-full py-4 bg-[#ee6996] text-white rounded-2xl font-bold text-base shadow-lg shadow-pink-500/20 hover:bg-[#d95d85] transition-all mt-4">
            Add Stock
          </button>

        </div>
      </div>
    </div>
  );
}
