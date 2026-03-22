import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Hash, Minus, ChevronDown } from 'lucide-react';

interface SaleItem {
  id: string;
  service: string;
  duration: string;
  category: string;
  devices: string;
  price: string;
  qty: string;
  discount: string;
  manualFields?: string[];
}

// Custom dropdown that uses fixed positioning to escape overflow-y-auto containers
function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select',
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const openDropdown = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen(true);
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={openDropdown}
        className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 text-left flex items-center justify-between"
      >
        <span className={selected ? 'text-slate-700' : 'text-slate-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-pink-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={listRef}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 9999,
          }}
          className="bg-white border border-pink-100 rounded-2xl shadow-xl py-1 max-h-52 overflow-y-auto"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-pink-50 hover:text-[#ee6996] ${
                value === opt.value ? 'text-[#ee6996] bg-pink-50/60' : 'text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export default function Sold() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', service: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }
  ]);

  const addItem = () => {
    const newItem: SaleItem = {
      id: Math.random().toString(36).substr(2, 9),
      service: '',
      duration: '',
      category: '',
      devices: '',
      price: '0',
      qty: '1',
      discount: '0',
      manualFields: []
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleManual = (id: string, field: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const manualFields = item.manualFields || [];
        const isManual = manualFields.includes(field);
        return {
          ...item,
          [field]: '',
          manualFields: isManual
            ? manualFields.filter(f => f !== field)
            : [...manualFields, field]
        };
      }
      return item;
    }));
  };

  const categoryOptions = [
    { label: 'entertainment', value: 'entertainment' },
    { label: 'educational', value: 'educational' },
    { label: 'editing', value: 'editing' },
    { label: 'other services', value: 'other services' },
    { label: 'other (custom category)', value: 'other (custom category)' },
  ];

  const getServiceOptions = (category: string) => {
    const map: Record<string, string[]> = {
      entertainment: ['netflix', 'disney', 'hbo max', 'viu', 'prime video', 'vivaone', 'vivamax', 'loklok basic', 'loklok standard', 'youtube', 'crunchyroll', 'iwanttfc', 'spotify', 'other (custom category)'],
      educational: ['grammarly', 'quizlet', 'quillbot', 'scribd', 'studocu', 'chatgpt', 'ms365', 'gemini ai', 'other (custom category)'],
      editing: ['canva', 'capcut', 'picsart', 'other (custom category)'],
      'other services': ['telegram premium', 'domain making', 'other (custom category)'],
    };
    const list = map[category] || ['other (custom category)'];
    return list.map(s => ({ label: s, value: s }));
  };

  const durationOptions = [
    '1 month', '2 months', '3 months', '4 months', '5 months', '6 months',
    '7 months', '8 months', '9 months', '10 months', '11 months', '1 year',
    'lifetime', 'other (custom category)'
  ].map(d => ({ label: d, value: d }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sold Stocks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-pink-200"
        >
          <Plus size={20} />
          Add Sale
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-pink-50 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400 mb-4">
          <Hash size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">No sales recorded yet</h3>
        <p className="text-gray-500 mt-1 max-w-xs">Click the "Add Sale" button to manually record a new transaction.</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-pink-50">
              <h2 className="text-xl font-bold text-gray-800">Add Manual Sale</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-pink-50 rounded-full text-gray-400 hover:text-pink-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#ee6996] uppercase tracking-wider mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">Admin Username *</label>
                    <div className="relative">
                      <select className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] appearance-none">
                        <option value="">Select admin</option>
                        <option value="admin1">Admin 1</option>
                      </select>
                      <Plus size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">Email (Optional)</label>
                    <input type="text" placeholder="Enter email" className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">Buyer Name (Optional)</label>
                    <input type="text" placeholder="Enter buyer name" className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">Sold Date *</label>
                    <input type="date" defaultValue="2026-03-21" className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996]" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-pink-100">
                  <h3 className="text-sm font-bold text-[#ee6996] uppercase tracking-wider">Items</h3>
                  <button onClick={addItem} className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-all">
                    <Plus size={14} /> Add Another Item
                  </button>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="relative bg-white border-2 border-pink-100/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute -top-3 left-6 bg-white px-3 text-[10px] font-black text-[#ee6996] uppercase tracking-widest border-2 border-pink-100/50 rounded-full">Item #{index + 1}</div>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Minus size={16} />
                      </button>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Category */}
                      <div className="space-y-1.5 col-span-1">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Category *</label>
                          <button
                            type="button"
                            onClick={() => toggleManual(item.id, 'category')}
                            className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase tracking-tighter"
                          >
                            {item.manualFields?.includes('category') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('category') ? (
                          <input
                            type="text"
                            placeholder="Type Category"
                            value={item.category}
                            onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                            className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700"
                          />
                        ) : (
                          <CustomSelect
                            value={item.category}
                            onChange={(val) => {
                              updateItem(item.id, 'category', val);
                              if (val !== 'other (custom category)') {
                                updateItem(item.id, 'service', '');
                              }
                            }}
                            options={categoryOptions}
                          />
                        )}
                        {item.category === 'other (custom category)' && !item.manualFields?.includes('category') && (
                          <button
                            onClick={() => toggleManual(item.id, 'category')}
                            className="w-full mt-2 py-2 bg-[#ee6996] text-white text-[10px] font-bold rounded-xl animate-in fade-in slide-in-from-top-1"
                          >
                            Click here to Type Manual
                          </button>
                        )}
                      </div>

                      {/* Service */}
                      <div className="space-y-1.5 col-span-1">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Service *</label>
                          <button
                            type="button"
                            onClick={() => toggleManual(item.id, 'service')}
                            className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase tracking-tighter"
                          >
                            {item.manualFields?.includes('service') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('service') ? (
                          <input
                            type="text"
                            placeholder="Type Service"
                            value={item.service}
                            onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                            className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700"
                          />
                        ) : (
                          <CustomSelect
                            value={item.service}
                            onChange={(val) => updateItem(item.id, 'service', val)}
                            options={getServiceOptions(item.category)}
                          />
                        )}
                        {item.service === 'other (custom category)' && !item.manualFields?.includes('service') && (
                          <button
                            onClick={() => toggleManual(item.id, 'service')}
                            className="w-full mt-2 py-2 bg-[#ee6996] text-white text-[10px] font-bold rounded-xl animate-in fade-in slide-in-from-top-1"
                          >
                            Click here to Type Manual
                          </button>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Duration *</label>
                          <button
                            type="button"
                            onClick={() => toggleManual(item.id, 'duration')}
                            className="text-[9px] font-black text-pink-500 hover:text-pink-700 uppercase tracking-tighter"
                          >
                            {item.manualFields?.includes('duration') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('duration') ? (
                          <input
                            type="text"
                            placeholder="Type Duration"
                            value={item.duration}
                            onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                            className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700"
                          />
                        ) : (
                          <CustomSelect
                            value={item.duration}
                            onChange={(val) => updateItem(item.id, 'duration', val)}
                            options={durationOptions}
                          />
                        )}
                        {item.duration === 'other (custom category)' && !item.manualFields?.includes('duration') && (
                          <button
                            onClick={() => toggleManual(item.id, 'duration')}
                            className="w-full mt-2 py-2 bg-[#ee6996] text-white text-[10px] font-bold rounded-xl animate-in fade-in slide-in-from-top-1"
                          >
                            Click here to Type Manual
                          </button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Devices *</label>
                        <input type="text" placeholder="e.g., 1" value={item.devices} onChange={(e) => updateItem(item.id, 'devices', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price (₱) *</label>
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all text-emerald-600 font-bold" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Qty *</label>
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Discount (₱)</label>
                        <input type="number" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all text-pink-500 font-bold" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc6797] hover:from-[#d55a84] hover:to-[#e15c87] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-pink-200 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Add Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
