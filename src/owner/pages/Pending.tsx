import { useState, useEffect } from 'react';
import { Clock, Search, Filter, CheckCircle2, XCircle, User, Loader2, Info } from 'lucide-react';
import { subscribeToSales, updateSale, deleteSale, type Sale } from '../../lib/transactionService';
import { updateStock } from '../../lib/stockService';
import { toast } from 'react-toastify';

export default function Pending() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSales((allSales) => {
      const pendingSales = allSales.filter(s => s.status === 'pending');
      setSales(pendingSales);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredSales = sales.filter(s => 
    s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (sale: Sale) => {
    if (!sale.id || !sale.stockId) return;
    setProcessingId(sale.id);
    try {
      await updateSale(sale.id, { 
        status: 'approved',
        approvedAt: new Date()
      });
      await updateStock(sale.stockId, { status: 'sold' });
      toast.success('Reservation approved and finalized!');
    } catch (error) {
      toast.error('Failed to approve reservation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (sale: Sale) => {
    if (!sale.id || !sale.stockId) return;
    if (!window.confirm('Are you sure you want to cancel this reservation? Stock will be marked as available again.')) return;
    
    setProcessingId(sale.id);
    try {
      await updateStock(sale.stockId, { status: 'available' });
      await deleteSale(sale.id);
      toast.info('Reservation cancelled. Stock is now available.');
    } catch (error) {
      toast.error('Failed to cancel reservation');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Pending Section</h1>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="text-[#ee6996]" size={14} strokeWidth={2.5} />
            <span className="text-slate-500 text-xs font-medium italic">Reserved items waiting for receipt/approval</span>
            <span className="font-bold text-[#ee6996] text-xs ml-1">{sales.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-2 border-pink-50 rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border-2 border-pink-50 rounded-2xl text-gray-400 hover:text-[#ee6996] transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden min-h-[400px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#fff9fb] border-b border-pink-50 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">
          <div className="col-span-2">Service</div>
          <div className="col-span-2 text-center">Email</div>
          <div className="col-span-2 text-center">Buyer</div>
          <div className="col-span-1 text-center">Category</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Reserved By</div>
          <div className="col-span-1 text-center">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-pink-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center text-[#ee6996]">
               <Loader2 size={32} className="animate-spin mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest opacity-40">Fetching pending items...</p>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
              <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center mb-4">
                  <Clock className="text-[#ee6996]" size={32} />
              </div>
              <p className="text-slate-500 font-bold text-sm">No Pending Reservations Found</p>
              <p className="text-slate-400 text-xs mt-1 italic">Items marked as 'Reserved' will appear here</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div key={sale.id} className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-pink-50/10 transition-colors group">
                <div className="col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                      {sale.service.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{sale.service}</span>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-600 truncate block px-2">{sale.email}</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold text-slate-500">{sale.buyerName}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-[10px] font-bold text-[#ee6996] uppercase tracking-wider bg-pink-50 px-2 rounded-lg truncate">
                    {sale.serviceCategory}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm font-black text-slate-700">₱{sale.totalPrice}</span>
                </div>
                <div className="col-span-1 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest border border-slate-100">
                    <User size={10} />
                    {sale.adminName}
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-[10px] text-slate-400 font-medium italic">
                    {sale.createdAt?.toDate ? sale.createdAt.toDate().toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                   <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(sale)}
                        disabled={processingId === sale.id}
                        className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all shadow-sm border border-green-100 disabled:opacity-50"
                        title="Approve / Finalize"
                      >
                         {processingId === sale.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      </button>
                      <button 
                        onClick={() => handleCancel(sale)}
                        disabled={processingId === sale.id}
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100 disabled:opacity-50"
                        title="Cancel Reservation"
                      >
                         <XCircle size={16} />
                      </button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
