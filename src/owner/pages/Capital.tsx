import { useState } from 'react';
import { Plus, X, Calendar } from 'lucide-react';

interface CapitalEntry {
  id: string;
  service: string;
  category: string;
  duration: string;
  price: string;
  date: string;
}

export default function Capital() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries] = useState<CapitalEntry[]>([]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden mb-6">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-pink-50 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Capital Entries</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Add Capital
          </button>
        </div>

        {/* Content Area */}
        <div className="p-20 flex flex-col items-center justify-center text-center">
            {entries.length === 0 ? (
                <p className="text-[#ee6996] font-bold text-sm">No capital entries</p>
            ) : (
                null // Logic for mapping entries will go here
            )}
        </div>
      </div>

      {/* Entries table or empty state */}

      {/* Add Capital Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-10 pt-8 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Add Capital Entry</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-10 py-6 space-y-6">
              
              {/* Service */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Service</label>
                <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer">
                  <option value="">Select service</option>
                  <option value="netflix">Netflix</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer">
                  <option value="">Select category</option>
                  <option value="solo">Solo</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer">
                  <option value="">Select duration</option>
                  <option value="1month">1 Month</option>
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₱)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                    <button className="text-gray-400 hover:text-pink-500 transition-colors">
                      <Plus size={12} strokeWidth={3} />
                    </button>
                    <button className="text-gray-400 hover:text-pink-500 transition-colors rotate-180">
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5 pb-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    defaultValue="2026-03-21"
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all text-gray-500"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Add Capital
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
