import { useState, useEffect } from 'react';
import { ChevronDown, X, Check, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { subscribeToStocks, updateStock, type Stock } from '../../lib/stockService';
import { addSale } from '../../lib/transactionService';


export default function StockPanel() {
  const username = localStorage.getItem('username') || 'unknown';
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [saleNotes, setSaleNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Get real-time stocks from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToStocks((firebaseStocks: Stock[]) => {
      // Only show available stocks
      const availableStocks = firebaseStocks.filter(s => s.status === 'available');
      setStocks(availableStocks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const selectedStock = stocks.find(s => s.id === selectedStockId);

  const handleMarkAsSold = async () => {
    if (!selectedStock || !salePrice) {
      toast.error('Please select a stock and enter sale price', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    setSubmitting(true);
    try {
      const saleAmount = parseFloat(salePrice);

      // Add sale record
      await addSale({
        stockId: (selectedStock.id as string) || '',
        service: selectedStock.service,
        serviceCategory: selectedStock.serviceCategory,
        email: selectedStock.email,
        buyerName: 'Owner Sale', // Or some other source if owner panel doesn't have a buyer name field
        quantity: 1,
        price: selectedStock.price,
        totalPrice: saleAmount,
        adminName: username,
        status: 'approved',
        notes: saleNotes,
        createdAt: new Date(),
      });

      // Update stock status to sold
      await updateStock(selectedStock.id || '', {
        status: 'sold',
      });

      toast.success('✅ Stock marked as sold!', {
        position: 'top-right',
        autoClose: 2000,
      });

      // Reset form
      setSelectedStockId('');
      setSalePrice('');
      setSaleNotes('');
      setShowDetails(false);
    } catch (error) {
      console.error('Error marking stock as sold:', error);
      toast.error('❌ Failed to mark stock as sold', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['entertainment', 'educational', 'editing', 'other services'];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-pink-50">
          <h1 className="text-xl font-bold text-slate-800 font-serif">Stock Panel</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium italic">Mark stocks as sold and record transactions</p>
        </div>

        {/* Form Body */}
        <div className="p-8 pb-12 space-y-6">
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-pink-100 border-t-[#ee6996] animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-medium">Loading stocks...</p>
              </div>
            </div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-12 bg-pink-50/20 rounded-2xl border border-dashed border-pink-100">
              <p className="text-slate-400 font-medium text-sm">No available stocks to sell</p>
              <p className="text-slate-300 text-xs mt-1">Add stocks from the "New Stocks" page first</p>
            </div>
          ) : (
            <>
              {/* Stock Selection by Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#ee6996] ml-1">Select Stock</label>
                <div className="relative">
                  <select 
                    value={selectedStockId}
                    onChange={(e) => {
                      setSelectedStockId(e.target.value);
                      setShowDetails(true);
                      setSalePrice('');
                      setSaleNotes('');
                    }}
                    className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3.5 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                  >
                    <option value="">Select a stock to sell...</option>
                    {categories.map(cat => {
                      const catStocks = stocks.filter(s => s.serviceCategory === cat);
                      return catStocks.length > 0 ? (
                        <optgroup key={cat} label={cat.toUpperCase()}>
                          {catStocks.map(stock => (
                            <option key={stock.id} value={stock.id}>
                              {stock.service} - {stock.category} - ₱{stock.price} (Qty: {stock.quantity})
                            </option>
                          ))}
                        </optgroup>
                      ) : null;
                    })}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Stock Details */}
              {showDetails && selectedStock && (
                <div className="bg-pink-50/30 border border-pink-100 rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-1 duration-200">
                  <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center">
                      <Info size={14} strokeWidth={2.5} />
                    </div>
                    Stock Details
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service</p>
                      <p className="text-sm font-bold text-slate-700">{selectedStock.service}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-sm font-bold text-slate-700">{selectedStock.duration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                      <p className="text-sm font-bold text-slate-700">{selectedStock.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Original Price</p>
                      <p className="text-sm font-bold text-[#ee6996]">₱{selectedStock.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                      <p className="text-sm font-bold text-slate-700">{selectedStock.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-bold text-slate-600 truncate">{selectedStock.email}</p>
                    </div>
                  </div>

                  {selectedStock.slots && selectedStock.slots.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Slot & Pin Info</p>
                      <div className="space-y-2">
                        {selectedStock.slots.map((slot, idx) => (
                          <div key={idx} className="flex gap-4 text-xs bg-white rounded-lg p-3">
                            <div>
                              <span className="font-black text-slate-400">Slot:</span>
                              <span className="font-bold text-slate-700 ml-2">{slot.slot}</span>
                            </div>
                            <div>
                              <span className="font-black text-slate-400">Pin:</span>
                              <span className="font-bold text-slate-700 ml-2">{slot.pin}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sale Information */}
              {showDetails && selectedStock && (
                <div className="space-y-4 pt-4 border-t border-pink-100">
                  <h3 className="font-bold text-slate-700 text-sm">Sale Information</h3>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Sale Price (₱) <span className="text-red-500">*</span></label>
                    <input 
                      type="number"
                      placeholder={`Original: ₱${selectedStock.price.toFixed(2)}`}
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      step="0.01"
                      className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Sale Notes (Optional)</label>
                    <textarea 
                      placeholder="Add any notes about this sale..."
                      value={saleNotes}
                      onChange={(e) => setSaleNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none font-medium"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowDetails(false);
                        setSelectedStockId('');
                        setSalePrice('');
                        setSaleNotes('');
                      }}
                      className="flex-1 py-3 rounded-2xl border-2 border-pink-100 text-slate-600 font-bold text-sm hover:bg-pink-50 transition-all"
                    >
                      <X size={16} className="inline mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleMarkAsSold}
                      disabled={submitting || !salePrice}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                        submitting || !salePrice
                          ? 'bg-gray-300 text-white cursor-not-allowed'
                          : 'bg-[#ee6996] text-white hover:bg-[#d95d85] shadow-pink-200/50'
                      }`}
                    >
                      <Check size={16} strokeWidth={3} />
                      {submitting ? 'Marking as Sold...' : 'Mark as Sold'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
