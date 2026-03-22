import { useState } from 'react';
import { Plus, X, Calendar, Edit2, Trash2, Save, ChevronDown, Minus } from 'lucide-react';

interface CapitalEntry {
  id: string;
  service: string;
  category: string;
  duration: string;
  price: number;
  date: string;
}

const SERVICES = ['Netflix', 'Disney+', 'HBO Max', 'Apple TV+', 'YouTube Premium', 'Spotify', 'Canva Pro', 'Other'];
const CATEGORIES = ['Solo Profile', 'Shared', 'Duo', 'Family', 'Other'];
const DURATIONS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime'];

const today = new Date().toISOString().split('T')[0];

const emptyForm = () => ({
  service: '',
  category: '',
  duration: '',
  price: 0,
  date: today,
});

export default function Capital() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState<CapitalEntry[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [editingEntry, setEditingEntry] = useState<CapitalEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Form helpers ───────────────────────────────────────────
  const handleFormChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.service || !form.category || !form.duration || !form.date) return;
    const newEntry: CapitalEntry = {
      id: Date.now().toString(),
      ...form,
    };
    setEntries(prev => [...prev, newEntry]);
    setForm(emptyForm());
    setIsModalOpen(false);
  };

  // ── Edit helpers ───────────────────────────────────────────
  const handleEditOpen = (entry: CapitalEntry) => setEditingEntry({ ...entry });

  const handleEditChange = (field: string, value: string | number) => {
    if (!editingEntry) return;
    setEditingEntry(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleEditSave = () => {
    if (!editingEntry) return;
    setEntries(prev => prev.map(e => e.id === editingEntry.id ? editingEntry : e));
    setEditingEntry(null);
  };

  // ── Delete helpers ─────────────────────────────────────────
  const handleDelete = () => {
    setEntries(prev => prev.filter(e => e.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const entryToDelete = entries.find(e => e.id === deleteConfirmId);

  // ── Totals ─────────────────────────────────────────────────
  const totalCapital = entries.reduce((sum, e) => sum + e.price, 0);

  const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';

  const FormFields = ({ values, onChange }: {
    values: typeof form;
    onChange: (field: string, value: string | number) => void;
  }) => (
    <div className="space-y-5">
      {/* Service */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Service</label>
        <div className="relative">
          <select value={values.service} onChange={e => onChange('service', e.target.value)} className={`${inputCls} appearance-none cursor-pointer pr-10 ${values.service ? 'text-gray-700' : 'text-gray-400'}`}>
            <option value="">Select service</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
        <div className="relative">
          <select value={values.category} onChange={e => onChange('category', e.target.value)} className={`${inputCls} appearance-none cursor-pointer pr-10 ${values.category ? 'text-gray-700' : 'text-gray-400'}`}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
        <div className="relative">
          <select value={values.duration} onChange={e => onChange('duration', e.target.value)} className={`${inputCls} appearance-none cursor-pointer pr-10 ${values.duration ? 'text-gray-700' : 'text-gray-400'}`}>
            <option value="">Select duration</option>
            {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₱)</label>
        <div className="relative flex items-center">
          <input
            type="number"
            min={0}
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
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
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

  return (
    <div className="p-6">

      {/* ── Delete confirm modal ───────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden">
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
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Edit Capital Entry</h2>
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
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden mb-6">
        {/* Header */}
        <div className="px-8 py-6 border-b border-pink-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Capital Entries</h1>
            {entries.length > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">
                Total: <span className="font-black text-[#ee6996]">₱{totalCapital.toLocaleString()}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Add Capital
          </button>
        </div>

        {/* Content */}
        {entries.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <p className="text-[#ee6996] font-bold text-sm opacity-40">No capital entries</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff9fb] border-b border-pink-50">
                  <th className="px-8 py-4 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Price</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-pink-50/10 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-black text-[10px]">
                          {entry.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{entry.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-[#ee6996] uppercase tracking-wider">{entry.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{entry.duration}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-slate-700">₱{entry.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-medium">{entry.date}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditOpen(entry)} className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(entry.id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Total footer row */}
              <tfoot>
                <tr className="bg-pink-50/30 border-t-2 border-pink-100">
                  <td colSpan={3} className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Capital</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-base font-black text-[#ee6996]">₱{totalCapital.toLocaleString()}</span>
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
            <div className="px-10 pt-8 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Add Capital Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="px-10 py-4 max-h-[65vh] overflow-y-auto">
              <FormFields values={form} onChange={handleFormChange} />
            </div>
            <div className="px-10 pb-8 pt-4">
              <button
                onClick={handleSubmit}
                disabled={!form.service || !form.category || !form.duration || !form.date}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
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
