import { useState } from 'react';
import { Plus, X, Monitor, Edit2, Trash2, Save, User, Lock, ChevronDown } from 'lucide-react';

interface Slot {
  buyer: string;
  pin: string;
}

interface MonitoringEntry {
  id: string;
  service: string;
  email: string;
  password: string;
  slots: Slot[];
}

const SERVICES = ['Netflix', 'Disney+', 'HBO Max', 'Apple TV+', 'YouTube Premium', 'Spotify', 'Other'];

const emptyForm = () => ({
  service: '',
  email: '',
  password: '',
  slots: [] as Slot[],
});

export default function Monitoring() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState<MonitoringEntry[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [editingEntry, setEditingEntry] = useState<MonitoringEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Form helpers ──────────────────────────────────────────────
  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSlot = () => {
    setForm(prev => ({ ...prev, slots: [...prev.slots, { buyer: '', pin: '' }] }));
  };

  const handleSlotChange = (index: number, field: 'buyer' | 'pin', value: string) => {
    setForm(prev => {
      const updated = [...prev.slots];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, slots: updated };
    });
  };

  const handleRemoveSlot = (index: number) => {
    setForm(prev => ({ ...prev, slots: prev.slots.filter((_, i) => i !== index) }));
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.service || !form.email || !form.password) return;
    const newEntry: MonitoringEntry = {
      id: Date.now().toString(),
      ...form,
    };
    setEntries(prev => [...prev, newEntry]);
    setForm(emptyForm());
    setIsModalOpen(false);
  };

  // ── Edit ────────────────────────────────────────────────────
  const handleEditOpen = (entry: MonitoringEntry) => {
    setEditingEntry({ ...entry, slots: entry.slots.map(s => ({ ...s })) });
  };

  const handleEditChange = (field: string, value: string) => {
    if (!editingEntry) return;
    setEditingEntry(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleEditSlotChange = (index: number, field: 'buyer' | 'pin', value: string) => {
    if (!editingEntry) return;
    const updated = [...editingEntry.slots];
    updated[index] = { ...updated[index], [field]: value };
    setEditingEntry({ ...editingEntry, slots: updated });
  };

  const handleEditAddSlot = () => {
    if (!editingEntry) return;
    setEditingEntry({ ...editingEntry, slots: [...editingEntry.slots, { buyer: '', pin: '' }] });
  };

  const handleEditRemoveSlot = (index: number) => {
    if (!editingEntry) return;
    setEditingEntry({ ...editingEntry, slots: editingEntry.slots.filter((_, i) => i !== index) });
  };

  const handleEditSave = () => {
    if (!editingEntry) return;
    setEntries(prev => prev.map(e => e.id === editingEntry.id ? editingEntry : e));
    setEditingEntry(null);
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = () => {
    setEntries(prev => prev.filter(e => e.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const entryToDelete = entries.find(e => e.id === deleteConfirmId);

  // ── Shared field styles ──────────────────────────────────────
  const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';

  return (
    <div className="p-6">

      {/* ── Delete confirm modal ───────────────────────────── */}
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
                Remove <span className="font-bold text-slate-600">{entryToDelete?.service}</span> monitoring entry? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 px-8 pb-8">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit modal ─────────────────────────────────────── */}
      {editingEntry && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setEditingEntry(null)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-10 pt-10 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Edit Monitoring Entry</h2>
              <button onClick={() => setEditingEntry(null)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="px-10 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Service</label>
                <select value={editingEntry.service} onChange={e => handleEditChange('service', e.target.value)} className={inputCls}>
                  <option value="">Select service</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" value={editingEntry.email} onChange={e => handleEditChange('email', e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input type="text" value={editingEntry.password} onChange={e => handleEditChange('password', e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slots & Pins with Buyers</label>
                  <button onClick={handleEditAddSlot} className="bg-pink-50 hover:bg-pink-100 text-[#ee6996] px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-[10px] transition-all border border-pink-100">
                    <Plus size={14} /> Add Slot
                  </button>
                </div>
                {editingEntry.slots.length === 0 ? (
                  <div className="border-2 border-dashed border-pink-100 rounded-2xl p-4 text-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">No slots added</p>
                  </div>
                ) : (
                  editingEntry.slots.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input placeholder="Buyer name" value={slot.buyer} onChange={e => handleEditSlotChange(i, 'buyer', e.target.value)} className="flex-1 bg-pink-50/20 border-2 border-pink-100/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ee6996] transition-all" />
                      <input placeholder="PIN" value={slot.pin} onChange={e => handleEditSlotChange(i, 'pin', e.target.value)} className="w-28 bg-pink-50/20 border-2 border-pink-100/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ee6996] transition-all" />
                      <button onClick={() => handleEditRemoveSlot(i)} className="p-2 text-slate-300 hover:text-red-400 transition-all"><X size={15} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="px-10 pb-8 pt-2">
              <button onClick={handleEditSave} className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-base shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
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

      {/* ── Entries list ───────────────────────────────────── */}
      <div className={`bg-white rounded-[2rem] shadow-sm border border-pink-50 ${entries.length === 0 ? 'min-h-[160px] flex items-center justify-center' : 'p-6 space-y-4'}`}>
        {entries.length === 0 ? (
          <div className="text-center py-10 opacity-30">
            <Monitor size={40} className="text-pink-300 mx-auto mb-2" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No monitoring entries</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="border-2 border-pink-50 rounded-[1.5rem] p-5 hover:shadow-md hover:shadow-pink-50 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* Service badge + email */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-black text-sm">
                      {entry.service.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">{entry.service}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <User size={10} className="text-slate-400" />
                        <p className="text-[11px] text-slate-500 font-medium">{entry.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-1.5 mb-3 ml-1">
                    <Lock size={10} className="text-slate-400" />
                    <p className="text-[11px] text-slate-400 font-mono tracking-tight">{entry.password}</p>
                  </div>

                  {/* Slots */}
                  {entry.slots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {entry.slots.map((slot, i) => (
                        <div key={i} className="bg-pink-50/50 rounded-xl px-3 py-2 border border-pink-100/50">
                          <p className="text-[10px] font-black text-[#ee6996] uppercase tracking-wider truncate">{slot.buyer || 'Buyer'}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{slot.pin || '—'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => handleEditOpen(entry)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 shadow-sm border border-pink-50 transition-all" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(entry.id)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm border border-pink-50 transition-all" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add modal ──────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-10 pt-10 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Add Monitoring Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
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
                    className={`${inputCls} appearance-none cursor-pointer pr-10 ${form.service ? 'text-slate-700' : 'text-gray-400'}`}
                  >
                    <option value="">Select service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  placeholder="account@email.com"
                  value={form.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input
                  type="text"
                  placeholder="Account password"
                  value={form.password}
                  onChange={e => handleFormChange('password', e.target.value)}
                  className={`${inputCls} shadow-inner shadow-pink-100 border-[#ee6996]/30`}
                />
              </div>

              {/* Slots */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slots & Pins with Buyers</label>
                  <button onClick={handleAddSlot} className="bg-pink-50 hover:bg-pink-100 text-[#ee6996] px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-[10px] transition-all border border-pink-100">
                    <Plus size={14} /> Add Slot
                  </button>
                </div>

                {form.slots.length === 0 ? (
                  <div className="border-2 border-dashed border-pink-50 rounded-2xl p-4 flex items-center justify-center bg-pink-50/10">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">No slots added</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {form.slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          placeholder="Buyer name"
                          value={slot.buyer}
                          onChange={e => handleSlotChange(i, 'buyer', e.target.value)}
                          className="flex-1 bg-pink-50/20 border-2 border-pink-100/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ee6996] transition-all"
                        />
                        <input
                          placeholder="PIN"
                          value={slot.pin}
                          onChange={e => handleSlotChange(i, 'pin', e.target.value)}
                          className="w-28 bg-pink-50/20 border-2 border-pink-100/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ee6996] transition-all"
                        />
                        <button onClick={() => handleRemoveSlot(i)} className="p-2 text-slate-300 hover:text-red-400 transition-all">
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="px-10 pb-8 pt-2">
              <button
                onClick={handleSubmit}
                disabled={!form.service || !form.email || !form.password}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Add Monitoring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
