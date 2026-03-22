import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Trash2, ChevronDown, Tag } from 'lucide-react';
import { subscribeToPrices, addPrice, deletePrice, type PriceItem } from '../../lib/transactionService';
import { toast } from 'react-toastify';

const SERVICES = ['Netflix', 'Disney+', 'HBO Max', 'Apple TV+', 'YouTube Premium', 'Spotify', 'Canva Pro', 'Other'];
const CATEGORIES = ['Solo Profile', 'Shared', 'Duo', 'Family', 'Other'];
const DURATIONS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime'];

const emptyForm = (): Omit<PriceItem, 'id'> => ({
  service: '',
  serviceCategory: 'Entertainment',
  duration: '',
  category: '',
  price: 0,
});

const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';
const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

export default function Price() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPrices((fetched) => {
      setPrices(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFormChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.service || !form.duration || !form.category || form.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addPrice(form as PriceItem);
      toast.success('Price added successfully');
      setForm(emptyForm());
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add price');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('Delete this price entry?')) return;
    try {
      await deletePrice(id);
      toast.success('Price removed');
    } catch (error) {
      toast.error('Failed to remove price');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden mb-6">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight flex items-center gap-2">
              <Tag className="text-[#ee6996]" size={20} />
              Price Entries
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium italic">Standard pricing for all digital services</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Add Price
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
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Last Updated</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#ee6996]">
                       <Loader2 size={32} className="animate-spin mb-4" />
                       <p className="text-sm font-bold uppercase tracking-widest opacity-40">Fetching prices...</p>
                    </div>
                  </td>
                </tr>
              ) : prices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium text-sm italic opacity-40">
                    No price entries recorded
                  </td>
                </tr>
              ) : (
                prices.map((p) => (
                  <tr key={p.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {p.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{p.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-pink-50 truncate block">
                        {p.duration}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-[10px] font-bold text-[#ee6996] uppercase tracking-wider bg-pink-50 px-2.5 py-1 rounded-lg truncate">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <span className="text-sm font-black text-slate-700">₱{p.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        {p.date?.toDate ? p.date.toDate().toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                         onClick={() => handleDelete(p.id)}
                         className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                         title="Delete Price"
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

      {/* Add Price Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 pt-10 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Add Price Entry</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-10 py-6 space-y-6 max-h-[65vh] overflow-y-auto">
              
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

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₱)</label>
                <input 
                  type="number" 
                  value={form.price}
                  onChange={e => handleFormChange('price', parseFloat(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting || !form.service || form.price <= 0}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] disabled:opacity-40 text-white py-4.5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} strokeWidth={3} />}
                Add Price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
