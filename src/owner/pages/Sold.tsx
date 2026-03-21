import { useState } from 'react';
import { Plus, X, Hash, Minus } from 'lucide-react';

interface SaleItem {
  id: string;
  service: string;
  duration: string;
  category: string;
  devices: string;
  price: string;
  qty: string;
  discount: string;
}

export default function Sold() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', service: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0' }
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
      discount: '0'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

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

      {/* Main Content Area (Empty State for now) */}
      <div className="bg-white rounded-2xl border border-pink-50 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-400 mb-4">
          <Hash size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">No sales recorded yet</h3>
        <p className="text-gray-500 mt-1 max-w-xs">Click the "Add Sale" button to manually record a new transaction.</p>
      </div>

      {/* Add Manual Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-pink-50">
              <h2 className="text-xl font-bold text-gray-800">Add Manual Sale</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-pink-50 rounded-full text-gray-400 hover:text-pink-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Details Section */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#ee6996] uppercase tracking-wider mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                      Admin Username <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] transition-all appearance-none">
                        <option value="">Select admin</option>
                        <option value="admin1">Admin 1</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
                        <Plus size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                      Email <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter email"
                      className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                      Buyer Name <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter buyer name"
                      className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 ml-1">
                      Sold Date <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="date"
                        defaultValue="2026-03-21"
                        className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-pink-100">
                  <h3 className="text-sm font-bold text-[#ee6996] uppercase tracking-wider">Items</h3>
                  <button 
                    onClick={addItem}
                    className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-all"
                  >
                    <Plus size={14} />
                    Add Another Item
                  </button>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="relative bg-white border-2 border-pink-100/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute -top-3 left-6 bg-white px-3 text-[10px] font-black text-[#ee6996] uppercase tracking-widest border-2 border-pink-100/50 rounded-full">
                      Item #{index + 1}
                    </div>
                    
                    {items.length > 1 && (
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Minus size={16} />
                      </button>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Service *</label>
                        <select 
                          value={item.service}
                          onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                        >
                          <option value="">Select</option>
                          <option value="netflix">Netflix</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Duration *</label>
                        <select 
                          value={item.duration}
                          onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                        >
                          <option value="">Select</option>
                          <option value="1month">1 Month</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Category *</label>
                        <select 
                          value={item.category}
                          onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                        >
                          <option value="">Select</option>
                          <option value="solo">Solo</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Devices *</label>
                        <input 
                          type="text"
                          placeholder="e.g., 1"
                          value={item.devices}
                          onChange={(e) => updateItem(item.id, 'devices', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price (₱) *</label>
                        <input 
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium text-emerald-600 font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Qty *</label>
                        <input 
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Discount (₱)</label>
                        <input 
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium text-pink-500 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
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
