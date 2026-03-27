import { useState } from 'react';
import { Plus, Mail, ChevronDown, X, Eye, EyeOff, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';
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


export default function NewStocks() {
  const username = localStorage.getItem('username') || 'unknown';
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Parent fields (shared across all items)
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [email, setEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [password, setPassword] = useState('');
  const [bulkQuantity, setBulkQuantity] = useState('1');
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkDevices, setBulkDevices] = useState('1');
  const [bulkItemCategory, setBulkItemCategory] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [bulkSlots, setBulkSlots] = useState<Array<{ id: number; qty: number; slot: string; pin: string }>>([]);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  
  // Note: we'll use a single image if provided in bulk mode
  // Or multiple, but let's stick to the prompt's "the image" phrasing.
  // Actually, let's support multiple like in StockPanel for consistency.
  
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

  const uploadBulkImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    for (const file of bulkFiles) {
      let fileToUpload = file;
      try {
        if (file.type.startsWith('image/')) {
          fileToUpload = await imageCompression(file, options);
        }
      } catch (error) {
        console.warn('Image compression failed:', error);
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileToUpload);
      });
      urls.push(dataUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !service || !duration || (isBulkMode ? !bulkEmails : !email) || !password) {
      setShowValidation(true);
      toast.error('Please fill in all required fields', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!isBulkMode && items.some(item => !item.category || !item.price)) {
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
      const imageUrls = isBulkMode && bulkFiles.length > 0 ? await uploadBulkImages() : [];
      
      if (isBulkMode) {
        const emails = bulkEmails.split('\n').map(e => e.trim()).filter(Boolean);
        const qty = parseInt(bulkQuantity) || 1;
        
        for (const emailAddr of emails) {
          const slots = bulkSlots
            .filter(entry => entry.slot && entry.pin)
            .map(entry => ({
              slot: entry.slot,
              pin: entry.pin
            }));

          await addStock({
            service: service,
            serviceCategory: category,
            duration: duration,
            email: emailAddr,
            password: password,
            category: bulkItemCategory || 'shared',
            quantity: qty,
            price: parseFloat(bulkPrice) || 0,
            devices: [bulkDevices],
            ...(slots.length > 0 ? { slots } : {}),
            notes: bulkNotes + (imageUrls.length > 0 ? `\n${JSON.stringify({ receipts: imageUrls })}` : ''),
            status: 'available',
            createdBy: username,
          });
          successCount++;
        }
      } else {
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
      setBulkEmails('');
      setPassword('');
      setBulkQuantity('1');
      setBulkPrice('');
      setBulkDevices('1');
      setBulkItemCategory('');
      setBulkNotes('');
      setBulkSlots([]);
      setBulkFiles([]);
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
      toast.error('❌ Failed to add stock', {
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
        <div className="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
              <Plus size={20} strokeWidth={3} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Add New Stock</h1>
          </div>
          
          <button
            onClick={() => setIsBulkMode(!isBulkMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 shadow-sm ${
              isBulkMode
                ? 'bg-pink-100 border-[#ee6996] text-[#ee6996]'
                : 'bg-white border-pink-50 text-slate-400 hover:border-pink-200'
            }`}
          >
            <Mail size={14} strokeWidth={3} />
            Bulk Mode {isBulkMode ? 'ON' : 'OFF'}
          </button>
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
            
            {!isBulkMode ? (
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
            ) : (
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1">
                  Bulk Emails <span className="text-red-500">*</span> <span className="text-[10px] text-slate-400 font-normal ml-2 italic">(one email per line)</span>
                </label>
                <textarea 
                  placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  rows={4}
                  className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 transition-all resize-none ${showValidation && !bulkEmails ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                />
              </div>
            )}
          </div>

          {/* Row 3: Password, Bulk Quantity, Price, Devices (Conditional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
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

            {isBulkMode && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number"
                    placeholder="1"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(e.target.value)}
                    className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 transition-all ${showValidation && !bulkQuantity ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Price (₱) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    step="0.01"
                    className={`w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 transition-all ${showValidation && !bulkPrice ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bulk Item Details Card */}
          {isBulkMode && (
            <div className="mt-8 space-y-6 bg-pink-50/20 border border-pink-100 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center text-[10px] font-black">BULK</span>
                  Bulk Item Details
                </h3>
              </div>

              <div className="space-y-6">
                {/* Bulk Item Category */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <button 
                      onClick={() => toggleManual('bulk_item_category')}
                      className="text-[10px] font-black text-pink-500 hover:text-pink-700 uppercase"
                    >
                      {manualFields.includes('bulk_item_category') ? 'List' : 'Type'}
                    </button>
                  </div>
                  
                  {manualFields.includes('bulk_item_category') ? (
                    <input 
                      type="text" 
                      placeholder="Enter Category"
                      value={bulkItemCategory}
                      onChange={(e) => setBulkItemCategory(e.target.value)}
                      className={`w-full bg-white rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none transition-all ${showValidation && !bulkItemCategory ? 'border-2 border-red-500 focus:border-red-600' : 'border-2 border-pink-200 focus:border-[#ee6996]'}`}
                    />
                  ) : (
                    <div className="relative">
                      <select 
                        value={bulkItemCategory}
                        onChange={(e) => {
                          setBulkItemCategory(e.target.value);
                          if (e.target.value === 'other') {
                            toggleManual('bulk_item_category');
                          }
                        }}
                        className={`w-full bg-white rounded-2xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 transition-all ${showValidation && !bulkItemCategory ? 'border-2 border-red-500 focus:ring-red-500/20' : 'border border-pink-100 focus:ring-pink-500/20'}`}
                      >
                        <option value="">Select category</option>
                        {STOCK_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="other">other (custom category)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Bulk Devices */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Number of Devices <span className="text-[#ee6996]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBulkDevices(num.toString())}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border-2 ${
                          bulkDevices === num.toString()
                            ? 'bg-pink-100 border-[#ee6996] text-[#ee6996] shadow-sm shadow-pink-100'
                            : 'bg-white border-pink-50 text-slate-400 hover:border-pink-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bulk Slot & Pin Entries */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 ml-1">Slot & Pin Entries</span>
                    <button 
                      onClick={() => setBulkSlots(prev => [...prev, { id: Date.now(), qty: 1, slot: '', pin: '' }])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-[#ee6996] rounded-xl text-[10px] font-black uppercase tracking-widest border border-pink-100 hover:bg-pink-100 transition-all shadow-sm"
                    >
                      <Plus size={12} strokeWidth={3} />
                      Add Slot/Pin
                    </button>
                  </div>
                  
                  {bulkSlots.length === 0 ? (
                    <div className="text-center py-6 bg-white/50 rounded-2xl border border-dashed border-pink-100">
                      <p className="text-xs text-slate-400 font-bold">Click 'Add Slot/Pin' to add slot & pin entries</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bulkSlots.map((entry, index) => (
                        <div key={entry.id} className="flex items-end gap-3 group animate-in slide-in-from-top-1 duration-200">
                          <div className="w-20 space-y-1.5">
                            {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qty</label>}
                            <input 
                              type="number" 
                              value={entry.qty}
                              onChange={(e) => setBulkSlots(bulkSlots.map(s => s.id === entry.id ? { ...s, qty: parseInt(e.target.value) || 1 } : s))}
                              className="w-full bg-white border border-pink-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slot</label>}
                            <input 
                              type="text" 
                              placeholder="Slot"
                              value={entry.slot}
                              onChange={(e) => setBulkSlots(bulkSlots.map(s => s.id === entry.id ? { ...s, slot: e.target.value } : s))}
                              className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            {index === 0 && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pin</label>}
                            <input 
                              type="text" 
                              placeholder="Pin"
                              value={entry.pin}
                              onChange={(e) => setBulkSlots(bulkSlots.map(s => s.id === entry.id ? { ...s, pin: e.target.value } : s))}
                              className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                            />
                          </div>
                          <button 
                            onClick={() => setBulkSlots(bulkSlots.filter(s => s.id !== entry.id))}
                            className="p-2.5 mb-0.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <X size={16} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bulk Item Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Notes</label>
                  <textarea 
                    placeholder="Additional notes for these items (optional)"
                    value={bulkNotes}
                    onChange={(e) => setBulkNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image Upload for Bulk Mode */}
          {isBulkMode && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Image of Receipt / Screenshot <span className="text-[#ee6996]">*</span></label>
                <span className="text-[9px] font-black text-pink-300 uppercase italic leading-none">(Max 10)</span>
              </div>

              {/* Previews */}
              {bulkFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {bulkFiles.map((file, i) => (
                    <div key={i} className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${i + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkFiles(prev => prev.filter((_, index) => index !== i));
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="text-xs font-bold leading-none -mt-0.5">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="relative flex flex-col items-center justify-center w-full h-24 bg-slate-50 border-2 border-dashed border-pink-200 rounded-[1.5rem] cursor-pointer hover:bg-pink-50/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] group-hover:scale-110 transition-transform shadow-sm">
                    <Upload size={18} strokeWidth={3} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-[#ee6996] uppercase tracking-widest">
                      {bulkFiles.length > 0 ? `${bulkFiles.length} Files Selected` : 'Choose Files'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 italic">No file chosen</p>
                  </div>
                </div>
                <input type="file" multiple onChange={(e) => {
                  if (e.target.files) {
                    setBulkFiles(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 10));
                  }
                }} className="hidden" accept="image/*" />
              </label>
            </div>
          )}

          {/* Items Section - Only in Normal Mode */}
          {!isBulkMode && (
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

              {/* Add Another Item Button */}
              <button 
                onClick={addItem}
                type="button"
                className="w-full py-4 border-2 border-dashed border-pink-100 rounded-2xl text-pink-500 font-bold text-sm bg-pink-50/10 hover:bg-pink-50/30 transition-colors flex items-center justify-center gap-2 mt-6"
              >
                <Plus size={18} strokeWidth={2.5} />
                Add Another Item
              </button>
            </div>
          )}

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

      {/* Remove redundant Modals */}
    </div>
  );
}
