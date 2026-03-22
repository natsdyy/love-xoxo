import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, 
  Search, 
  User,
  TrendingUp,
  Plus,
  X,
  Minus,
  ChevronDown
} from 'lucide-react';
import { subscribeToSales, addSale, type Sale } from '../../lib/transactionService';
import { getAllUsers } from '../../lib/firebaseAuth';
import { toast } from 'react-toastify';

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
        className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 text-left flex items-center justify-between"
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
              onClick={(e) => {
                e.stopPropagation();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admins, setAdmins] = useState<{ id: string; displayName: string; username: string }[]>([]);

  // Form states
  const [selectedAdminName, setSelectedAdminName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', service: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }
  ]);

  // Options
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

  // Fetch real-time sales and admins
  useEffect(() => {
    const unsubscribe = subscribeToSales((data) => {
      setTransactions(data);
      setLoading(false);
    });

    const fetchAdmins = async () => {
      const users = await getAllUsers();
      setAdmins(users.map(u => ({ id: u.id, displayName: u.displayName, username: u.username })));
    };
    fetchAdmins();

    return () => unsubscribe();
  }, []);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), service: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const toggleManual = (id: string, field: string) => {
    setItems(items.map(i => {
      if (i.id === id) {
        const manualFields = i.manualFields || [];
        const isManual = manualFields.includes(field);
        return {
          ...i,
          [field]: '',
          manualFields: isManual ? manualFields.filter(f => f !== field) : [...manualFields, field]
        };
      }
      return i;
    }));
  };

  const handleAddSale = async () => {
    if (!selectedAdminName) {
      toast.error('Please select an admin');
      return;
    }

    setIsSubmitting(true);
    try {
      for (const item of items) {
        const priceNum = parseFloat(item.price);
        const qtyNum = parseInt(item.qty);
        const discountNum = parseFloat(item.discount || '0');
        const total = (priceNum * qtyNum) - discountNum;

        await addSale({
          stockId: 'manual', 
          service: item.service,
          serviceCategory: item.category,
          email: customerEmail,
          buyerName: buyerName,
          quantity: qtyNum,
          price: priceNum,
          discount: discountNum,
          totalPrice: total,
          adminName: selectedAdminName,
          status: 'approved',
          createdAt: new Date(soldDate)
        });
      }
      toast.success('Sales added successfully!');
      setIsModalOpen(false);
      setItems([{ id: '1', service: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }]);
      setCustomerEmail('');
      setBuyerName('');
    } catch (error) {
      console.error('Error adding sales:', error);
      toast.error('Failed to add sales');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.totalPrice || 0), 0);
  const topSeller = transactions.reduce((acc, tx) => {
    acc[tx.adminName] = (acc[tx.adminName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSellerName = Object.entries(topSeller).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sales History</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-pink-200"
        >
          <Plus size={20} />
          Add Sale
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Sales</p>
            <p className="text-2xl font-black text-slate-800">{transactions.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black text-slate-800">₱{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#ee6996] rounded-[2rem] p-6 shadow-lg shadow-pink-100 flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Top Seller</p>
            <p className="text-lg font-bold">{topSellerName}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Records</h2>
            <p className="text-xs text-slate-500 font-medium italic">Permanently preserved historical records</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Email</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Buyer</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Sold By</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-10 text-center text-slate-400">Loading...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={7} className="px-8 py-10 text-center text-slate-400">No transactions found</td></tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {tx.service.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{tx.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500">{tx.email}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-700">{tx.buyerName}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-bold text-[#ee6996] bg-pink-50 px-2 py-1 rounded-lg uppercase">{tx.serviceCategory}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-slate-800">₱{tx.totalPrice?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        <User size={10} />
                        {tx.adminName}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleString() : new Date(tx.createdAt).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-pink-50 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Add Manual Sale</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-pink-50 rounded-full text-gray-400 hover:text-pink-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#ee6996] uppercase tracking-wider mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Admin Username *</label>
                    <div className="relative">
                      <select 
                        value={selectedAdminName}
                        onChange={(e) => setSelectedAdminName(e.target.value)}
                        className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] appearance-none font-bold text-slate-700"
                      >
                        <option value="">Select admin</option>
                        {admins.map(admin => (
                          <option key={admin.id} value={admin.displayName}>{admin.displayName} (@{admin.username})</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email (Optional)</label>
                    <input type="text" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Enter email" className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] font-bold text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Buyer Name (Optional)</label>
                    <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Enter buyer name" className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] font-bold text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Sold Date *</label>
                    <input type="date" value={soldDate} onChange={(e) => setSoldDate(e.target.value)} className="w-full bg-pink-50/30 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] font-bold text-slate-700" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-pink-100">
                  <h3 className="text-sm font-bold text-[#ee6996] uppercase tracking-wider">Items</h3>
                  <button onClick={addItem} className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-all">
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="relative bg-white border-2 border-pink-100/50 rounded-3xl p-6 shadow-sm">
                    <div className="absolute -top-3 left-6 bg-white px-3 text-[10px] font-black text-[#ee6996] uppercase tracking-widest border-2 border-pink-100/50 rounded-full">Item #{index + 1}</div>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Minus size={16} />
                      </button>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5 col-span-1 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Category *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'category')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('category') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('category') ? (
                          <input type="text" placeholder="Type Category" value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700" />
                        ) : (
                          <CustomSelect value={item.category} onChange={(val) => updateItem(item.id, 'category', val)} options={categoryOptions} />
                        )}
                      </div>

                      <div className="space-y-1.5 col-span-1 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Service *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'service')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('service') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('service') ? (
                          <input type="text" placeholder="Type Service" value={item.service} onChange={(e) => updateItem(item.id, 'service', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700" />
                        ) : (
                          <CustomSelect value={item.service} onChange={(val) => updateItem(item.id, 'service', val)} options={getServiceOptions(item.category)} />
                        )}
                      </div>

                      <div className="space-y-1.5 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Duration *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'duration')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('duration') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('duration') ? (
                          <input type="text" placeholder="Type Duration" value={item.duration} onChange={(e) => updateItem(item.id, 'duration', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700" />
                        ) : (
                          <CustomSelect value={item.duration} onChange={(val) => updateItem(item.id, 'duration', val)} options={durationOptions} />
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Devices *</label>
                        <input type="text" placeholder="e.g., 1" value={item.devices} onChange={(e) => updateItem(item.id, 'devices', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] font-bold text-slate-700" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price (₱) *</label>
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] text-emerald-600 font-bold" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Qty *</label>
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] font-bold text-slate-700" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Discount (₱)</label>
                        <input type="number" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] text-pink-500 font-bold" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Total</label>
                        <div className="w-full bg-pink-50/10 border-2 border-transparent px-4 py-3 text-xs font-black text-slate-800">
                          ₱{((parseFloat(item.price) * parseInt(item.qty)) - parseFloat(item.discount || '0')).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button 
                  onClick={handleAddSale}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#ee6996] to-[#fc6797] hover:from-[#d55a84] hover:to-[#e15c87] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-pink-200 transition-all hover:scale-[1.01] active:scale-[0.99] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Adding...' : 'Add Sale'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
