import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, X, Minus, ChevronDown, Search, Trash2, Pencil, CheckCircle2, TrendingUp, Calendar 
} from 'lucide-react';
import { subscribeToSales, addSale, updateSale, deleteSale, clearAllSales, type Sale } from '../../lib/transactionService';
import { getAllUsers } from '../../lib/firebaseAuth';
import { toast } from 'react-toastify';
import { SERVICE_CATEGORIES, DURATIONS, STOCK_CATEGORIES } from '../../lib/stockService';

interface SaleItem {
  id: string;
  service: string;
  serviceCategory: string;
  duration: string;
  category: string;
  devices: string;
  price: string;
  qty: string;
  discount: string;
  manualFields?: string[];
}

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
      setCoords({ top: rect.bottom + 2, left: rect.left, width: rect.width });
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
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={openDropdown}
        className="w-full bg-pink-50/20 border-2 border-pink-100/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 text-left flex items-center justify-between shadow-sm"
      >
        <span className={selected ? 'text-slate-700' : 'text-slate-400 font-medium'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-pink-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
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
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white border border-pink-100 rounded-2xl shadow-2xl py-2 max-h-52 overflow-y-auto animate-in slide-in-from-top-1 duration-200 shadow-pink-200/50"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors hover:bg-pink-50 ${
                value === opt.value ? 'bg-pink-50/60 text-[#ee6996]' : 'text-slate-600 hover:text-[#ee6996]'
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAdminName, setSelectedAdminName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', service: '', serviceCategory: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }
  ]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [admins, setAdmins] = useState<{ id: string; displayName: string; username: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [expandedAdmins, setExpandedAdmins] = useState<Record<string, boolean>>({});
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [adminFilter, setAdminFilter] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToSales((firebaseSales: Sale[]) => {
      setSales(firebaseSales);
    });

    const fetchAdmins = async () => {
      const users = await getAllUsers();
      setAdmins(users.map(u => ({ id: u.id, displayName: u.displayName, username: u.username })));
    };
    fetchAdmins();

    return () => unsubscribe();
  }, []);

  const serviceCategoryOptions = [
    { label: 'entertainment', value: 'entertainment' },
    { label: 'educational', value: 'educational' },
    { label: 'editing', value: 'editing' },
    { label: 'other services', value: 'other services' },
    { label: 'other (custom category)', value: 'other (custom category)' },
  ];

  const getServiceOptions = (cat: string) => {
    const list = (SERVICE_CATEGORIES as any)[cat] || [];
    return [...list.map((s: string) => ({ label: s, value: s })), { label: 'other (custom service)', value: 'other (custom service)' }];
  };

  const durationOptions = DURATIONS.map(d => ({ label: d, value: d })).concat([{ label: 'other (custom duration)', value: 'other (custom duration)' }]);
  const itemCategoryOptions = STOCK_CATEGORIES.map(c => ({ label: c, value: c })).concat([{ label: 'other (custom item category)', value: 'other (custom item category)' }]);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), service: '', serviceCategory: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleManual = (id: string, field: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const manualFields = item.manualFields || [];
        const isManual = manualFields.includes(field);
        return {
          ...item,
          [field]: '',
          manualFields: isManual ? manualFields.filter(f => f !== field) : [...manualFields, field]
        };
      }
      return item;
    }));
  };

  const handleEdit = (sale: Sale) => {
    setEditingSaleId(sale.id!);
    setSelectedAdminName(sale.adminName);
    setCustomerEmail(sale.email || '');
    setBuyerName(sale.buyerName || '');
    
    // Convert Firestore Timestamp or Date to string 'YYYY-MM-DD'
    let dateStr = new Date().toISOString().split('T')[0];
    if (sale.createdAt) {
      const d = sale.createdAt.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
      dateStr = d.toISOString().split('T')[0];
    }
    setSoldDate(dateStr);

    setItems([{
      id: '1',
      service: sale.service,
      serviceCategory: sale.serviceCategory,
      duration: sale.duration,
      category: sale.category,
      devices: sale.devices || '',
      price: String(sale.price),
      qty: String(sale.quantity),
      discount: String(sale.discount || 0),
      manualFields: []
    }]);
    setIsModalOpen(true);
  };

  const handleSold = async () => {
    if (!selectedAdminName) {
      toast.error('Please select an admin');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSaleId) {
        const item = items[0];
        const priceNum = Number(item.price) || 0;
        const qtyNum = Number(item.qty) || 1;
        const discountNum = Number(item.discount) || 0;
        const total = (priceNum * qtyNum) - discountNum;

        await updateSale(editingSaleId, {
          service: item.service,
          serviceCategory: item.serviceCategory,
          duration: item.duration,
          category: item.category,
          email: customerEmail,
          buyerName: buyerName,
          quantity: qtyNum,
          price: priceNum,
          discount: discountNum,
          totalPrice: total,
          adminName: selectedAdminName,
          devices: item.devices,
          createdAt: new Date(soldDate)
        });
        toast.success('Sale updated successfully!');
      } else {
        for (const item of items) {
          if (!item.service || !item.serviceCategory || !item.duration || !item.category) {
              toast.error('Please fill in all item fields');
              setIsSubmitting(false);
              return;
          }
          const priceNum = Number(item.price) || 0;
          const qtyNum = Number(item.qty) || 1;
          const discountNum = Number(item.discount) || 0;
          const total = (priceNum * qtyNum) - discountNum;

          await addSale({
            stockId: 'manual', 
            service: item.service,
            serviceCategory: item.serviceCategory,
            duration: item.duration,
            category: item.category,
            email: customerEmail,
            buyerName: buyerName,
            quantity: qtyNum,
            price: priceNum,
            discount: discountNum,
            totalPrice: total,
            adminName: selectedAdminName,
            status: 'approved',
            devices: item.devices,
            createdAt: new Date(soldDate)
          });
        }
        toast.success('Sales added successfully!');
      }
      setIsModalOpen(false);
      setEditingSaleId(null);
      setItems([{ id: '1', service: '', serviceCategory: '', duration: '', category: '', devices: '', price: '0', qty: '1', discount: '0', manualFields: [] }]);
      setCustomerEmail('');
      setBuyerName('');
      if (!editingSaleId) {
        // Keep the date as is or reset if preferred. User says it should remain "fixed".
        // setSoldDate(new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Error adding sales:', error);
      toast.error('Failed to add sales');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all sales logs? This action is irreversible.')) return;
    try {
      await clearAllSales();
      toast.success('All logs cleared!');
    } catch (e) {
      toast.error('Failed to clear logs');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await deleteSale(id);
      toast.success('Record deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const filteredSales = sales.filter(tx => {
    const matchesSearch = !searchQuery ||
      tx.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesAdmin = !adminFilter || tx.adminName === adminFilter;

    let matchesDate = true;
    if (filterStartDate || filterEndDate) {
      const saleDate = tx.createdAt
        ? (tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt))
        : null;
      if (!saleDate) {
        matchesDate = false;
      } else {
        const saleDateStr = saleDate.toISOString().split('T')[0];
        if (filterStartDate && saleDateStr < filterStartDate) matchesDate = false;
        if (filterEndDate && saleDateStr > filterEndDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesAdmin && matchesDate;
  });

  const totalRevenue = filteredSales.reduce((acc, tx) => acc + (tx.totalPrice || 0), 0);
  
  // Grouping logic — show all active admins (even 0 sales), unless a specific admin is filtered
  const activeAdminNames = admins.map(a => a.displayName);
  const adminNamesToShow = adminFilter
    ? [adminFilter]
    : activeAdminNames.length > 0
      ? activeAdminNames
      : Array.from(new Set(filteredSales.map(s => s.adminName)));

  const salesByAdmin = adminNamesToShow.reduce((acc, name) => {
    acc[name] = filteredSales.filter(s => s.adminName === name);
    return acc;
  }, {} as Record<string, Sale[]>);

  const hasActiveFilters = filterStartDate || filterEndDate || adminFilter || searchQuery;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterStartDate('');
    setFilterEndDate('');
    setAdminFilter('');
  };

  const toggleAdmin = (name: string) => {
    setExpandedAdmins(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sales History</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} />
          Add Sale
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Sales</p>
            <p className="text-2xl font-black text-slate-800">{sales.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black text-slate-800">₱{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        <div className="px-8 py-6 border-b border-pink-50 space-y-4">

          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Records</h2>
              <p className="text-xs text-slate-400 font-medium italic">Permanently preserved historical records</p>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-red-400 bg-slate-50 hover:bg-red-50 px-3 py-2 rounded-xl transition-all uppercase tracking-widest"
                >
                  <X size={12} />
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                title="Delete All Logs"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Admin Filter */}
            <div className="relative">
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className={`appearance-none bg-white border-2 rounded-2xl pl-4 pr-9 py-2.5 text-xs font-bold focus:outline-none transition-all shadow-sm cursor-pointer ${
                  adminFilter
                    ? 'border-[#ee6996] text-[#ee6996]'
                    : 'border-pink-50 text-slate-500 hover:border-pink-200'
                }`}
              >
                <option value="">All Admins</option>
                {admins.map(admin => (
                  <option key={admin.id} value={admin.displayName}>
                    {admin.displayName}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400" strokeWidth={3} />
            </div>

            {/* Start Date */}
            <div className="relative flex items-center">
              <Calendar size={14} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className={`bg-white border-2 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none transition-all shadow-sm ${
                  filterStartDate ? 'border-[#ee6996] text-[#ee6996]' : 'border-pink-50 text-slate-500'
                }`}
                title="Start Date"
              />
              {filterStartDate && (
                <button onClick={() => setFilterStartDate('')} className="absolute right-2 text-slate-300 hover:text-red-400">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Divider */}
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">to</span>

            {/* End Date */}
            <div className="relative flex items-center">
              <Calendar size={14} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className={`bg-white border-2 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none transition-all shadow-sm ${
                  filterEndDate ? 'border-[#ee6996] text-[#ee6996]' : 'border-pink-50 text-slate-500'
                }`}
                title="End Date"
              />
              {filterEndDate && (
                <button onClick={() => setFilterEndDate('')} className="absolute right-2 text-slate-300 hover:text-red-400">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by service, email, buyer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-pink-50 rounded-2xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all shadow-sm"
              />
            </div>

          </div>
        </div>
        <div className="p-4 space-y-4 bg-pink-50/10">
          {Object.entries(salesByAdmin).length === 0 ? (
            <div className="px-8 py-20 text-center">
              <p className="text-slate-300 italic font-bold">No sales records found</p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="mt-3 text-[10px] font-black text-[#ee6996] uppercase tracking-widest hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            Object.entries(salesByAdmin).map(([adminName, adminSales]) => {
              const isExpanded = expandedAdmins[adminName] !== false; // Default to expanded
              const totalAdminRevenue = adminSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);

              return (
                <div key={adminName} className="bg-white rounded-[2rem] border border-pink-50 overflow-hidden shadow-sm">
                  {/* Collapsible Header */}
                  <button 
                    onClick={() => toggleAdmin(adminName)}
                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-pink-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#ee6996] text-white flex items-center justify-center font-black text-sm">
                        {adminName.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">{adminName}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                          adminSales.length === 0 ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                          {adminSales.length === 0 ? 'No records' : `${adminSales.length} Records`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Contributor Revenue</p>
                        <p className={`text-sm font-black ${
                          adminSales.length === 0 ? 'text-slate-300' : 'text-[#ee6996]'
                        }`}>
                          {adminSales.length === 0 ? '—' : `₱${totalAdminRevenue.toLocaleString()}`}
                        </p>
                      </div>
                      <div className={`w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#ee6996] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </button>

                  {/* Grouped Table */}
                  {isExpanded && (
                    <div className="overflow-x-auto animate-in slide-in-from-top-2 duration-300 border-t border-pink-50/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#fff9fb]">
                            <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Service</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Buyer & Email</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Duration</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Price</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Date</th>
                            <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50/30">
                          {adminSales.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-8 py-8 text-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No records match current filters</p>
                              </td>
                            </tr>
                          ) : adminSales.map((tx) => (
                            <tr key={tx.id} className="hover:bg-pink-50/10 transition-colors group/row">
                              <td className="px-8 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-[#ee6996] font-black text-[9px]">
                                    {tx.service.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 text-xs">{tx.service}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{tx.category}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-slate-700 uppercase">{tx.buyerName || '---'}</span>
                                   <span className="text-[9px] text-slate-400 font-bold truncate max-w-[120px]">{tx.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase">{tx.duration || '---'}</span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-xs font-black text-emerald-500">₱{tx.totalPrice?.toLocaleString()}</span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-[9px] text-slate-400 font-bold">
                                  {tx.createdAt ? (
                                    (tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt)).toLocaleDateString()
                                  ) : '---'}
                                </span>
                              </td>
                              <td className="px-8 py-4 text-right flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleEdit(tx)}
                                  className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(tx.id!)}
                                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => { setIsModalOpen(false); setEditingSaleId(null); }} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="flex items-center justify-between px-10 py-8 border-b border-pink-50 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{editingSaleId ? 'Edit Sale Record' : 'Add Manual Sale'}</h2>
                <p className="text-xs text-slate-400 font-medium italic mt-1">{editingSaleId ? 'Modify an existing sales record' : 'Record sales that were handled outside the system'}</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingSaleId(null); }} className="p-3 hover:bg-pink-50 rounded-2xl text-gray-300 hover:text-pink-500 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 max-h-[75vh] overflow-y-auto">
              <div className="mb-10">
                <h3 className="text-[11px] font-black text-[#ee6996] uppercase tracking-widest mb-6 px-1">Global Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Username *</label>
                    <div className="relative">
                      <select 
                        value={selectedAdminName}
                        onChange={(e) => setSelectedAdminName(e.target.value)}
                        className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] appearance-none font-bold text-slate-700 shadow-sm"
                      >
                        <option value="">Select admin</option>
                        {admins.map(admin => (
                          <option key={admin.id} value={admin.displayName}>{admin.displayName} (@{admin.username})</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                    <input type="text" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@example.com" className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] font-bold text-slate-700 shadow-sm placeholder:opacity-40" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Buyer Name (Optional)</label>
                    <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="John Doe" className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] font-bold text-slate-700 shadow-sm placeholder:opacity-40" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sold Date *</label>
                    <div className="relative">
                        <input type="date" value={soldDate} onChange={(e) => setSoldDate(e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] font-bold text-slate-700 shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-pink-100">
                  <h3 className="text-[11px] font-black text-[#ee6996] uppercase tracking-widest px-1">Sale Items</h3>
                  {!editingSaleId && (
                    <button onClick={addItem} className="flex items-center gap-2 text-[10px] font-black text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-xl transition-all shadow-sm uppercase tracking-widest hover:scale-105 active:scale-95">
                      <Plus size={14} strokeWidth={3} /> Add Item
                    </button>
                  )}
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="relative bg-[#fffcfd]/50 border-2 border-pink-100/30 rounded-3xl p-8 shadow-sm group hover:border-[#ee6996]/20 transition-all">
                    <div className="absolute -top-3 left-8 bg-white px-4 text-[11px] font-black text-[#ee6996] uppercase tracking-[0.2em] border-2 border-pink-100/30 rounded-full shadow-sm">Item #{index + 1}</div>
                    {items.length > 1 && !editingSaleId && (
                      <button onClick={() => removeItem(item.id)} className="absolute -top-3 -right-3 w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-md group-hover:scale-110 active:scale-90">
                        <Minus size={18} strokeWidth={3} />
                      </button>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                      
                      {/* Service Category */}
                      <div className="space-y-1.5 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'serviceCategory')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('serviceCategory') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('serviceCategory') ? (
                          <input type="text" placeholder="Type Category" value={item.serviceCategory} onChange={(e) => updateItem(item.id, 'serviceCategory', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 shadow-sm" />
                        ) : (
                          <CustomSelect value={item.serviceCategory} onChange={(val) => {
                              updateItem(item.id, 'serviceCategory', val);
                              updateItem(item.id, 'service', '');
                              if (val === 'other (custom category)') toggleManual(item.id, 'serviceCategory');
                          }} options={serviceCategoryOptions} />
                        )}
                      </div>

                       {/* Service */}
                      <div className="space-y-1.5 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'service')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('service') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('service') ? (
                          <input type="text" placeholder="Type Service" value={item.service} onChange={(e) => updateItem(item.id, 'service', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 shadow-sm" />
                        ) : (
                          <CustomSelect value={item.service} onChange={(val) => {
                              updateItem(item.id, 'service', val);
                              if (val === 'other (custom service)') toggleManual(item.id, 'service');
                          }} options={getServiceOptions(item.serviceCategory)} />
                        )}
                      </div>

                      {/* Duration */}
                      <div className="space-y-1.5 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'duration')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('duration') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('duration') ? (
                          <input type="text" placeholder="Type Duration" value={item.duration} onChange={(e) => updateItem(item.id, 'duration', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 shadow-sm" />
                        ) : (
                          <CustomSelect value={item.duration} onChange={(val) => {
                              updateItem(item.id, 'duration', val);
                              if (val === 'other (custom duration)') toggleManual(item.id, 'duration');
                          }} options={durationOptions} />
                        )}
                      </div>

                      {/* Item Category (Solo/Shared) */}
                      <div className="space-y-1.5 text-center">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Type *</label>
                          <button type="button" onClick={() => toggleManual(item.id, 'category')} className="text-[9px] font-black text-pink-500 uppercase tracking-tighter">
                            {item.manualFields?.includes('category') ? 'List' : 'Type'}
                          </button>
                        </div>
                        {item.manualFields?.includes('category') ? (
                          <input type="text" placeholder="Type Type" value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} className="w-full bg-pink-50/20 border-2 border-[#ee6996]/30 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-[#ee6996] transition-all font-bold text-slate-700 shadow-sm" />
                        ) : (
                          <CustomSelect value={item.category} onChange={(val) => {
                              updateItem(item.id, 'category', val);
                              if (val === 'other (custom item category)') toggleManual(item.id, 'category');
                          }} options={itemCategoryOptions} />
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Devices *</label>
                        <input type="text" placeholder="e.g., 1" value={item.devices} onChange={(e) => updateItem(item.id, 'devices', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-xs focus:outline-none focus:border-[#ee6996] font-bold text-slate-700 shadow-sm" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₱) *</label>
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-xs focus:outline-none focus:border-[#ee6996] text-emerald-600 font-bold shadow-sm" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity *</label>
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-xs focus:outline-none focus:border-[#ee6996] font-bold text-slate-700 shadow-sm" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount (₱)</label>
                        <input type="number" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', e.target.value)} className="w-full bg-pink-50/20 border-2 border-pink-100/30 rounded-2xl px-5 py-3.5 text-xs focus:outline-none focus:border-[#ee6996] text-red-500 font-bold shadow-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex gap-8">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-5 rounded-[2rem] font-bold transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSold}
                  disabled={isSubmitting}
                  className="flex-[2] bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (editingSaleId ? 'Updating...' : 'Recording Sales...') : (editingSaleId ? 'Update Sale' : 'Confirm Sales')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
