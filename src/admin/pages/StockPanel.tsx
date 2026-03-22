import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Eye, Check, Clock, ChevronRight, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { subscribeToStocks, updateStock } from '../../lib/stockService';
import { addSale, subscribeToSales, type Sale } from '../../lib/transactionService';

interface Stock {
  id: string;
  service: string;
  serviceCategory: string;
  duration: string;
  email: string;
  password: string;
  category: string;
  quantity: number;
  price: number;
  devices?: string[];
  slots?: Array<{ slot: string; pin: string }>;
  notes?: string;
  status: string;
  createdBy?: string;
  createdAt?: any;
}

export default function StockPanel() {
  const username = localStorage.getItem('username') || 'admin';
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [saleNotes, setSaleNotes] = useState('');
  const [saleStatus, setSaleStatus] = useState<'SOLD' | 'RESERVED'>('SOLD');

  // Load data from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubStocks = subscribeToStocks((firebaseStocks) => {
      // Filter for available stocks for the selling form
      const available = (firebaseStocks as Stock[]).filter(s => s.status === 'available');
      setStocks(available);
      setLoading(false);
    });

    const unsubSales = subscribeToSales((firebaseSales) => {
      setSales(firebaseSales.slice(0, 5)); // Just show last 5
    });

    return () => {
      unsubStocks();
      unsubSales();
    };
  }, []);

  const selectedStock = stocks.find(s => s.id === selectedStockId);

  const handleMarkAsSold = async () => {
    if (!selectedStock || !salePrice || !buyerName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const saleAmount = parseFloat(salePrice);

      // Add sale record
      await addSale({
        stockId: selectedStock.id,
        service: selectedStock.service,
        serviceCategory: selectedStock.serviceCategory,
        email: selectedStock.email,
        buyerName: buyerName,
        quantity: 1, // Default to 1 for manual stock panel sale
        price: selectedStock.price,
        totalPrice: saleAmount,
        adminName: username,
        status: saleStatus === 'SOLD' ? 'approved' : 'pending',
        notes: saleNotes,
        createdAt: new Date(),
      });

      // Update stock status
      await updateStock(selectedStock.id, {
        status: saleStatus === 'SOLD' ? 'sold' : 'reserved',
      });

      toast.success(saleStatus === 'SOLD' ? '✅ Stock marked as sold!' : '⏳ Stock reserved!');

      // Reset form
      setSelectedStockId('');
      setSalePrice('');
      setBuyerName('');
      setSaleNotes('');
      setSaleStatus('SOLD');
    } catch (error) {
      console.error('Error processing sale:', error);
      toast.error('❌ Failed to process sale');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['entertainment', 'educational', 'editing', 'other services'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. Stock Availability Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-[#4a1d4a]">Stock Availability</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(cat => {
              const count = stocks.filter(s => s.serviceCategory === cat).length;
              if (count === 0) return null;
              return (
                <div key={cat} className="bg-pink-50/30 rounded-2xl p-4 border border-pink-50 flex items-center justify-between group hover:bg-pink-50 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-[#ee6996] uppercase tracking-widest mb-1">{cat}</p>
                    <p className="text-sm font-bold text-slate-700">{count} services available</p>
                  </div>
                </div>
              );
            })}
            {stocks.length === 0 && !loading && (
              <p className="text-sm text-slate-400 italic col-span-3 text-center py-4">No available stocks</p>
            )}
            {loading && (
              <p className="text-sm text-pink-400 animate-pulse col-span-3 text-center py-4 font-bold uppercase tracking-widest">Loading...</p>
            )}
          </div>
        </div>
        
        <div className="px-8 py-5 bg-[#fff9fb] border-t border-pink-50 flex justify-between items-center">
          <span className="text-xs font-black text-[#ee6996] uppercase tracking-widest">Total Available Stock</span>
          <span className="text-sm font-black text-slate-700">
            {stocks.length} items
          </span>
        </div>
      </div>

      {/* 2. Sell Stock Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[#4a1d4a]">Sell Stock</h2>
        </div>

        <div className="space-y-6">
          {/* Select Stock */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Stock Account</label>
            <div className="relative">
              <select 
                value={selectedStockId}
                onChange={(e) => {
                  setSelectedStockId(e.target.value);
                  const s = stocks.find(x => x.id === e.target.value);
                  if (s) setSalePrice(s.price.toString());
                }}
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] bg-white text-sm font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Select a stock to sell...</option>
                {categories.map(cat => {
                  const catStocks = stocks.filter(s => s.serviceCategory === cat);
                  if (catStocks.length === 0) return null;
                  return (
                    <optgroup key={cat} label={cat.toUpperCase()}>
                      {catStocks.map(stock => (
                        <option key={stock.id} value={stock.id}>
                          {stock.service} - {stock.category} ({stock.email})
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
            </div>
          </div>

          {selectedStock && (
            <div className="bg-pink-50/20 rounded-2xl p-6 border border-pink-100 flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
               <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-pink-100 flex items-center justify-center text-[#ee6996]">
                      <Info size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Stock Info</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                      <p className="text-xs font-bold text-slate-600 truncate">{selectedStock.email}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                      <p className="text-xs font-black text-[#ee6996]">₱{selectedStock.price}</p>
                    </div>
                  </div>
               </div>
               <div className="w-px bg-pink-100 hidden md:block"></div>
               <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-pink-100 flex items-center justify-center text-[#ee6996]">
                      <Check size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Credentials</span>
                  </div>
                  <p className="text-xs font-mono text-slate-500 bg-white/50 p-2 rounded-lg border border-pink-50">
                    {selectedStock.password}
                  </p>
               </div>
            </div>
          )}

          {/* Sale Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sale Status</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSaleStatus('SOLD')}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl border-2 font-black text-xs tracking-widest uppercase transition-all shadow-sm ${
                  saleStatus === 'SOLD' 
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-600' 
                  : 'border-pink-50 bg-white text-slate-400'
                }`}
              >
                <Check size={16} strokeWidth={4} />
                SOLD
              </button>
              <button
                type="button"
                onClick={() => setSaleStatus('RESERVED')}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl border-2 font-black text-xs tracking-widest uppercase transition-all shadow-sm ${
                  saleStatus === 'RESERVED' 
                  ? 'border-blue-400 bg-blue-50 text-blue-600' 
                  : 'border-pink-50 bg-white text-slate-400'
                }`}
              >
                <Clock size={16} strokeWidth={3} />
                RESERVED
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buyer Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Buyer Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Name or Telegram"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] placeholder-slate-300 text-sm font-bold text-slate-700 shadow-sm"
              />
            </div>

            {/* Sale Price */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Final Sale Price <span className="text-pink-400">*</span>
              </label>
              <input
                type="number"
                placeholder="₱0.00"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] placeholder-slate-300 text-sm font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>

          {/* Sale Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
            <input
              type="text"
              placeholder="Any additional details..."
              value={saleNotes}
              onChange={(e) => setSaleNotes(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-pink-50 focus:outline-none focus:border-[#ee6996] placeholder-slate-300 text-sm font-bold text-slate-700 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleMarkAsSold}
              disabled={submitting || !selectedStockId}
              className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 ${
                submitting || !selectedStockId
                ? 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                : 'bg-[#ee6996] hover:bg-[#d55a84] text-white shadow-pink-200'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={4} />
                  Complete Transaction
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recent Transactions Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
            <Eye size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[#4a1d4a]">Recent Transactions</h2>
        </div>
        
        <div className="space-y-3">
          {sales.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm italic">No recent sales found</p>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-pink-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-pink-50 flex items-center justify-center text-[#ee6996] font-bold text-xs">
                    {sale.service.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{sale.buyerName}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{sale.service} • ₱{sale.totalPrice}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    sale.status === 'approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {sale.status === 'approved' ? 'SOLD' : 'RESERVED'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
