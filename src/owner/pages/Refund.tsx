import { useState, useEffect } from 'react';
import { RotateCcw, Search, Filter, Image as ImageIcon, User, AlertCircle, CheckCircle2, Loader2, X, Upload } from 'lucide-react';
import { subscribeToRefunds, updateRefund, updateSale, type Refund } from '../../lib/transactionService';
import { toast } from 'react-toastify';

export default function Refund() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRefunds((fetchedRefunds) => {
      setRefunds(fetchedRefunds);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredRefunds = refunds.filter(rf => 
    rf.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rf.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRefundedAmount = refunds
    .filter(rf => rf.status === 'completed')
    .reduce((sum, rf) => sum + rf.refundAmount, 0);

  const pendingCount = refunds.filter(rf => rf.status === 'pending').length;

  const handleCompleteRefund = async () => {
    if (!selectedRefund || !selectedRefund.id || !selectedRefund.saleId) return;
    setProcessingId(selectedRefund.id);
    try {
      await updateRefund(selectedRefund.id, { 
        status: 'completed',
        completedAt: new Date()
      });
      await updateSale(selectedRefund.saleId, { status: 'refunded' });
      toast.success('Refund marked as completed');
      setIsModalOpen(false);
      setSelectedRefund(null);
    } catch (error) {
      toast.error('Failed to update refund');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
            <RotateCcw size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Refunded</p>
            <p className="text-2xl font-black text-slate-800">₱{totalRefundedAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
            <AlertCircle size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Requests</p>
            <p className="text-2xl font-black text-slate-800">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Refund History</h1>
            <p className="text-xs text-slate-500 font-medium italic">Items deducted from total sales records</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee6996] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search refunds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-pink-50 rounded-2xl pl-11 pr-5 py-2 text-sm focus:outline-none focus:border-[#ee6996] transition-all w-full md:w-64 shadow-sm"
              />
            </div>
            <button className="p-2.5 bg-pink-50 text-[#ee6996] rounded-xl hover:bg-pink-100 transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Buyer</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reason</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#ee6996]">
                       <Loader2 size={32} className="animate-spin mb-4" />
                       <p className="text-sm font-bold uppercase tracking-widest opacity-40">Loading refunds...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRefunds.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <RotateCcw size={32} className="text-gray-400 mb-2" />
                       <p className="text-gray-400 font-medium text-xs italic">No refund records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((rf) => (
                  <tr key={rf.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {rf.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{rf.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-500">{rf.buyerName}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-[#ee6996]">₱{rf.refundAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs text-slate-400 italic truncate max-w-[150px] mx-auto">"{rf.reason}"</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rf.status === 'completed' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'
                      }`}>
                        {rf.status === 'completed' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {rf.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        {rf.createdAt?.toDate ? rf.createdAt.toDate().toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       {rf.status === 'pending' ? (
                         <button 
                           onClick={() => { setSelectedRefund(rf); setIsModalOpen(true); }}
                           className="bg-[#ee6996] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d55a84] transition-all"
                         >
                            Process
                         </button>
                       ) : (
                         <span className="text-[10px] text-slate-300 italic">No actions</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Modal */}
      {isModalOpen && selectedRefund && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#4a1d4a]">Process Refund</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="space-y-4 mb-8">
               <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service</p>
                  <p className="text-sm font-bold text-slate-700">{selectedRefund.service}</p>
               </div>
               <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Refund Amount</p>
                  <p className="text-lg font-black text-[#ee6996]">₱{selectedRefund.refundAmount.toLocaleString()}</p>
               </div>
               <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                  <p className="text-xs text-slate-600 italic">"{selectedRefund.reason}"</p>
               </div>
            </div>

            <button 
              onClick={handleCompleteRefund}
              disabled={!!processingId}
              className="w-full bg-[#ee6996] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#d55a84] transition-all shadow-xl shadow-pink-200 flex items-center justify-center gap-2"
            >
               {processingId ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
               Complete Refund
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
