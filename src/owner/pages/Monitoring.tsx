import { useState } from 'react';
import { Plus, X, Monitor } from 'lucide-react';

interface MonitoringEntry {
  id: string;
  service: string;
  email: string;
  password: string;
  slots: { buyer: string; pin: string }[];
}

export default function Monitoring() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries] = useState<MonitoringEntry[]>([]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          Monitoring <span className="text-gray-400 font-medium text-lg">(Entertainment Only)</span>
        </h1>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Monitoring
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 min-h-[160px] flex items-center justify-center">
        {entries.length === 0 ? (
          <div className="text-center py-10 opacity-30">
            <Monitor size={40} className="text-pink-300 mx-auto mb-2" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No monitoring entries</p>
          </div>
        ) : (
          null // Logic for mapping entries will go here
        )}
      </div>

      {/* Add Monitoring Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-10 pt-10 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Add Monitoring Entry</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-10 py-6 space-y-6">
              
              {/* Service */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Service</label>
                <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer text-gray-500">
                  <option value="">Select service</option>
                  <option value="netflix">Netflix</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="text" 
                  className="w-full bg-pink-50/10 border-2 border-[#ee6996]/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-inner shadow-pink-100"
                />
              </div>

              {/* Slots Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slots & Pins with Buyers</label>
                  <button className="bg-pink-50 hover:bg-pink-100 text-[#ee6996] px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-[10px] transition-all border border-pink-100">
                    <Plus size={14} />
                    Add Slot
                  </button>
                </div>
                
                {/* Empty Slots Indicator */}
                <div className="border-2 border-dashed border-pink-50 rounded-2xl p-4 flex items-center justify-center bg-pink-50/10">
                   <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">No slots added</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 pb-4">
                <button className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Add Monitoring
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
