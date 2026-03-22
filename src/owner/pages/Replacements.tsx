import { useState, useEffect } from 'react';
import { RefreshCcw, Search, CheckCircle2, AlertCircle, Loader2, Plus, X, ChevronDown } from 'lucide-react';
import { subscribeToReplacements, addReplacement, type Replacement } from '../../lib/transactionService';
import { toast } from 'react-toastify';

const SERVICES = ['Netflix', 'Disney+', 'HBO Max', 'Apple TV+', 'YouTube Premium', 'Spotify', 'Canva Pro', 'Other'];

const emptyForm = (): Omit<Replacement, 'id'> => ({
  saleId: '', // Optional or manual entry for now
  service: '',
  oldEmail: '',
  newEmail: '',
  buyerName: '',
  reason: '',
  processedBy: 'Admin', // Default
  status: 'completed'
});

const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';
const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

export default function Replacements() {
  const [replacements, setReplacements] = useState<Replacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToReplacements((fetched) => {
      setReplacements(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredReplacements = replacements.filter(rp => 
    rp.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rp.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rp.oldEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.service || !form.oldEmail || !form.newEmail || !form.buyerName) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addReplacement(form as Replacement);
      toast.success('Replacement recorded');
      setForm(emptyForm());
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add replacement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RefreshCcw className="text-[#ee6996]" size={20} strokeWidth={3} />
              <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Replacement History</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">Track account replacements and fixes</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search replacements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ee6996] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Emails (Old → New)</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Buyer</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reason</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#ee6996]">
                       <Loader2 size={32} className="animate-spin mb-4" />
                       <p className="text-sm font-bold uppercase tracking-widest opacity-40">Loading history...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReplacements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic text-xs">No records found</td>
                </tr>
              ) : (
                filteredReplacements.map((rp) => (
                  <tr key={rp.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {rp.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{rp.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-medium text-slate-400 line-through truncate max-w-[150px]">{rp.oldEmail}</span>
                        <span className="text-xs font-bold text-[#ee6996] truncate max-w-[150px]">{rp.newEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-700">{rp.buyerName}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs text-slate-400 italic truncate max-w-[120px] mx-auto">"{rp.reason}"</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rp.status === 'completed' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                      }`}>
                        {rp.status === 'completed' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {rp.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                       <span className="text-[10px] text-slate-400 font-medium italic">
                       {rp.createdAt?.toDate ? rp.createdAt.toDate().toLocaleDateString() : '—'}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#4a1d4a]">Record Replacement</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-pink-500"><X size={20}/></button>
             </div>
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service</label>
                   <div className="relative">
                      <select 
                        value={form.service}
                        onChange={e => setForm({...form, service: e.target.value})}
                        className={selectCls}
                      >
                         <option value="">Select service</option>
                         {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buyer Name</label>
                   <input 
                     type="text" 
                     value={form.buyerName} 
                     onChange={e => setForm({...form, buyerName: e.target.value})}
                     className={inputCls}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Old Email</label>
                      <input 
                        type="email" 
                        value={form.oldEmail} 
                        onChange={e => setForm({...form, oldEmail: e.target.value})}
                        className={inputCls}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Email</label>
                      <input 
                        type="email" 
                        value={form.newEmail} 
                        onChange={e => setForm({...form, newEmail: e.target.value})}
                        className={inputCls}
                      />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                   <textarea 
                     value={form.reason} 
                     onChange={e => setForm({...form, reason: e.target.value})}
                     className={`${inputCls} min-h-[80px] py-3`}
                   />
                </div>
             </div>
             <button 
               onClick={handleSubmit} 
               disabled={submitting}
               className="w-full mt-8 bg-[#ee6996] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#d55a84] transition-all shadow-xl shadow-pink-200 flex items-center justify-center gap-2"
             >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                Record Replacement
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
