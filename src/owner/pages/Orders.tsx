import { useState } from 'react';
import { Plus, X, ListFilter, Search } from 'lucide-react';

interface OrderItem {
  id: string;
  supplier: string;
  service: string;
  duration: string;
  category: string;
  price: string;
  qty: string;
  status: 'PENDING' | 'COMPLETED' | 'DROPPED';
}

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders] = useState<OrderItem[]>([]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-8 gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Orders</h1>
            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                Pending: 0
              </span>
              <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-red-100 shadow-sm">
                Dropped: 0
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                       <Plus size={48} className="text-pink-300 mb-4" />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders tracked yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                null
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
            <div className="px-10 py-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Supplier Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name <span className="text-pink-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter supplier name"
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                  />
                </div>

                {/* Service */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Service <span className="text-pink-500">*</span></label>
                  <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                    <option value="">Select</option>
                    <option value="netflix">Netflix</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration <span className="text-pink-500">*</span></label>
                  <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                    <option value="">Select</option>
                    <option value="1month">1 Month</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category <span className="text-pink-500">*</span></label>
                  <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                    <option value="">Select</option>
                    <option value="solo">Solo</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₱) <span className="text-pink-500">*</span></label>
                  <input 
                    type="number" 
                    defaultValue="0.00"
                    step="0.01"
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm font-bold text-emerald-600"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity <span className="text-pink-500">*</span></label>
                  <input 
                    type="number" 
                    defaultValue="0"
                    className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all shadow-sm"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2 col-span-full">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Status <span className="text-pink-500">*</span></label>
                  <select className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm font-bold text-amber-500">
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DROPPED">DROPPED</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
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
