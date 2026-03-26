import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Edit2, Trash2, Save, ChevronDown, Minus, Search } from 'lucide-react';
import { subscribeToCapital, addCapital, updateCapital, deleteCapital, type Capital as CapitalEntry } from '../../lib/transactionService';
import { toast } from 'react-toastify';
import { SERVICE_CATEGORIES, DURATIONS, STOCK_CATEGORIES } from '../../lib/stockService';

const today = new Date().toISOString().split('T')[0];

const emptyForm = (): Omit<CapitalEntry, 'id'> => ({
  service: '',
  serviceCategory: '',
  category: '',
  duration: '',
  price: 0,
  date: today,
});

const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';
const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

export default function Capital() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState<CapitalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [editingEntry, setEditingEntry] = useState<CapitalEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [manualFields, setManualFields] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleManual = (field: string) => {
    setManualFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  useEffect(() => {
    const unsubscribe = subscribeToCapital((fetchedCapital) => {
      setEntries(fetchedCapital);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredEntries = entries.filter(e => 
    e.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.serviceCategory && e.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ── Form helpers ───────────────────────────────────────────
  const handleFormChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.service || !form.category || !form.duration || !form.date || !form.serviceCategory) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await addCapital(form);
      toast.success('Capital entry added');
      setForm(emptyForm());
      setManualFields([]);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add capital');
    }
  };

  // ── Edit helpers ───────────────────────────────────────────
  const handleEditOpen = (entry: CapitalEntry) => {
    setEditingEntry({ ...entry });
    setManualFields([]);
  };

  const handleEditChange = (field: string, value: string | number) => {
    if (!editingEntry) return;
    setEditingEntry(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleEditSave = async () => {
    if (!editingEntry || !editingEntry.id) return;
    
    try {
      const { id, ...updates } = editingEntry;
      await updateCapital(id, updates);
      toast.success('Capital entry updated');
      setEditingEntry(null);
    } catch (error) {
      toast.error('Failed to update capital');
    }
  };

  // ── Delete helpers ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await deleteCapital(deleteConfirmId);
      toast.success('Capital entry deleted');
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error('Failed to delete capital');
    }
  };

  const entryToDelete = entries.find(e => e.id === deleteConfirmId);

  // ── Totals ─────────────────────────────────────────────────
  const totalCapital = entries.reduce((sum, e) => sum + e.price, 0);

  const FormFields = ({ values, onChange }: {
    values: Omit<CapitalEntry, 'id'> | CapitalEntry;
    onChange: (field: string, value: string | number) => void;
  }) => {
    const servicesMap: Record<string, string[]> = SERVICE_CATEGORIES;

    return (
      <div className="space-y-4">
        
        {/* Service Category */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category <span className="text-[#ee6996]">*</span></label>
            <button 
              onClick={() => toggleManual('serviceCategory')}
              className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase"
            >
              {manualFields.includes('serviceCategory') ? 'List' : 'Type'}
            </button>
          </div>
          
          {manualFields.includes('serviceCategory') ? (
            <input 
              type="text" 
              placeholder="Enter Category"
              value={values.serviceCategory}
              onChange={e => onChange('serviceCategory', e.target.value)}
              className={inputCls}
            />
          ) : (
            <div className="relative">
              <select 
                value={values.serviceCategory}
                onChange={e => {
                  onChange('serviceCategory', e.target.value);
                  if (e.target.value === 'other (custom category)') {
                    toggleManual('serviceCategory');
                    onChange('service', '');
                  } else {
                    onChange('service', '');
                  }
                }}
                className={`${selectCls} ${values.serviceCategory ? 'text-gray-700' : 'text-gray-400'}`}
              >
                <option value="">Select</option>
                <option value="entertainment">entertainment</option>
                <option value="educational">educational</option>
                <option value="editing">editing</option>
                <option value="other services">other services</option>
                <option value="other (custom category)">other (custom category)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Service */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Service <span className="text-[#ee6996]">*</span></label>
            <button 
              onClick={() => toggleManual('service')}
              className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase"
            >
              {manualFields.includes('service') ? 'List' : 'Type'}
            </button>
          </div>

          {manualFields.includes('service') ? (
            <input 
              type="text" 
              placeholder="Enter Service"
              value={values.service}
              onChange={e => onChange('service', e.target.value)}
              className={inputCls}
            />
          ) : (
            <div className="relative">
              <select 
                value={values.service}
                onChange={e => {
                  onChange('service', e.target.value);
                  if (e.target.value === 'other (custom service)') {
                    toggleManual('service');
                  }
                }}
                className={`${selectCls} ${values.service ? 'text-gray-700' : 'text-gray-400'}`}
              >
                <option value="">Select</option>
                {values.serviceCategory && servicesMap[values.serviceCategory as keyof typeof SERVICE_CATEGORIES]?.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
                {(!values.serviceCategory || values.serviceCategory === 'other (custom category)') && <option value="other (custom service)">other (custom service)</option>}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Duration <span className="text-[#ee6996]">*</span></label>
            <button 
              onClick={() => toggleManual('duration')}
              className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase"
            >
              {manualFields.includes('duration') ? 'List' : 'Type'}
            </button>
          </div>

          {manualFields.includes('duration') ? (
            <input 
              type="text" 
              placeholder="Enter Duration"
              value={values.duration}
              onChange={e => onChange('duration', e.target.value)}
              className={inputCls}
            />
          ) : (
            <div className="relative">
              <select 
                value={values.duration}
                onChange={e => {
                  onChange('duration', e.target.value);
                  if (e.target.value === 'other (custom duration)') {
                    toggleManual('duration');
                  }
                }}
                className={`${selectCls} ${values.duration ? 'text-gray-700' : 'text-gray-400'}`}
              >
                <option value="">Select</option>
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                <option value="other (custom duration)">other (custom duration)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Category (Item Category) */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Item Category <span className="text-[#ee6996]">*</span></label>
            <button 
              onClick={() => toggleManual('category')}
              className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase"
            >
              {manualFields.includes('category') ? 'List' : 'Type'}
            </button>
          </div>

          {manualFields.includes('category') ? (
            <input 
              type="text" 
              placeholder="Enter Category"
              value={values.category}
              onChange={e => onChange('category', e.target.value)}
              className={inputCls}
            />
          ) : (
            <div className="relative">
              <select 
                value={values.category}
                onChange={e => {
                  onChange('category', e.target.value);
                  if (e.target.value === 'other (custom item category)') {
                    toggleManual('category');
                  }
                }}
                className={`${selectCls} ${values.category ? 'text-gray-700' : 'text-gray-400'}`}
              >
                <option value="">Select</option>
                {STOCK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="other (custom item category)">other (custom item category)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₱) <span className="text-[#ee6996]">*</span></label>
          <div className="relative flex items-center">
            <input
              type="number"
              min={0}
              step={0.01}
              value={values.price}
              onChange={e => onChange('price', parseFloat(e.target.value) || 0)}
              className={`${inputCls} pr-16`}
            />
            <div className="absolute right-3 flex flex-col gap-0.5">
              <button type="button" onClick={() => onChange('price', (values.price as number) + 1)} className="p-1 text-gray-400 hover:text-[#ee6996] transition-colors">
                <Plus size={11} strokeWidth={3} />
              </button>
              <button type="button" onClick={() => onChange('price', Math.max(0, (values.price as number) - 1))} className="p-1 text-gray-400 hover:text-[#ee6996] transition-colors">
                <Minus size={11} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date <span className="text-[#ee6996]">*</span></label>
          <div className="relative">
            <input
              type="date"
              value={values.date}
              onChange={e => onChange('date', e.target.value)}
              className={`${inputCls} text-gray-600`}
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Delete confirm modal ───────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white w-full max-sm rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="px-8 py-8 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h2 className="font-black text-slate-800 mb-1">Delete Entry?</h2>
              <p className="text-xs text-slate-400">
                Remove <span className="font-bold text-slate-600">{entryToDelete?.service}</span> capital entry? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 px-8 pb-8">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit modal ─────────────────────────────────── */}
      {editingEntry && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setEditingEntry(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-10 pt-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Edit Capital Entry</h2>
                <p className="text-xs text-slate-400 font-medium italic mt-0.5">Update the details for this entry</p>
              </div>
              <button onClick={() => setEditingEntry(null)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="px-10 py-4 max-h-[65vh] overflow-y-auto">
              <FormFields values={editingEntry} onChange={handleEditChange} />
            </div>
            <div className="px-10 pb-8 pt-4">
              <button
                onClick={handleEditSave}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-base shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main card ──────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden mb-6">
        {/* Header */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Capital Entries</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Record and monitor your capital investments</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search capital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest"
              >
                <Plus size={16} strokeWidth={3} />
                Add Capital
              </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-4 border-pink-100 border-t-[#ee6996] rounded-full animate-spin mb-4"></div>
            <p className="text-[#ee6996] font-bold text-sm opacity-40 uppercase tracking-widest">Loading entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <Plus size={40} className="text-pink-100 mb-4" />
            <p className="text-[#ee6996] font-bold text-sm opacity-40 uppercase tracking-widest">No capital entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff9fb] border-b border-pink-50">
                  <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.1em]">Service</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.1em] text-center">Duration</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.1em] text-center">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.1em] text-center">Price</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.1em] text-center">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.1em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50/50">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-black text-[10px] transition-transform group-hover:scale-110">
                          {entry.service.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm italic">{entry.service}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{entry.serviceCategory}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-pink-50">{entry.duration}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest">{entry.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-slate-700">₱{entry.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[11px] font-bold text-[#ee6996] opacity-60">{entry.date}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleEditOpen(entry)} className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100" title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(entry.id || null)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Total footer row */}
              <tfoot>
                <tr className="bg-pink-50/30 border-t-2 border-pink-100">
                  <td colSpan={3} className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Aggregate Total Capital</td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-lg font-black text-[#ee6996] drop-shadow-sm">₱{totalCapital.toLocaleString()}</span>
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Add modal ──────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-pink-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Add Capital Entry</h2>
                <p className="text-xs text-slate-400 font-medium italic mt-1">Fill in the details for your new capital entry</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="px-10 py-6 max-h-[65vh] overflow-y-auto">
              <FormFields values={form} onChange={handleFormChange} />
            </div>
            <div className="px-10 pb-8 pt-4 border-t border-pink-50">
              <button
                onClick={handleSubmit}
                disabled={!form.service || !form.category || !form.duration || !form.date || !form.serviceCategory}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center"
              >
                Add Capital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
