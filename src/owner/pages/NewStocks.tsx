import { useState } from 'react';
import { Plus, Mail, ChevronDown, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { addStock, SERVICE_CATEGORIES, DURATIONS, STOCK_CATEGORIES } from '../../lib/stockService';

interface ItemEntry {
  id: number;
  category: string;
  devices: string;
  quantity: string;
  price: string;
  notes: string;
  slotEntries: Array<{ id: number; qty: number; slot: string; pin: string }>;
}

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
  const username = localStorage.getItem('username') || 'unknown';
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState<'same' | 'different' | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Parent fields (shared across all items)
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Multiple items support
  const [items, setItems] = useState<ItemEntry[]>([
    { 
      id: 1, 
      category: '', 
      devices: '1', 
      quantity: '1',
      price: '', 
      notes: '',
      slotEntries: []
    }
  ]);
  const [manualFields, setManualFields] = useState<string[]>([]);

  const toggleManual = (field: string) => {
    setManualFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        category: '',
        devices: '1',
        quantity: '1',
        price: '',
        notes: '',
        slotEntries: []
      }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast.error('You must have at least 1 item', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const addSlotToItem = (itemId: number) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            slotEntries: [...item.slotEntries, { id: Date.now(), qty: 1, slot: '', pin: '' }]
          }
        : item
    ));
  };

  const removeSlotFromItem = (itemId: number, slotId: number) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, slotEntries: item.slotEntries.filter(s => s.id !== slotId) }
        : item
    ));
  };

  const updateSlotEntry = (itemId: number, slotId: number, field: 'qty' | 'slot' | 'pin', value: string | number) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            slotEntries: item.slotEntries.map(s => 
              s.id === slotId 
                ? { ...s, [field]: field === 'qty' ? parseInt(value as string) || 1 : value }
                : s
            )
          }
        : item
    ));
  };

  const updateItem = (id: number, field: keyof Omit<ItemEntry, 'id' | 'slotEntries'>, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !service || !duration || !email || !password) {
      setShowValidation(true);
      toast.error('Please fill in all parent fields (Category, Service, Duration, Email, Password)', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (items.some(item => !item.category || !item.price)) {
      setShowValidation(true);
      toast.error('Please fill in Category and Price for all items', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    setShowValidation(false);
    try {
      let successCount = 0;
      
      // Create a stock entry for each item
      for (const item of items) {
        const slots = item.slotEntries
          .filter(entry => entry.slot && entry.pin)
          .map(entry => ({
            slot: entry.slot,
            pin: entry.pin
          }));

        await addStock({
          service: service,
          serviceCategory: category,
          duration: duration,
          email: email,
          password: password,
          category: item.category,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price),
          devices: [item.devices || '1'],
          ...(slots.length > 0 ? { slots } : {}),
          notes: item.notes,
          status: 'available',
          createdBy: username,
        });
        
        successCount++;
      }

      toast.success(`✅ ${successCount} stock item(s) added and synced!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
      });

      // Reset form
      setCategory('');
      setService('');
      setDuration('');
      setEmail('');
      setPassword('');
      setItems([
        { 
          id: 1, 
          category: '', 
          devices: '1', 
          quantity: '1',
          price: '', 
          notes: '',
          slotEntries: []
        }
      ]);
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('❌ Failed to add stock. Check console for details.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const services: Record<string, string[]> = SERVICE_CATEGORIES;

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
                          setService('');
                        } else {
                          setService('');
                        }
                      }}
                      className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 transition-all ${showValidation && !category ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
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
                        if (e.target.value === 'other (custom service)') {
                          toggleManual('service');
                        }
                      }}
                      className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 transition-all ${showValidation && !service ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                    >
                      <option value="">Select service</option>
                      {category && services[category]?.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {(!category || category === 'other (custom category)') && <option value="other (custom service)">other (custom service)</option>}
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
                  className={`w-full bg-white rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none transition-all ${showValidation && !duration ? 'border-2 border-red-500 focus:border-red-600' : 'border-2 border-pink-200 focus:border-[#ee6996]'}`}
                />
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={duration}
                      onChange={(e) => {
                        setDuration(e.target.value);
                        if (e.target.value === 'other (custom duration)') {
                          toggleManual('duration');
                        }
                      }}
                      className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 transition-all ${showValidation && !duration ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                    >
                      <option value="">Select duration</option>
                      {DURATIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                      <option value="other (custom duration)">other (custom duration)</option>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 transition-all ${showValidation && !email ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
              />
            </div>
          </div>

          {/* Row 3: Password */}
          <div className="space-y-2 max-w-md">
            <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50 rounded-2xl px-4 py-3 pr-12 text-sm text-slate-600 focus:outline-none focus:ring-2 transition-all ${showValidation && !password ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6 mt-8">
            {items.map((item, itemIndex) => (
              <div key={item.id} className="bg-pink-50/20 border border-pink-100 rounded-3xl p-6 animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center text-[10px] font-black">#{itemIndex + 1}</span>
                    Item #{itemIndex + 1}
                  </h3>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Item Category */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button 
                        onClick={() => toggleManual(`item_category_${item.id}`)}
                        className="text-[10px] font-black text-pink-500 hover:text-pink-700 uppercase"
                      >
                        {manualFields.includes(`item_category_${item.id}`) ? 'List' : 'Type'}
                      </button>
                    </div>
                    
                    {manualFields.includes(`item_category_${item.id}`) ? (
                      <input 
                        type="text" 
                        placeholder="Enter Category"
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className={`w-full bg-white rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none transition-all ${showValidation && !item.category ? 'border-2 border-red-500 focus:border-red-600' : 'border-2 border-pink-200 focus:border-[#ee6996]'}`}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <select 
                            value={item.category}
                            onChange={(e) => {
                              updateItem(item.id, 'category', e.target.value);
                              if (e.target.value === 'other') {
                                toggleManual(`item_category_${item.id}`);
                              }
                            }}
                            className={`w-full bg-white rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 transition-all ${showValidation && !item.category ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                          >
                            <option value="">Select category</option>
                            {STOCK_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="other">other (custom category)</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Devices & Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Number of Devices <span className="text-[#ee6996]">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              updateItem(item.id, 'devices', num.toString());
                              if (manualFields.includes(`item_devices_${item.id}`)) {
                                toggleManual(`item_devices_${item.id}`);
                              }
                            }}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border-2 ${
                              item.devices === num.toString() && !manualFields.includes(`item_devices_${item.id}`)
                                ? 'bg-pink-100 border-[#ee6996] text-[#ee6996] shadow-sm shadow-pink-100'
                                : 'bg-white border-pink-50 text-slate-400 hover:border-pink-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            if (!manualFields.includes(`item_devices_${item.id}`)) {
                              toggleManual(`item_devices_${item.id}`);
                              updateItem(item.id, 'devices', '');
                            }
                          }}
                          className={`px-4 h-10 rounded-xl font-bold text-xs transition-all border-2 flex items-center gap-2 ${
                            manualFields.includes(`item_devices_${item.id}`)
                              ? 'bg-pink-100 border-[#ee6996] text-[#ee6996] shadow-sm shadow-pink-100'
                              : 'bg-white border-pink-50 text-slate-400 hover:border-pink-200'
                          }`}
                        >
                          Other
                          {manualFields.includes(`item_devices_${item.id}`) && (
                            <input 
                              type="number"
                              placeholder="0"
                              value={item.devices}
                              onChange={(e) => updateItem(item.id, 'devices', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 bg-transparent border-b border-[#ee6996] text-center focus:outline-none font-black text-[#ee6996]"
                              autoFocus
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 pt-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="number" 
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          className={`w-full bg-white rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 transition-all ${showValidation && !item.quantity ? 'border-2 border-red-500 focus:ring-red-500/20 shadow-inner' : 'border-2 border-pink-50 focus:ring-pink-500/20 focus:border-[#ee6996]'}`}
                        />
                      </div>
                      <div className="space-y-2 pt-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          Price (₱) <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          step="0.01"
                          className={`w-full bg-white rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 transition-all ${showValidation && !item.price ? 'border-2 border-red-500 focus:ring-red-500/20 shadow-inner' : 'border-2 border-pink-50 focus:ring-pink-500/20 focus:border-[#ee6996]'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Slot & Pin Entries */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 ml-1">Slot & Pin Entries</span>
                      <button 
                        onClick={() => addSlotToItem(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-[#ee6996] rounded-xl text-[10px] font-black uppercase tracking-widest border border-pink-100 hover:bg-pink-100 transition-all shadow-sm"
                      >
                        <Plus size={12} strokeWidth={3} />
                        Add Slot/Pin
                      </button>
                    </div>
                    
                    {item.slotEntries.length === 0 ? (
                      <div className="text-center py-6 bg-white/50 rounded-2xl border border-dashed border-pink-100">
                        <p className="text-xs text-slate-400 font-bold">Click 'Add Slot/Pin' to add slot & pin entries</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {item.slotEntries.map((entry, index) => (
                          <div key={entry.id} className="flex items-end gap-3 group animate-in slide-in-from-top-1 duration-200">
                            <div className="w-20 space-y-1.5">
                              {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qty</label>}
                              <input 
                                type="number" 
                                value={entry.qty}
                                onChange={(e) => updateSlotEntry(item.id, entry.id, 'qty', e.target.value)}
                                className="w-full bg-white border border-pink-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slot</label>}
                              <input 
                                type="text" 
                                placeholder="Slot"
                                value={entry.slot}
                                onChange={(e) => updateSlotEntry(item.id, entry.id, 'slot', e.target.value)}
                                className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pin</label>}
                              <input 
                                type="text" 
                                placeholder="Pin"
                                value={entry.pin}
                                onChange={(e) => updateSlotEntry(item.id, entry.id, 'pin', e.target.value)}
                                className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                              />
                            </div>
                            <button 
                              onClick={() => removeSlotFromItem(item.id, entry.id)}
                              className="p-2.5 mb-0.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <X size={16} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Item Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Notes</label>
                    <textarea 
                      placeholder="Additional notes for this item (optional)"
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Item Button */}
          <button 
            onClick={addItem}
            type="button"
            className="w-full py-4 border-2 border-dashed border-pink-100 rounded-2xl text-pink-500 font-bold text-sm bg-pink-50/10 hover:bg-pink-50/30 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Another Item
          </button>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            type="button"
            className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg shadow-pink-500/20 transition-all mt-4 ${
              isLoading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-[#ee6996] text-white hover:bg-[#d95d85]'
            }`}
          >
            {isLoading ? 'Adding Stock...' : 'Add Stock'}
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
