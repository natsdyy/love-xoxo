import { useState, useEffect } from 'react';
import { ChevronDown, Upload, Package, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { subscribeToStocks, updateRelatedStocks, type Stock } from '../../lib/stockService';
import { addSale, subscribeToSales, type Sale } from '../../lib/transactionService';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function StockPanel() {
  const username = localStorage.getItem('username') || 'admin';
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [status, setStatus] = useState<'sold' | 'reserved'>('sold');
  const [device, setDevice] = useState('');
  const [category, setCategory] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [saleNotes, setSaleNotes] = useState('');

  // Load data from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubStocks = subscribeToStocks((firebaseStocks) => {
      const available = (firebaseStocks as Stock[]).filter(s => s.status === 'available');
      setStocks(available);
      setLoading(false);
    });

    const unsubSales = subscribeToSales((firebaseSales) => {
      setRecentSales(firebaseSales.slice(0, 5));
    });

    return () => {
      unsubStocks();
      unsubSales();
    };
  }, []);

  const selectedStock = stocks.find(s => s.id === selectedStockId);

  // Initialize form when stock is selected
  useEffect(() => {
    if (selectedStock) {
      const maxDevices = parseInt(selectedStock.devices?.[0] || '1');
      setDevice(`${maxDevices} Device${maxDevices > 1 ? 's' : ''}`);
      setCategory(selectedStock.category || 'solo profile');
    }
  }, [selectedStock]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReceiptFiles(Array.from(e.target.files).slice(0, 10));
    }
  };

  const uploadReceipts = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of receiptFiles) {
      const storageRef = ref(storage, `receipts/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmitApproval = async () => {
    if (!selectedStock || !buyerName || !quantity || receiptFiles.length === 0) {
      toast.error('Please fill in all required fields (marked *) and upload at least one receipt');
      return;
    }

    setSubmitting(true);
    try {
      const receiptUrls = await uploadReceipts();
      
      // Add sale record
      await addSale({
        stockId: selectedStock.id!,
        service: selectedStock.service,
        serviceCategory: selectedStock.serviceCategory,
        duration: selectedStock.duration,
        category: category,
        email: selectedStock.email,
        buyerName: buyerName,
        quantity: parseInt(quantity) || 1,
        price: selectedStock.price,
        totalPrice: selectedStock.price * (parseInt(quantity) || 1),
        adminName: username,
        status: status === 'sold' ? 'approved' : 'pending',
        receipt: receiptUrls,
        notes: `Device: ${device}${saleNotes ? ` - ${saleNotes}` : ''}`,
        createdAt: new Date(),
      });

      // Update related stocks (Shared quantity logic)
      await updateRelatedStocks(selectedStock.email, selectedStock.password, {
        status: status === 'sold' ? 'sold' : 'reserved',
      });

      toast.success(status === 'sold' ? '✅ Stock marked as sold!' : '⏳ Stock reserved!');

      // Reset form
      setSelectedStockId('');
      setBuyerName('');
      setQuantity('1');
      setReceiptFiles([]);
      setSaleNotes('');
    } catch (error) {
      console.error('Error processing sale:', error);
      toast.error('❌ Failed to process sale');
    } finally {
      setSubmitting(false);
    }
  };

  const serviceCategories = ['entertainment', 'educational', 'editing', 'other services'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. Stock Availability Summary */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Stock Availability</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">Real-time inventory overview</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {serviceCategories.map(cat => {
              const count = stocks.filter(s => s.serviceCategory === cat).length;
              return (
                <div key={cat} className="bg-pink-50/20 rounded-2xl p-5 border border-pink-50/50 hover:bg-pink-50 transition-all group">
                  <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">{cat}</p>
                  <p className="text-lg font-black text-slate-700">{count}</p>
                  <p className="text-[9px] font-bold text-slate-400">Available</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Sell Stock Panel */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100/50 border border-pink-50 overflow-hidden">
        <div className="px-10 py-8 border-b border-pink-50/50 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
              <ShoppingCart size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-[#ee6996] tracking-tight">Sell Stock</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">Submit sales for approval or mark as sold</p>
        </div>

        <div className="p-10 space-y-8">
          {loading ? (
             <div className="flex items-center justify-center py-12">
               <div className="w-10 h-10 rounded-full border-4 border-pink-50 border-t-[#ee6996] animate-spin" />
             </div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-12 bg-pink-50/20 rounded-3xl border border-dashed border-pink-100 italic text-slate-400 text-sm">
              No available stocks to sell
            </div>
          ) : (
            <>
              {/* Select Stock Email */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Email</label>
                <div className="relative group">
                  <select 
                    value={selectedStockId}
                    onChange={(e) => setSelectedStockId(e.target.value)}
                    className="w-full bg-white border-2 border-pink-100 rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-600 appearance-none focus:outline-none focus:border-[#ee6996] transition-all shadow-sm group-hover:border-pink-200"
                  >
                    <option value="">Select email...</option>
                    {serviceCategories.map(cat => {
                      const catStocks = stocks.filter(s => s.serviceCategory === cat);
                      return catStocks.length > 0 ? (
                        <optgroup key={cat} label={cat.toUpperCase()} className="font-black text-[10px] text-slate-300">
                          {catStocks.map(stock => (
                            <option key={stock.id} value={stock.id} className="text-slate-600 font-bold">
                              {stock.email} ({stock.service} - {stock.duration})
                            </option>
                          ))}
                        </optgroup>
                      ) : null;
                    })}
                  </select>
                  <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-300 pointer-events-none transition-transform group-focus-within:rotate-180" />
                </div>
              </div>

              {selectedStock && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Stock Details */}
                  <div className="bg-pink-50/30 rounded-[2rem] border-2 border-pink-50/50 p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-widest border-b border-pink-100/50 pb-3">Details of the account</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {[
                        { label: 'SERVICE', value: selectedStock.service },
                        { label: 'DURATION', value: selectedStock.duration },
                        { label: 'CATEGORY', value: selectedStock.category },
                        { label: 'PRICE', value: `₱${selectedStock.price}`, weight: 'font-black text-[#ee6996]' },
                        { label: 'DEVICES', value: `${selectedStock.devices?.[0] || 1} Screen(s)`, weight: 'font-black text-[#ee6996]' },
                        { label: 'AVAILABLE', value: selectedStock.quantity },
                        { label: 'EMAIL', value: selectedStock.email, size: 'col-span-2 truncate' },
                      ].map((item, i) => (
                        <div key={i} className={item.size || ''}>
                          <p className="text-[10px] font-black text-slate-400 tracking-wider mb-1 uppercase">{item.label}</p>
                          <p className={`text-xs ${item.weight || 'font-bold'} text-slate-700`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status <span className="text-[#ee6996]">*</span></label>
                    <div className="flex gap-3">
                      {['SOLD', 'RESERVED'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(s.toLowerCase() as any)}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            status === s.toLowerCase()
                              ? 'bg-[#ee6996] border-[#ee6996] text-white shadow-lg shadow-pink-200'
                              : 'bg-white border-pink-50 text-pink-300 hover:border-pink-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Device & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Device <span className="text-[#ee6996]">*</span></label>
                        <div className="flex gap-2 flex-wrap">
                          {(() => {
                            const maxDevices = parseInt(selectedStock.devices?.[0] || '1');
                            const options = [];
                            for (let i = maxDevices; i >= 1; i--) {
                              options.push(`${i} Device${i > 1 ? 's' : ''}`);
                            }
                            return options.map((d) => (
                              <button
                                key={d}
                                onClick={() => setDevice(d)}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                  device === d
                                    ? 'bg-pink-100 border-[#ee6996] text-[#ee6996] shadow-sm'
                                    : 'bg-white border-pink-50 text-slate-400 hover:border-pink-100'
                                }`}
                              >
                                {d}
                              </button>
                            ));
                          })()}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category <span className="text-[#ee6996]">*</span></label>
                        <button
                          className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 bg-pink-100 border-[#ee6996] text-[#ee6996] shadow-sm cursor-default"
                        >
                          {selectedStock.category}
                        </button>
                        <p className="text-[9px] font-bold text-slate-400 italic ml-1">Category is set from the original stock entry.</p>
                     </div>
                  </div>

                  {/* Buyer & Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Buyer Name <span className="text-[#ee6996]">*</span></label>
                      <input 
                        type="text"
                        placeholder="Enter buyer name"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-pink-50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ee6996] transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity <span className="text-[#ee6996]">*</span></label>
                      <input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-pink-50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ee6996] transition-all"
                      />
                    </div>
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Image of Receipt / Screenshot <span className="text-[#ee6996]">*</span></label>
                      <span className="text-[9px] font-black text-pink-300 uppercase italic leading-none">(Max 10)</span>
                    </div>
                    <label className="relative flex flex-col items-center justify-center w-full h-24 bg-slate-50 border-2 border-dashed border-pink-200 rounded-[1.5rem] cursor-pointer hover:bg-pink-50/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] group-hover:scale-110 transition-transform shadow-sm">
                          <Upload size={18} strokeWidth={3} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black text-[#ee6996] uppercase tracking-widest">
                            {receiptFiles.length > 0 ? `${receiptFiles.length} Files Selected` : 'Choose Files'}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 italic">No file chosen</p>
                        </div>
                      </div>
                      <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitApproval}
                    disabled={submitting || !selectedStockId}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.25em] transition-all active:scale-[0.98] shadow-2xl ${
                      submitting || !selectedStockId
                        ? 'bg-slate-100 text-slate-300 shadow-none'
                        : 'bg-gradient-to-r from-[#ee6996] to-[#f58eb2] text-white shadow-pink-200/50 hover:scale-[1.01]'
                    }`}
                  >
                    {submitting ? 'Processing...' : status === 'sold' ? 'Complete Transaction' : 'Submit for Approval'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3. Recent Transactions */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Eye size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Transactions</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Last 5 records</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-pink-50/30 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#ee6996] font-black shadow-sm">
                  {sale.service.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700">{sale.buyerName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sale.service} • {sale.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#ee6996] mb-1">₱{sale.totalPrice}</p>
                <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                  sale.status === 'approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {sale.status === 'approved' ? 'SOLD' : 'RESERVED'}
                </span>
              </div>
            </div>
          ))}
          {recentSales.length === 0 && (
            <p className="text-center py-8 text-slate-400 text-xs italic font-bold">No recent sales records</p>
          )}
        </div>
      </div>

    </div>
  );
}
