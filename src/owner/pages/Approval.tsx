import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Check, X, ImageIcon, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { subscribeToSales, updateSale, deleteSale, type Sale } from '../../lib/transactionService';
import { updateStock } from '../../lib/stockService';

export default function Approval() {
  const [pendingSales, setPendingSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSales((sales) => {
      setPendingSales(sales.filter(s => s.status === 'pending'));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (sale: Sale) => {
    if (!sale.id) return;
    setProcessingId(sale.id);
    try {
      await updateSale(sale.id, { 
        status: 'approved',
        approvedAt: new Date()
      });

      // Update the corresponding stock inventory
      if (sale.stockId) {
        const stockRef = doc(db, 'stocks', sale.stockId);
        const stockSnap = await getDoc(stockRef);
        
        if (stockSnap.exists()) {
          const currentStock = stockSnap.data();
          const newQty = Math.max(0, (currentStock.quantity || 1) - sale.quantity);
          
          await updateStock(sale.stockId, {
            quantity: newQty,
            status: newQty === 0 ? 'sold' : currentStock.status
          });
        }
      }

      toast.success(`Approved sale for ${sale.buyerName}`);
    } catch (error) {
      console.error('Error approving sale:', error);
      toast.error('Failed to approve sale');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (sale: Sale) => {
    if (!sale.id) return;
    if (!confirm(`Are you sure you want to reject and delete this sale for ${sale.buyerName}?`)) return;
    
    setProcessingId(sale.id);
    try {
      await deleteSale(sale.id);

      // Revert the stock status back to available if it was temporarily reserved
      if (sale.stockId) {
        const stockRef = doc(db, 'stocks', sale.stockId);
        const stockSnap = await getDoc(stockRef);
        if (stockSnap.exists()) {
          const currentStock = stockSnap.data();
          if (currentStock.status === 'reserved') {
            await updateStock(sale.stockId, { status: 'available' });
          }
        }
      }

      toast.success('Sale rejected and deleted');
    } catch (error) {
      console.error('Error rejecting sale:', error);
      toast.error('Failed to reject sale');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 pb-12">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Pending Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">Review and approve submitted sales</p>
        </div>
        <div className="bg-pink-100 text-[#ee6996] px-4 py-1.5 rounded-full text-sm font-bold">
          {pendingSales.length} Pending
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-[#ee6996] animate-spin" />
        </div>
      ) : pendingSales.length === 0 ? (
        <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 p-12 flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-pink-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
          <p className="text-slate-500 text-sm mt-1">There are no pending sales waiting for approval.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingSales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden flex flex-col md:flex-row">
              {/* Receipt Image Section */}
              <div className="w-full md:w-64 bg-slate-50 border-r border-pink-50/50 p-4 flex flex-col">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Receipts</h4>
                {sale.receipt && sale.receipt.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 h-full content-start">
                    {sale.receipt.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewImage(url)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-pink-100 hover:ring-2 hover:ring-[#ee6996] transition-all group"
                      >
                        <img 
                          src={url} 
                          alt="Receipt" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 min-h-[120px] bg-white rounded-xl border border-dashed border-slate-200">
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Pending</span>
                      <span className="text-xs font-bold text-slate-400">by {sale.adminName}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#4a1d4a]">{sale.buyerName}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#ee6996]">₱{sale.totalPrice}</div>
                    <div className="text-xs font-bold text-slate-400">Qty: {sale.quantity}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-6 flex-1 bg-slate-50 rounded-2xl p-4">
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Service</span>
                    <span className="font-bold text-slate-700">{sale.service} - {sale.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account</span>
                    <span className="font-bold text-slate-700 truncate block">{sale.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Notes</span>
                    <span className="font-medium text-slate-600 inline-block bg-white px-3 py-1.5 rounded-lg border border-slate-100 w-full">{sale.notes || 'None'}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleReject(sale)}
                    disabled={processingId === sale.id}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === sale.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(sale)}
                    disabled={processingId === sale.id}
                    className="flex-[2] py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-[#ee6996] to-[#f58eb2] hover:shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {processingId === sale.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewImage} 
              alt="Receipt Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
