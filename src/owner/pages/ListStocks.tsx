import { useState, useEffect } from 'react';
import { Search, LayoutGrid, List as ListIcon, Edit2, Trash2, ExternalLink, X, Save } from 'lucide-react';
import { subscribeToStocks, updateStock, deleteStock, type Stock } from '../../lib/stockService';
import { toast } from 'react-toastify';


interface StockEntry {
  id: string;
  service: string;
  duration: string;
  email: string;
  password: string;
  category: string;
  devices: string;
  price: string;
  qty: number;
  dateTime: string;
  serviceCategory: string;
}

export default function ListStocks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingStock, setEditingStock] = useState<StockEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['entertainment', 'educational', 'editing', 'other services'];

  // Set up real-time listener from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToStocks((firebaseStocks: Stock[]) => {
      // Transform Firestore stocks to StockEntry format
      const transformedStocks: StockEntry[] = firebaseStocks.map(stock => {
        const createdDate = stock.createdAt?.toDate?.() || new Date();
        return {
          id: stock.id || '',
          service: stock.service,
          duration: stock.duration,
          email: stock.email,
          password: stock.password,
          category: stock.category,
          devices: stock.devices?.join(', ') || '',
          price: `₱${stock.price.toFixed(2)}`,
          qty: stock.quantity,
          dateTime: createdDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          serviceCategory: stock.serviceCategory
        };
      });
      
      setStocks(transformedStocks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter by search query
  const filteredStocks = stocks.filter(s =>
    s.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Edit
  const handleEdit = (stock: StockEntry) => {
    setEditingStock({ ...stock });
  };

  const handleEditSave = async () => {
    if (!editingStock) return;
    
    try {
      // Parse price from display format
      const priceStr = editingStock.price.replace('₱', '').replace(/,/g, '');
      const priceNum = parseFloat(priceStr);

      await updateStock(editingStock.id, {
        service: editingStock.service,
        duration: editingStock.duration,
        email: editingStock.email,
        password: editingStock.password,
        category: editingStock.category,
        quantity: editingStock.qty,
        price: priceNum,
      });

      toast.success('Stock updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setEditingStock(null);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      // setLoading(false);
    }
  };

  const handleEditChange = (field: keyof StockEntry, value: string | number) => {
    if (!editingStock) return;
    setEditingStock({ ...editingStock, [field]: value });
  };

  // Handle Delete
  const handleDeleteConfirm = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteExecute = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await deleteStock(deleteConfirmId);
      
      toast.success('Stock deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Failed to delete stock', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
    }
  };

  const stockToDelete = stocks.find(s => s.id === deleteConfirmId);

  return (
    <div className="p-6">
      {/* Edit Modal */}
      {editingStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-pink-100/50 w-full max-w-md mx-4 overflow-hidden border border-pink-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-pink-50 bg-[#fff9fb]">
              <div>
                <h2 className="text-sm font-black text-[#4a1d4a]">Edit Stock Entry</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Update the details below</p>
              </div>
              <button
                onClick={() => setEditingStock(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-pink-50 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              {[
                { label: 'Service', field: 'service' as keyof StockEntry },
                { label: 'Duration', field: 'duration' as keyof StockEntry },
                { label: 'Email', field: 'email' as keyof StockEntry },
                { label: 'Password', field: 'password' as keyof StockEntry },
                { label: 'Category', field: 'category' as keyof StockEntry },
                { label: 'Price', field: 'price' as keyof StockEntry },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">{label}</label>
                  <input
                    type="text"
                    value={String(editingStock[field])}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                    className="w-full bg-[#fff9fb] border-2 border-pink-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#ee6996] transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={editingStock.qty}
                  onChange={(e) => handleEditChange('qty', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#fff9fb] border-2 border-pink-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#ee6996] transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-pink-50 bg-[#fff9fb]">
              <button
                onClick={() => setEditingStock(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-pink-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex items-center gap-2 px-5 py-2 bg-[#ee6996] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-200/50 hover:bg-[#d95d85] transition-all"
              >
                <Save size={13} strokeWidth={3} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-pink-100/50 w-full max-w-sm mx-4 overflow-hidden border border-pink-50">
            <div className="px-7 py-6 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h2 className="text-sm font-black text-slate-800 mb-1">Delete Entry?</h2>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="font-bold text-slate-600">{stockToDelete?.service}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 px-7 pb-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExecute}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">List of Stocks</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium italic">Manage and organize your service inventory</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
            />
          </div>

          <div className="flex bg-white p-1 rounded-xl border-2 border-pink-50 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-pink-50 text-[#ee6996]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-pink-50 text-[#ee6996]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-pink-100 border-t-[#ee6996] animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-medium">Loading stocks...</p>
          </div>
        </div>
      ) : (
        <>
          {categories.map((cat) => (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-1.5 h-6 bg-[#ee6996] rounded-full" />
                <h2 className="text-lg font-bold text-gray-700 tracking-tight uppercase text-[12px] tracking-widest opacity-80">
                  {cat === 'other services' ? 'OTHER SERVICES' : cat.toUpperCase()}
                </h2>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fff9fb] border-b border-pink-50">
                          <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                          <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Duration</th>
                          <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Credentials</th>
                          <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Category</th>
                          <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                          <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Qty</th>
                          <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50">
                        {filteredStocks.filter(s => s.serviceCategory === cat).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center opacity-30">
                                <ExternalLink size={32} className="text-gray-400 mb-2" />
                                <p className="text-gray-400 font-medium text-xs italic">No entries in {cat}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStocks.filter(s => s.serviceCategory === cat).map((stock) => (
                        <tr key={stock.id} className="hover:bg-pink-50/10 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                                {stock.service.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700 text-sm">{stock.service}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{stock.duration}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-700">{stock.email}</p>
                              <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{stock.password}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-bold text-[#ee6996] uppercase tracking-wider">{stock.category}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-sm font-black text-slate-700">{stock.price}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs ring-1 ring-slate-100">
                              {stock.qty}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(stock)}
                                className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100 shadow-sm"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(stock.id)}
                                className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 shadow-sm"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {filteredStocks.filter(s => s.serviceCategory === cat).length === 0 ? (
                  <div className="col-span-full py-10 text-center opacity-30">
                    <p className="text-gray-400 font-medium text-xs italic">No entries in {cat}</p>
                  </div>
                ) : (
                  filteredStocks.filter(s => s.serviceCategory === cat).map((stock) => (
                    <div key={stock.id} className="bg-[#fff9fb]/50 border-2 border-pink-50 rounded-3xl p-6 hover:shadow-lg hover:shadow-pink-100/50 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/20 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />

                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-lg shadow-sm">
                              {stock.service.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800">{stock.service}</h3>
                              <span className="text-[10px] font-bold text-[#ee6996] uppercase tracking-wider">{stock.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEdit(stock)}
                              className="p-2 bg-white rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 shadow-sm border border-pink-50 transition-all"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(stock.id)}
                              className="p-2 bg-white rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm border border-pink-50 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white/60 rounded-2xl p-4 border border-pink-50/50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Inventory Details</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] text-slate-400 mb-0.5">Duration</p>
                                <p className="text-xs font-bold text-slate-700">{stock.duration}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 mb-0.5">Quantity</p>
                                <p className="text-xs font-bold text-slate-700">{stock.qty} pcs</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/60 rounded-2xl p-4 border border-pink-50/50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Credentials</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{stock.email}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">{stock.password}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xl font-black text-[#ee6996]">{stock.price}</span>
                            <span className="text-[10px] font-medium text-slate-400 italic">{stock.dateTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ))}
        </>
      )}
    </div>
  );
}
