import { useState, useEffect } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { subscribeToStocks, updateStock, type Stock } from '../../lib/stockService';
import { addSale } from '../../lib/transactionService';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function StockPanel() {
  const username = localStorage.getItem('username') || 'unknown';
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // New Form State
  const [status, setStatus] = useState<'sold' | 'reserved'>('sold');
  const [device, setDevice] = useState('');
  const [category, setCategory] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [saleNotes, setSaleNotes] = useState('');

  // Get real-time stocks from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToStocks((firebaseStocks) => {
      const availableStocks = firebaseStocks.filter(s => s.status === 'available');
      setStocks(availableStocks);
      setLoading(false);
    });

    return () => unsubscribe();
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
      setReceiptFiles(Array.from(e.target.files));
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
    if (!selectedStock || !buyerName || !quantity) {
      toast.error('Please fill in all required fields (*)', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    setSubmitting(true);
    try {
      const receiptUrls = await uploadReceipts();
      
      // Add sale record in pending status
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
        status: 'pending', // Labeled as "Submit for Approval"
        receipt: receiptUrls,
        notes: `Device: ${device}${saleNotes ? ` - ${saleNotes}` : ''}`,
        createdAt: new Date(),
      });

      // Update stock status to reserved if it's a reservation, or keep as available until approved?
      // Usually, when "Submit for Approval" is clicked, we might want to reserve it so others can't see it.
      if (status === 'reserved') {
        await updateStock(selectedStock.id!, { status: 'reserved' });
      }

      toast.success('✅ Sale submitted for approval!', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Reset form
      setSelectedStockId('');
      setBuyerName('');
      setQuantity('1');
      setReceiptFiles([]);
      setSaleNotes('');
    } catch (error) {
      console.error('Error submitting sale:', error);
      toast.error('❌ Failed to submit sale', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const serviceCategories = ['entertainment', 'educational', 'editing', 'other services'];

  return (
    <div className="max-w-xl mx-auto pb-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100/50 border border-pink-50 overflow-hidden">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-pink-50/50 text-center">
          <h1 className="text-2xl font-black text-[#ee6996] tracking-tight">Stock Panel</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">Mark stocks as sold and record transactions</p>
        </div>

        {/* Form Body */}
        <div className="p-10 space-y-8">
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-pink-50 border-t-[#ee6996] animate-spin" />
            </div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-12 bg-pink-50/20 rounded-3xl border border-dashed border-pink-100">
              <p className="text-slate-400 font-bold text-sm italic">No available stocks to sell</p>
            </div>
          ) : (
            <>
              {/* Select Stock Email */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Email</label>
                <div className="relative group">
                  <select 
                    value={selectedStockId}
                    onChange={(e) => {
                      setSelectedStockId(e.target.value);
                    }}
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

              {/* Details of the account */}
              {selectedStock && (
                <div className="bg-pink-50/30 rounded-[2rem] border-2 border-pink-50/50 p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-widest border-b border-pink-100/50 pb-3">Details of the account</h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'EMAIL', value: selectedStock.email, color: 'text-pink-400' },
                      { label: 'PASSWORD', value: selectedStock.password },
                      { label: 'SERVICE', value: selectedStock.service },
                      { label: 'DURATION', value: selectedStock.duration },
                      { label: 'PRICE', value: `₱${selectedStock.price}`, color: 'text-[#ee6996] font-black' },
                      { label: 'DEVICES', value: `${selectedStock.devices?.[0] || 1} Screen(s)`, color: 'text-[#ee6996]' },
                      { label: 'AVAILABLE', value: selectedStock.quantity },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-black text-slate-400 tracking-wider">{item.label}</span>
                        <span className={`font-bold ${item.color || 'text-slate-600'} text-right truncate max-w-[150px]`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Controls */}
              {selectedStock && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Status Toggle */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
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

                  {/* Device Selector */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Device <span className="text-[#ee6996]">*</span></label>
                    <div className="flex gap-3">
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
                            className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
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

                  {/* Category Selector - synced from stock */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category <span className="text-[#ee6996]">*</span></label>
                    <button
                      className="w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 bg-pink-100 border-[#ee6996] text-[#ee6996] shadow-sm cursor-default"
                    >
                      {selectedStock.category}
                    </button>
                    <p className="text-[9px] font-bold text-slate-400 italic ml-1">Category is set from the original stock entry.</p>
                  </div>

                  {/* Buyer Name */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Buyer Name <span className="text-[#ee6996]">*</span></label>
                    <input 
                      type="text"
                      placeholder="Enter buyer name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-pink-200/50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity <span className="text-[#ee6996]">*</span></label>
                    <input 
                      type="number"
                      placeholder="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-pink-200/50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#ee6996] transition-all"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Image of Receipt / Screenshot <span className="text-[#ee6996]">*</span></label>
                      <span className="text-[9px] font-black text-pink-300 uppercase tracking-tighter">(Max 10)</span>
                    </div>
                    <label className="relative flex flex-col items-center justify-center w-full h-20 bg-slate-50 border-2 border-dashed border-pink-200 rounded-2xl cursor-pointer hover:bg-pink-50/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] group-hover:scale-110 transition-transform">
                          <Upload size={14} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-black text-[#ee6996] uppercase tracking-widest">
                          {receiptFiles.length > 0 ? `${receiptFiles.length} Files Selected` : 'Choose Files'}
                        </span>
                        {receiptFiles.length === 0 && <span className="text-[9px] font-bold text-slate-300 italic ml-1 leading-none -mb-0.5">no files selected</span>}
                      </div>
                      <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitApproval}
                    disabled={submitting || !buyerName}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] ${
                      submitting || !buyerName
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-[#ee6996] to-[#f58eb2] text-white shadow-pink-200/50 hover:scale-[1.02]'
                    }`}
                  >
                    {submitting ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
