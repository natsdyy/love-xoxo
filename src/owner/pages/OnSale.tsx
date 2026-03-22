import { useState, useEffect } from 'react';
import { Plus, X, Tag, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { subscribeToDiscounts, addDiscount, deleteDiscount, type Discount } from '../../lib/transactionService';
import { toast } from 'react-toastify';

const SERVICES = ['Netflix', 'Disney+', 'HBO Max', 'Apple TV+', 'YouTube Premium', 'Spotify', 'Canva Pro', 'Other'];
const CATEGORIES = ['Solo Profile', 'Shared', 'Duo', 'Family', 'Other'];
const DURATIONS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime'];

const emptyForm = (): Omit<Discount, 'id'> => ({
  service: '',
  serviceCategory: 'Entertainment',
  duration: '',
  category: '',
  originalPrice: 0,
  discountPercentage: 0,
  discountedPrice: 0,
});

const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';
const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

export default function OnSale() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToDiscounts((fetched) => {
      setDiscounts(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFormChange = (field: string, value: string | number) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'originalPrice' || field === 'discountPercentage') {
        const orig = field === 'originalPrice' ? (value as number) : prev.originalPrice;
        const perc = field === 'discountPercentage' ? (value as number) : prev.discountPercentage;
        updated.discountedPrice = orig - (orig * (perc / 100));
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.service || !form.duration || !form.category || form.originalPrice <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addDiscount(form as Discount);
      toast.success('Discount added successfully');
      setForm(emptyForm());
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add discount');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('Delete this discount?')) return;
    try {
      await deleteDiscount(id);
      toast.success('Discount removed');
    } catch (error) {
      toast.error('Failed to remove discount');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-pink-50">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight flex items-center gap-2">
              <Tag className="text-[#ee6996]" size={20} />
              On Sale / Discounts
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium italic">Manage promotional pricing for services</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Add Discount
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Duration</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Original Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Discount</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Sale Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#ee6996]">
                       <Loader2 size={32} className="animate-spin mb-4" />
                       <p className="text-sm font-bold uppercase tracking-widest opacity-40">Fetching discounts...</p>
                    </div>
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                       <Tag size={40} className="text-pink-300 mb-2" />
                       <p className="text-gray-400 font-medium text-sm italic">No active discounts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {d.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{d.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-pink-50 truncate block">
                        {d.duration}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-[10px] font-bold text-[#ee6996] uppercase tracking-wider bg-pink-50 px-2 rounded-lg truncate">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-slate-400 line-through text-xs italic">
                      ₱{d.originalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-1 rounded-full border border-red-100">
                        -{d.discountPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-sm font-black text-slate-700">₱{d.discountedPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                         onClick={() => handleDelete(d.id)}
                         className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                         title="Delete Discount"
                       >
                          <Trash2 size={13} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Discount Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 pt-10 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Add Discount</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-10 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
              
              {/* Service */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Service</label>
                <div className="relative">
                  <select 
                    value={form.service}
                    onChange={e => handleFormChange('service', e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                <div className="relative">
                  <select 
                    value={form.duration}
                    onChange={e => handleFormChange('duration', e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select duration</option>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <div className="relative">
                  <select 
                    value={form.category}
                    onChange={e => handleFormChange('category', e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Prices grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Original Price (₱)</label>
                    <input 
                      type="number" 
                      value={form.originalPrice}
                      onChange={e => handleFormChange('originalPrice', parseFloat(e.target.value) || 0)}
                      className={inputCls}
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Discount (%)</label>
                    <input 
                      type="number" 
                      value={form.discountPercentage}
                      onChange={e => handleFormChange('discountPercentage', parseFloat(e.target.value) || 0)}
                      className={inputCls}
                    />
                 </div>
              </div>

              {/* Discounted Price result */}
              <div className="p-4 bg-pink-50/30 rounded-2xl border-2 border-pink-100/50 flex items-center justify-between">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Price Result</p>
                 <p className="text-xl font-black text-[#ee6996]">₱{form.discountedPrice.toLocaleString()}</p>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting || !form.service || form.originalPrice <= 0}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] disabled:opacity-40 text-white py-4.5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Tag size={20} />}
                Add Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
