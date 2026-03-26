import { useState, useEffect } from 'react';
import { RefreshCcw, Search, CheckCircle2, AlertCircle, Loader2, Plus, X, ChevronDown } from 'lucide-react';
import { subscribeToReplacements, addReplacement, type Replacement } from '../../lib/transactionService';
import { SERVICE_CATEGORIES } from '../../lib/stockService';
import { toast } from 'react-toastify';

const emptyForm = (): Omit<Replacement, 'id'> & { manualFields?: string[] } => ({
  saleId: '',
  service: '',
  serviceCategory: 'entertainment',
  oldEmail: '',
  newEmail: '',
  buyerName: '',
  reason: '',
  processedBy: 'Owner',
  status: 'completed',
  manualFields: [],
});

const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all font-bold text-slate-700';
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

  const toggleManual = (field: string) => {
    const manualFields = form.manualFields || [];
    const isManual = manualFields.includes(field);
    setForm(prev => ({
      ...prev,
      [field]: '',
      manualFields: isManual ? manualFields.filter(f => f !== field) : [...manualFields, field]
    }));
  };

  const handleFormChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

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
      const { manualFields, ...submitData } = form;
      await addReplacement(submitData as Replacement);
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
                className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm font-medium"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-pink-200/50 transition-all active:scale-95"
            >
              <Plus size={14} strokeWidth={3} /> Record New
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service / Category</th>
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
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{rp.service}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{rp.serviceCategory || 'Entertainment'}</span>
                        </div>
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
                        rp.status.toLowerCase() === 'completed' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                      }`}>
                        {rp.status.toLowerCase() === 'completed' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {rp.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                       <span className="text-[10px] text-slate-400 font-medium italic">
                        {rp.createdAt ? (
                          (rp.createdAt.toDate ? rp.createdAt.toDate() : new Date(rp.createdAt)).toLocaleDateString()
                        ) : '—'}
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
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="px-10 pt-10 pb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Record Replacement</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
                  <X size={20}/>
                </button>
             </div>
             
             <div className="px-10 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
                {/* serviceCategory */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category <span className="text-[#ee6996]">*</span></label>
                    <button type="button" onClick={() => toggleManual('serviceCategory')} className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-[#ee6996] transition-colors bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100 shadow-sm">
                      {form.manualFields?.includes('serviceCategory') ? 'List' : 'Type'}
                    </button>
                  </div>
                  {form.manualFields?.includes('serviceCategory') ? (
                    <input type="text" placeholder="Type Category" value={form.serviceCategory} onChange={(e) => handleFormChange('serviceCategory', e.target.value)} className={inputCls} />
                  ) : (
                    <div className="relative">
                      <select value={form.serviceCategory} onChange={e => {
                          const val = e.target.value;
                          handleFormChange('serviceCategory', val);
                          handleFormChange('service', '');
                          if (val === 'other (custom category)') toggleManual('serviceCategory');
                        }} className={selectCls}>
                        <option value="">Select Category</option>
                        <option value="entertainment">entertainment</option>
                        <option value="educational">educational</option>
                        <option value="editing">editing</option>
                        <option value="other services">other services</option>
                        <option value="other (custom category)">other (custom category)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  )}
                </div>

                {/* Service */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Service <span className="text-[#ee6996]">*</span></label>
                    <button type="button" onClick={() => toggleManual('service')} className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-[#ee6996] transition-colors bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100 shadow-sm">
                      {form.manualFields?.includes('service') ? 'List' : 'Type'}
                    </button>
                  </div>
                  {form.manualFields?.includes('service') ? (
                    <input type="text" placeholder="Type Service" value={form.service} onChange={(e) => handleFormChange('service', e.target.value)} className={inputCls} />
                  ) : (
                    <div className="relative">
                      <select value={form.service} onChange={e => {
                          const val = e.target.value;
                          handleFormChange('service', val);
                          if (val === 'other (custom service)') toggleManual('service');
                        }} className={selectCls}>
                        <option value="">Select Service</option>
                        {form.serviceCategory && (SERVICE_CATEGORIES as any)[form.serviceCategory]?.map((s: string) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        <option value="other (custom service)">other (custom service)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Buyer Name</label>
                   <input 
                     type="text" 
                     placeholder="John Doe"
                     value={form.buyerName} 
                     onChange={e => handleFormChange('buyerName', e.target.value)}
                     className={inputCls}
                   />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Old Email</label>
                      <input 
                        type="email" 
                        placeholder="old@email.com"
                        value={form.oldEmail} 
                        onChange={e => handleFormChange('oldEmail', e.target.value)}
                        className={inputCls}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Email</label>
                      <input 
                        type="email" 
                        placeholder="new@email.com"
                        value={form.newEmail} 
                        onChange={e => handleFormChange('newEmail', e.target.value)}
                        className={inputCls}
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Reason (Optional)</label>
                   <textarea 
                     placeholder="e.g., Change password, Account expired"
                     value={form.reason} 
                     onChange={e => handleFormChange('reason', e.target.value)}
                     className={`${inputCls} min-h-[80px] py-3 resize-none`}
                   />
                </div>
             </div>

             <div className="px-10 pb-10 pt-4">
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4.5 rounded-[1.5rem] font-bold text-base shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                   {submitting ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} strokeWidth={3} />}
                   Record Replacement
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
