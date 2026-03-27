import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Save, ChevronDown, Minus, Search } from 'lucide-react';
import { subscribeToOrders, addOrder, updateOrder, deleteOrder, type SupplierOrder } from '../../lib/transactionService';
import { subscribeToStocks, type Stock, SERVICE_CATEGORIES, DURATIONS, STOCK_CATEGORIES } from '../../lib/stockService';
import { toast } from 'react-toastify';

type OrderStatus = 'Pending' | 'Received' | 'Cancelled' | 'PENDING' | 'COMPLETED' | 'DROPPED';

const STATUSES: OrderStatus[] = ['Pending', 'Received', 'Cancelled'];

const STATUS_STYLE: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-50 text-yellow-600 border border-yellow-200',
  Received:  'bg-green-50 text-green-600 border border-green-200',
  Cancelled: 'bg-red-50 text-red-400 border border-red-200',
  PENDING:   'bg-yellow-50 text-yellow-600 border border-yellow-200',
  COMPLETED: 'bg-green-50 text-green-600 border border-green-200',
  DROPPED:   'bg-red-50 text-red-400 border border-red-200',
};

const emptyForm = (): Omit<SupplierOrder, 'id'> => ({
  supplierName: '',
  service: '',
  serviceCategory: '',
  duration: '',
  category: '',
  price: 0,
  quantity: 0,
  status: 'Pending',
});

