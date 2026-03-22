import { useState } from 'react';
import { Plus, Mail, ChevronDown, X } from 'lucide-react';

interface BulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  caption: string;
  type: 'same' | 'different';
}

function BulkModal({ isOpen, onClose, title, caption, type }: BulkModalProps) {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-pink-50">
        <div className="bg-white px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#ee6996] leading-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-full text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {type === 'same' ? 'Enter slots/profiles (one per line)' : 'Enter emails (one per line)'}
            </label>
            <div className="relative group">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={type === 'same' ? "Slot 1\nSlot 2\nSlot 3" : "email1@example.com\nemail2@example.com\nemail3@example.com"}
                rows={6}
                className="w-full bg-white border-2 border-pink-100 rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all resize-none shadow-sm placeholder:text-slate-200 placeholder:italic"
              />
            </div>
            <p className="text-[10px] font-bold text-[#ee6996] italic ml-1 mt-2">
              {caption}
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-pink-50 text-[#ee6996] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-100 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={!content.trim()}
              className={`flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${
                !content.trim() 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-[#ee6996] to-[#f58eb2] text-white shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              Create Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewStocks() {
  const [modalType, setModalType] = useState<'same' | 'different' | null>(null);
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [slotEntries, setSlotEntries] = useState([
    { id: 1, qty: 1, slot: '', pin: '' },
    { id: 2, qty: 1, slot: '', pin: '' }
  ]);
  const [manualFields, setManualFields] = useState<string[]>([]); // Track manual entry modes

  const toggleManual = (field: string) => {
    setManualFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const addSlotEntry = () => {
    setSlotEntries([
      ...slotEntries,
      { id: Date.now(), qty: 1, slot: '', pin: '' }
    ]);
  };

  const removeSlotEntry = (id: number) => {
    setSlotEntries(slotEntries.filter(entry => entry.id !== id));
  };

  const services: Record<string, string[]> = {
    entertainment: ['netflix', 'disney', 'hbo max', 'viu', 'prime video', 'vivaone', 'vivamax', 'loklok basic', 'loklok standard', 'youtube', 'crunchyroll', 'iwanttfc', 'spotify', 'other (custom category)'],
    educational: ['grammarly', 'quizlet', 'quillbot', 'scribd', 'studocu', 'chatgpt', 'ms365', 'gemini ai', 'other (custom category)'],
    editing: ['canva', 'capcut', 'picsart', 'other (custom category)'],
    'other services': ['telegram premium', 'domain making', 'other (custom category)']
  };

  const durations = [
    '1 month', '2 months', '3 months', '4 months', '5 months', '6 months',
    '7 months', '8 months', '9 months', '10 months', '11 months', '1 year', 'lifetime', 'other (custom category)'
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">Add Stock</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setModalType('same')}
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold border border-pink-100 hover:bg-pink-100 transition-colors"
            >
              <Mail size={14} strokeWidth={2.5} />
              Bulk
            </button>
            <button 
              onClick={() => setModalType('different')}
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold border border-pink-100 hover:bg-pink-100 transition-colors"
            >
              <Mail size={14} strokeWidth={2.5} />
              Bulk (Different)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 space-y-6">
          
          {/* Row 1: Category & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <button 
                  onClick={() => toggleManual('category')}
                  className="text-[10px] font-black text-pink-500 hover:text-pink-700 uppercase"
                >
                  {manualFields.includes('category') ? 'List' : 'Type'}
                </button>
              </div>
              
              {manualFields.includes('category') ? (
                <input 
                  type="text" 
                  placeholder="Enter Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border-2 border-pink-200 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                />
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (e.target.value === 'other (custom category)') {
                          toggleManual('category');
                          setService(''); // Clear service when category changes to custom
                        } else {
                          setService(''); // Clear service when category changes
                        }
                      }}
                      className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    >
                      <option value="">Select category</option>
                      <option value="entertainment">entertainment</option>
                      <option value="educational">educational</option>
                      <option value="editing">editing</option>
                      <option value="other services">other services</option>
                      <option value="other (custom category)">other (custom category)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Service <span className="text-red-500">*</span>
                </label>
                <button 
                  onClick={() => toggleManual('service')}
                  className="text-[10px] font-black text-pink-500 hover:text-pink-700 uppercase"
                >
                  {manualFields.includes('service') ? 'List' : 'Type'}
                </button>
              </div>

              {manualFields.includes('service') ? (
                <input 
                  type="text" 
                  placeholder="Enter Service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border-2 border-pink-200 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                />
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value);
                        if (e.target.value === 'other (custom category)') {
                          toggleManual('service');
                        }
                      }}
                      className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    >
                      <option value="">Select service</option>
                      {category && services[category]?.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {(!category || category === 'other (custom category)') && <option value="other (custom category)">other (custom category)</option>}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Duration & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <button 
                  onClick={() => toggleManual('duration')}
                  className="text-[10px] font-black text-pink-500 hover:text-pink-700 uppercase"
                >
                  {manualFields.includes('duration') ? 'List' : 'Type'}
                </button>
              </div>

              {manualFields.includes('duration') ? (
                <input 
                  type="text" 
                  placeholder="Enter Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white border-2 border-pink-200 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                />
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={duration}
                      onChange={(e) => {
                        setDuration(e.target.value);
                        if (e.target.value === 'other (custom category)') {
                          toggleManual('duration');
                        }
                      }}
                      className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    >
                      <option value="">Select duration</option>
                      {durations.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter email"
                className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
          </div>

          {/* Row 3: Password */}
          <div className="space-y-2 max-w-md">
            <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password" 
              placeholder="Enter password"
              className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Nested Item Section */}
          <div className="bg-pink-50/20 border border-pink-100 rounded-3xl p-6 mt-8">
            <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center text-[10px]">#1</span>
              Item #1
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <button 
                    onClick={() => toggleManual('item_category')}
                    className="text-[10px] font-black text-pink-500 hover:text-pink-700 uppercase"
                  >
                    {manualFields.includes('item_category') ? 'List' : 'Type'}
                  </button>
                </div>
                
                {manualFields.includes('item_category') ? (
                  <input 
                    type="text" 
                    placeholder="Enter Category"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full bg-white border-2 border-pink-200 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <select 
                        value={itemCategory}
                        onChange={(e) => {
                          setItemCategory(e.target.value);
                          if (e.target.value === 'other (custom category)') {
                            toggleManual('item_category');
                          }
                        }}
                        className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                      >
                        <option value="">Select category</option>
                        <option value="solo profile">solo profile</option>
                        <option value="shared">shared</option>
                        <option value="solo account">solo account</option>
                        <option value="invite">invite</option>
                        <option value="individual">individual</option>
                        <option value="famhead">famhead</option>
                        <option value="edu">edu</option>
                        <option value="chichiro">chichiro</option>
                        <option value="haku">haku</option>
                        <option value="howl">howl</option>
                        <option value="other (custom category)">other (custom category)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                    Devices <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., 2"
                    className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                    Price (₱) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="0.00"
                    className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              {/* Slot & Pin Entries */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 ml-1">Slot & Pin Entries</span>
                  <button 
                    onClick={addSlotEntry}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-[#ee6996] rounded-xl text-[10px] font-black uppercase tracking-widest border border-pink-100 hover:bg-pink-100 transition-all shadow-sm"
                  >
                    <Plus size={12} strokeWidth={3} />
                    Add Slot/Pin
                  </button>
                </div>
                
                <div className="space-y-3">
                  {slotEntries.map((entry, index) => (
                    <div key={entry.id} className="flex items-end gap-3 group animate-in slide-in-from-top-1 duration-200">
                      <div className="w-20 space-y-1.5">
                        {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qty</label>}
                        <input 
                          type="number" 
                          defaultValue={entry.qty}
                          className="w-full bg-white border border-pink-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slot</label>}
                        <input 
                          type="text" 
                          placeholder="Slot"
                          className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pin</label>}
                        <input 
                          type="text" 
                          placeholder="Pin"
                          className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => removeSlotEntry(entry.id)}
                        className="p-2.5 mb-0.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add Another Item Button */}
          <button className="w-full py-4 border-2 border-dashed border-pink-100 rounded-2xl text-pink-500 font-bold text-sm bg-pink-50/10 hover:bg-pink-50/30 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} strokeWidth={2.5} />
            Add Another Item
          </button>

          {/* Notes */}
          <div className="space-y-2 mt-4">
            <label className="text-xs font-bold text-slate-700 ml-1">Notes</label>
            <textarea 
              placeholder="Additional notes (optional)"
              rows={3}
              className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button className="w-full py-4 bg-[#ee6996] text-white rounded-2xl font-bold text-base shadow-lg shadow-pink-500/20 hover:bg-[#d95d85] transition-all mt-4">
            Add Stock
          </button>

        </div>
      </div>

      <BulkModal 
        isOpen={modalType === 'same'} 
        onClose={() => setModalType(null)}
        title="Add Bulk Emails (Same Email)"
        caption="Each line creates a new stock item with the same email field"
        type="same"
      />
      
      <BulkModal 
        isOpen={modalType === 'different'} 
        onClose={() => setModalType(null)}
        title="Add Bulk Emails (Different Emails)"
        caption="Each email will be assigned to its own item. Password will be the same for all."
        type="different"
      />
    </div>
  );
}
