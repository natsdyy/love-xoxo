import { useState, useEffect } from 'react';
import { Plus, X, ListFilter, Search, Trash2, ChevronDown } from 'lucide-react';
import { subscribeToOrders, addOrder, updateOrder, deleteOrder, type SupplierOrder } from '../../lib/transactionService';
import { toast } from 'react-toastify';
import { SERVICE_CATEGORIES, DURATIONS, STOCK_CATEGORIES } from '../../lib/stockService';

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualFields, setManualFields] = useState<string[]>([]);
  
  const [form, setForm] = useState<Omit<SupplierOrder, 'id'>>({
    supplierName: '',
    service: '',
    serviceCategory: '',
    duration: '',
    category: '',
    price: 0,
    quantity: 0,
    status: 'PENDING'
  });

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

  const pendingCount = orders.filter(o => o.status === 'PENDING' || o.status === 'Pending').length;
  const droppedCount = orders.filter(o => o.status === 'DROPPED' || o.status === 'Cancelled').length;

  const filteredOrders = orders.filter(o => 
    o.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = async () => {
    if (!form.supplierName || !form.service || !form.duration || !form.category || !form.serviceCategory) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await addOrder(form);
      toast.success('Order added successfully');
      setForm({
        supplierName: '',
        service: '',
        serviceCategory: '',
        duration: '',
        category: '',
        price: 0,
        quantity: 0,
        status: 'PENDING'
      });
      setManualFields([]);
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add order');
    }
  };

  const handleUpdateStatus = async (id: string, status: SupplierOrder['status']) => {
    try {
      await updateOrder(id, { status });
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id);
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const inputCls = "w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm";
  const selectCls = `${inputCls} appearance-none cursor-pointer pr-10`;

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-8 gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Orders</h1>
            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                Pending: {pendingCount}
              </span>
              <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-red-100 shadow-sm">
                Dropped: {droppedCount}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white px-6 py-3 rounded-2xl flex items-center gap-2.5 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Order
          </button>
        </div>

        {/* Table Controls */}
        <div className="px-8 pb-6 flex items-center justify-between border-b border-pink-50">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#ee6996] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-pink-50 transition-all">
            <ListFilter size={16} />
            Filter
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50/10">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em]">Supplier</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em] text-center">Service</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em] text-center">Duration</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em] text-center">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em] text-center">Quantity</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center text-pink-400 font-bold">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                       <Plus size={48} className="text-pink-300 mb-4" />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders tracked yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-pink-50/10 transition-colors border-b border-pink-50 last:border-0">
                    <td className="px-8 py-4">
                      <span className="text-sm font-bold text-gray-700">{order.supplierName}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-600">{order.service}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{order.serviceCategory}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{order.duration}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-sm font-black text-emerald-600">₱{order.price.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-sm font-bold text-gray-600">{order.quantity}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id!, e.target.value as any)}
                        className={`text-[10px] font-black rounded-full px-3 py-1 border-2 transition-all cursor-pointer outline-none ${
                          order.status === 'COMPLETED' || order.status === 'Received' ? 'bg-green-50 text-green-600 border-green-100' :
                          order.status === 'DROPPED' || order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="DROPPED">DROPPED</option>
                      </select>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleDelete(order.id!)}
                          className="p-2 hover:bg-red-50 rounded-xl text-gray-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
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

      {/* Add New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-pink-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Add New Order</h2>
                  <p className="text-[13px] text-gray-400 font-medium mt-1">Add a new order to the system.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-10 py-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Supplier Name */}
                <div className="space-y-2 col-span-full">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name <span className="text-pink-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter supplier name"
                    value={form.supplierName}
                    onChange={(e) => setForm({...form, supplierName: e.target.value})}
                    className={inputCls}
                  />
                </div>

                {/* Service Category */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Category <span className="text-pink-500">*</span></label>
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
                      value={form.serviceCategory}
                      onChange={(e) => setForm({...form, serviceCategory: e.target.value})}
                      className={inputCls}
                    />
                  ) : (
                    <div className="relative">
                      <select 
                        value={form.serviceCategory}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({...form, serviceCategory: val, service: ''});
                          if (val === 'other (custom category)') toggleManual('serviceCategory');
                        }}
                        className={selectCls}
                      >
                        <option value="">Select</option>
                        <option value="entertainment">entertainment</option>
                        <option value="educational">educational</option>
                        <option value="editing">editing</option>
                        <option value="other services">other services</option>
                        <option value="other (custom category)">other (custom category)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Service */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Service <span className="text-pink-500">*</span></label>
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
                      value={form.service}
                      onChange={(e) => setForm({...form, service: e.target.value})}
                      className={inputCls}
                    />
                  ) : (
                    <div className="relative">
                      <select 
                        value={form.service}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({...form, service: val});
                          if (val === 'other (custom service)') toggleManual('service');
                        }}
                        className={selectCls}
                      >
                        <option value="">Select</option>
                        {form.serviceCategory && SERVICE_CATEGORIES[form.serviceCategory as keyof typeof SERVICE_CATEGORIES]?.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        {(!form.serviceCategory || form.serviceCategory === 'other (custom category)') && <option value="other (custom service)">other (custom service)</option>}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Duration <span className="text-pink-500">*</span></label>
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
                      value={form.duration}
                      onChange={(e) => setForm({...form, duration: e.target.value})}
                      className={inputCls}
                    />
                  ) : (
                    <div className="relative">
                      <select 
                        value={form.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({...form, duration: val});
                          if (val === 'other (custom duration)') toggleManual('duration');
                        }}
                        className={selectCls}
                      >
                        <option value="">Select</option>
                        {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        <option value="other (custom duration)">other (custom duration)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Category (Stock Category) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Item Category <span className="text-pink-500">*</span></label>
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
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className={inputCls}
                    />
                  ) : (
                    <div className="relative">
                      <select 
                        value={form.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({...form, category: val});
                          if (val === 'other') toggleManual('category');
                        }}
                        className={selectCls}
                      >
                        <option value="">Select</option>
                        {STOCK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="other">other (custom item category)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₱) <span className="text-pink-500">*</span></label>
                  <input 
                    type="number" 
                    value={form.price}
                    onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm font-bold text-emerald-600"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity <span className="text-pink-500">*</span></label>
                  <input 
                    type="number" 
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: parseInt(e.target.value) || 0})}
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2 col-span-full">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Status <span className="text-pink-500">*</span></label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value as any})}
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm font-bold text-amber-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DROPPED">DROPPED</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button 
                  onClick={handleAddOrder}
                  className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
