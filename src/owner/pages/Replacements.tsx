import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

export default function Replacements() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Replacement Section</h1>
          <p className="text-slate-500 text-xs font-medium italic mt-1">Manage stock replacements and account updates</p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#ee6996] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-200 hover:bg-[#d95d85] transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          {showForm ? 'View List' : 'Add Manual'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden max-w-5xl animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="px-10 py-8 border-b border-pink-50 bg-[#fff9fb]">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight">Create Manual Replacement</h2>
          </div>

          {/* Form Body */}
          <div className="px-10 py-8 space-y-8">
            
            {/* Select Sold Stock */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Sold Stock</label>
              <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer text-gray-500">
                <option value="">Select sold stock</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {/* Replacement Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Replacement Email</label>
                <input 
                  type="email" 
                  placeholder="New email"
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Replacement Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Replacement Password</label>
                <input 
                  type="text" 
                  placeholder="New password"
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <input 
                  type="text" 
                  placeholder="Category"
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Remaining Days */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Remaining Days</label>
                <input 
                  type="number" 
                  placeholder="Days remaining"
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Slot (Optional) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slot (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Slot"
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Pin (Optional) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pin (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Pin"
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 pb-2">
              <button 
                onClick={() => setShowForm(false)}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.2rem] font-bold text-sm shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.005] active:scale-[0.995]"
              >
                Process Replacement
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff9fb] border-b border-pink-50">
                  <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Original Stock</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">New Credentials</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Remaining</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Search size={40} className="text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-500 italic">No replacements recorded yet</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