const inputCls = 'w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all';
const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [editingOrder, setEditingOrder] = useState<SupplierOrder | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualFields, setManualFields] = useState<string[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const getStockLevel = (qty: number): 'low' | 'mid' | 'high' => {
    if (qty <= 2) return 'low';
    if (qty <= 5) return 'mid';
    return 'high';
  };

  const toggleManual = (field: string) => {
    setManualFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  useEffect(() => {
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToStocks((fetchedStocks) => {
      setStocks(fetchedStocks.filter(s => s.status === 'available' || s.status === 'reserved'));
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Form helpers ──────────────────────────────────────────
  const handleFormChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.supplierName || !form.service || !form.duration || !form.category || !form.serviceCategory) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await addOrder(form as SupplierOrder);
      toast.success('Order added successfully');
      setForm(emptyForm());
      setManualFields([]);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add order');
    }
  };

  // ── Edit helpers ──────────────────────────────────────────
  const handleEditOpen = (order: SupplierOrder) => {
    setEditingOrder({ ...order });
    setManualFields([]);
  };

  const handleEditChange = (field: string, value: string | number) => {
    if (!editingOrder) return;
    setEditingOrder(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleEditSave = async () => {
    if (!editingOrder || !editingOrder.id) return;
    
    try {
      const { id, ...updates } = editingOrder;
      await updateOrder(id, updates);
      toast.success('Order updated successfully');
      setEditingOrder(null);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  // ── Delete helpers ────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await deleteOrder(deleteConfirmId);
      toast.success('Order deleted successfully');
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const orderToDelete = orders.find(o => o.id === deleteConfirmId);

  // ── Shared form body ──────────────────────────────────────
  const FormBody = ({
    values,
    onChange,
  }: {
    values: Omit<SupplierOrder, 'id'> | SupplierOrder;
    onChange: (field: string, value: string | number) => void;
  }) => {
    const servicesMap: Record<string, string[]> = SERVICE_CATEGORIES;

    return (
      <div className="grid grid-cols-2 gap-4">

        {/* Supplier Name */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Supplier Name <span className="text-[#ee6996]">*</span></label>
          <input
            type="text"
            placeholder="Enter supplier name"
            value={values.supplierName}
            onChange={e => onChange('supplierName', e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Service Category */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Service Category <span className="text-[#ee6996]">*</span></label>
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

        {/* Category (Stock Category) */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category <span className="text-[#ee6996]">*</span></label>
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
          <div className="relative">
            <input
              type="number"
              min={0}
              step={0.01}
              value={values.price}
              onChange={e => onChange('price', parseFloat(e.target.value) || 0)}
              className={`${inputCls} pr-10`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button type="button" onClick={() => onChange('price', (values.price as number) + 1)} className="p-0.5 text-gray-400 hover:text-[#ee6996] transition-colors"><Plus size={10} strokeWidth={3} /></button>
              <button type="button" onClick={() => onChange('price', Math.max(0, (values.price as number) - 1))} className="p-0.5 text-gray-400 hover:text-[#ee6996] transition-colors"><Minus size={10} strokeWidth={3} /></button>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Quantity <span className="text-[#ee6996]">*</span></label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={values.quantity}
              onChange={e => onChange('quantity', parseInt(e.target.value) || 0)}
              className={`${inputCls} pr-10`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button type="button" onClick={() => onChange('quantity', (values.quantity as number) + 1)} className="p-0.5 text-gray-400 hover:text-[#ee6996] transition-colors"><Plus size={10} strokeWidth={3} /></button>
              <button type="button" onClick={() => onChange('quantity', Math.max(0, (values.quantity as number) - 1))} className="p-0.5 text-gray-400 hover:text-[#ee6996] transition-colors"><Minus size={10} strokeWidth={3} /></button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status <span className="text-[#ee6996]">*</span></label>
          <div className="flex gap-2">
            {STATUSES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => onChange('status', s)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${
                  values.status === s
                    ? s === 'Pending' ? 'bg-yellow-50 border-yellow-300 text-yellow-600'
                    : s === 'Received' ? 'bg-green-50 border-green-300 text-green-600'
                    : 'bg-red-50 border-red-300 text-red-500'
                    : 'bg-white border-pink-100/50 text-gray-400 hover:border-pink-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const headers = ['Supplier', 'Service', 'Category', 'Duration', 'Price', 'Qty', 'Status', 'Actions'];

  return (
    <div className="max-w-7xl mx-auto pb-12 p-6">

      {/* ── Delete confirm ─────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="px-8 py-8 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h2 className="font-black text-slate-800 mb-1">Delete Order?</h2>
              <p className="text-xs text-slate-400">
                Remove <span className="font-bold text-slate-600">{orderToDelete?.service}</span> from <span className="font-bold text-slate-600">{orderToDelete?.supplierName}</span>? This cannot be undone.
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
      {editingOrder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setEditingOrder(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Edit Order</h2>
                <p className="text-xs text-gray-400 mt-0.5">Update the order details below</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-4 max-h-[65vh] overflow-y-auto">
              <FormBody values={editingOrder} onChange={handleEditChange} />
            </div>
            <div className="px-8 pb-8 pt-4">
              <button onClick={handleEditSave} className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-base shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stock Level Overview ─────────────────────── */}
      {(() => {
        const low = stocks.filter(s => getStockLevel(s.quantity) === 'low');
        const mid = stocks.filter(s => getStockLevel(s.quantity) === 'mid');
        const high = stocks.filter(s => getStockLevel(s.quantity) === 'high');
        const filtered = stockFilter === 'all' ? stocks : stockFilter === 'low' ? low : stockFilter === 'mid' ? mid : high;

        return (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden mb-6">
            <div className="px-8 py-6 border-b border-pink-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#4a1d4a] tracking-tight">Stock Level Monitor</h2>
                <p className="text-xs text-slate-500 font-medium italic">Real-time view of available stock quantities</p>
              </div>
              {/* Summary pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All', count: stocks.length, color: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
                  { key: 'low', label: 'Low Stock', count: low.length, color: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' },
                  { key: 'mid', label: 'Mid Stock', count: mid.length, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100' },
                  { key: 'high', label: 'High Stock', count: high.length, color: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setStockFilter(tab.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tab.color} ${stockFilter === tab.key ? 'ring-2 ring-offset-1 ring-current' : ''}`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-x-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-medium">
                  No stocks in this category
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#fff9fb]">
                      {['Service', 'Email', 'Category', 'Duration', 'Price', 'Qty', 'Level'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-[#ee6996] uppercase tracking-widest first:rounded-l-xl last:rounded-r-xl">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(stock => {
                      const level = getStockLevel(stock.quantity);
                      const levelStyles = {
                        low: { badge: 'bg-red-100 text-red-600 border-red-200', bar: 'bg-red-400', label: 'Low Stock' },
                        mid: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', bar: 'bg-yellow-400', label: 'Mid Stock' },
                        high: { badge: 'bg-green-100 text-green-700 border-green-200', bar: 'bg-green-400', label: 'High Stock' },
                      }[level];
                      return (
                        <tr key={stock.id} className="border-b border-pink-50/60 hover:bg-pink-50/10 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-slate-700 capitalize">{stock.service}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium text-slate-500 truncate max-w-[120px] block">{stock.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stock.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-pink-50">{stock.duration}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-black text-slate-700">₱{stock.price}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${levelStyles.bar}`} style={{ width: `${Math.min(100, (stock.quantity / 10) * 100)}%` }} />
                              </div>
                              <span className="text-xs font-black text-slate-600">{stock.quantity}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${levelStyles.badge}`}>
                              {levelStyles.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Main card ──────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">

        {/* Header */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Inventory Management</h1>
            <p className="text-xs text-slate-500 font-medium italic">Monitor and manage supplier orders</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search inventory..."
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
                Add Order
              </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#fff9fb] rounded-xl overflow-hidden">
                  {headers.map(h => (
                    <th key={h} className="px-4 py-4 text-left text-[10px] font-black text-[#ee6996] uppercase tracking-widest first:rounded-l-2xl last:rounded-r-2xl">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-24 text-center">
                       <div className="flex flex-col items-center justify-center">
                          <div className="w-8 h-8 border-4 border-pink-100 border-t-[#ee6996] rounded-full animate-spin mb-4"></div>
                          <p className="text-sm font-bold text-[#ee6996] opacity-40 uppercase tracking-widest">Loading inventory...</p>
                       </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-24 text-center">
                      <p className="text-sm font-bold text-[#ee6996] opacity-40 uppercase tracking-widest">No inventory items found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-pink-50/60 hover:bg-pink-50/10 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-700">{order.supplierName}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-semibold text-slate-600">{order.service}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{order.category}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-pink-50">{order.duration}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-black text-slate-700">₱{order.price.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs ring-1 ring-slate-100">
                          {order.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_STYLE[order.status as OrderStatus] || 'bg-gray-50'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleEditOpen(order)} className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100" title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(order.id || null)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add Order modal ────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Add New Order</h2>
                <p className="text-xs text-gray-400 mt-0.5">Add a new supplier order</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-4 max-h-[65vh] overflow-y-auto">
              <FormBody values={form} onChange={handleFormChange} />
            </div>
            <div className="px-8 pb-8 pt-4">
              <button
                onClick={handleSubmit}
                disabled={!form.supplierName || !form.service || !form.duration || !form.category || !form.serviceCategory}
                className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
