import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { subscribeToStocks, updateRelatedStocks, type Stock } from '../../lib/stockService';
import { addSale } from '../../lib/transactionService';


export default function StockPanel() {
  const username = localStorage.getItem('username') || 'unknown';
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [saleNotes, setSaleNotes] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{slot: string, pin: string} | null>(null);
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  const [quantity, setQuantity] = useState('1');
  const [saleStatus, setSaleStatus] = useState<'SOLD' | 'RESERVED'>('SOLD');
  const [buyerName, setBuyerName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

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
    const newErrors: string[] = [];
    if (!selectedStockId) newErrors.push('stock');
    if (!buyerName) newErrors.push('buyer');
    if (selectedStock?.devices?.length && !selectedDevice) newErrors.push('device');
    if (selectedStock?.slots?.length && !selectedSlot) newErrors.push('slot');
    if (receiptFiles.length === 0) newErrors.push('receipt');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      setTimeout(() => setErrors([]), 2000);
      return;
    }

    setSubmitting(true);
    try {
      const saleAmount = parseFloat(salePrice) || 0;

      if (!selectedStock) return;

      // Add sale record
      await addSale({
        stockId: (selectedStock.id as string) || '',
        service: selectedStock.service,
        serviceCategory: selectedStock.serviceCategory,
        email: selectedStock.email,
        buyerName: buyerName,
        quantity: parseInt(quantity) || 1,
        price: selectedStock.price,
        totalPrice: saleAmount,
        adminName: username,
        status: saleStatus === 'SOLD' ? 'approved' : 'pending',
        notes: `
          ${selectedDevice ? `Device: ${selectedDevice}` : ''}
          ${selectedSlot ? `Slot: ${selectedSlot.slot} (Pin: ${selectedSlot.pin})` : ''}
          ${saleNotes}
        `.trim(),
        createdAt: new Date(),
      });

      // Update stock status to sold (Shared quantity logic)
      await updateRelatedStocks(selectedStock.email, selectedStock.password, {
        status: saleStatus === 'SOLD' ? 'sold' : 'reserved',
      });

      toast.success(saleStatus === 'SOLD' ? '✅ Stock marked as sold!' : '⏳ Stock reserved!');

      // Reset form
      setSelectedStockId('');
      setSalePrice('');
      setBuyerName('');
      setSaleNotes('');
      setSaleStatus('SOLD');
      setSelectedDevice('');
      setSelectedSlot(null);
      setQuantity('1');
      setReceiptFiles([]);
    } catch (error) {
      console.error('Error marking stock as sold:', error);
      toast.error('❌ Failed to mark stock as sold');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['entertainment', 'educational', 'editing', 'other services'];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-pink-50 bg-[#fff9fb]/50">
          <h1 className="text-2xl font-black text-[#4a1d4a] tracking-tight">Stock Panel</h1>
          <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Mark stocks as sold and record transactions</p>
        </div>

        {/* Form Body */}
        <div className="p-10 space-y-8">
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-pink-100 border-t-[#ee6996] animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading stocks...</p>
              </div>
            </div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-20 bg-pink-50/10 rounded-[2rem] border-2 border-dashed border-pink-100">
              <p className="text-slate-400 font-bold text-sm">No available stocks to sell</p>
              <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest mt-2">Add stocks from the "New Stocks" page first</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Select Stock */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 ml-1">Stock Email</label>
                <div className="relative group">
                  <select 
                    value={selectedStockId}
                    onChange={(e) => {
                      setSelectedStockId(e.target.value);
                      const s = stocks.find(x => x.id === e.target.value);
                      if (s) {
                        setSalePrice(s.price.toString());
                        setSelectedDevice('');
                        setSelectedSlot(null);
                        setErrors(prev => prev.filter(err => err !== 'stock'));
                      }
                    }}
                    className={`w-full px-5 py-4 rounded-[1.25rem] border-2 focus:outline-none focus:border-[#ee6996] bg-white text-sm font-bold text-slate-600 appearance-none cursor-pointer shadow-sm transition-all ${
                      errors.includes('stock') ? 'border-error animate-shake' : 'border-pink-100'
                    }`}
                  >
                    <option value="">Select an account...</option>
                    {categories.map(cat => {
                      const catStocks = stocks.filter(s => s.serviceCategory === cat);
                      if (catStocks.length === 0) return null;
                      return (
                        <optgroup key={cat} label={cat.toUpperCase()}>
                          {catStocks.map(stock => (
                            <option key={stock.id} value={stock.id}>
                              {stock.email} ({stock.service} - {stock.duration})
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                    <ChevronRight className="rotate-90" size={18} />
                  </div>
                </div>
                            </div>
              {selectedStock && (
                <>
                  <div className="border-2 border-pink-100 rounded-[1.5rem] p-6 space-y-4 bg-white/50 backdrop-blur-sm">
                      <h3 className="text-xs font-black text-[#ee6996] uppercase tracking-[0.15em] mb-4">Details of the Account</h3>
                      <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-3">
                        <span className="text-xs font-black text-[#ee6996] uppercase tracking-[0.1em]">Email</span>
                        <span className="text-xs font-bold text-slate-600">{selectedStock.email}</span>
                        
                        <span className="text-xs font-black text-[#ee6996] uppercase tracking-[0.1em]">Password</span>
                        <span className="text-xs font-bold text-slate-600">{selectedStock.password}</span>
                        
                        <div className="col-span-2 h-px bg-pink-50 my-1"></div>

                        <span className="text-xs font-black text-[#ee6996] uppercase tracking-[0.1em]">Service</span>
                        <span className="text-xs font-bold text-slate-600">{selectedStock.service}</span>
                        
                        <span className="text-xs font-black text-[#ee6996] uppercase tracking-[0.1em]">Duration</span>
                        <span className="text-xs font-bold text-slate-600">{selectedStock.duration}</span>
                        
                        <span className="text-xs font-black text-[#ee6996] uppercase tracking-[0.1em]">Price</span>
                        <span className="text-xs font-black text-slate-700">₱{selectedStock.price}</span>
                        
                        <span className="text-xs font-black text-[#ee6996] uppercase tracking-[0.1em]">Available</span>
                        <span className="text-xs font-bold text-slate-600">{selectedStock.quantity}</span>
                      </div>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">Status</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSaleStatus('SOLD')}
                        className={`flex-1 py-4 rounded-[1rem] border-2 font-black text-xs tracking-[0.2em] uppercase transition-all shadow-sm ${
                          saleStatus === 'SOLD' 
                          ? 'bg-[#ee6996] border-[#ee6996] text-white' 
                          : 'bg-white border-pink-100 text-[#ee6996]'
                        }`}
                      >
                        SOLD
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaleStatus('RESERVED')}
                        className={`flex-1 py-4 rounded-[1rem] border-2 font-black text-xs tracking-[0.2em] uppercase transition-all shadow-sm ${
                          saleStatus === 'RESERVED' 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-blue-100 text-blue-500'
                        }`}
                      >
                        RESERVED
                      </button>
                    </div>
                  </div>

                  {/* Device Selection (Buttons) */}
                  {selectedStock.devices && selectedStock.devices.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-700 ml-1">Device <span className="text-[#ee6996]">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {selectedStock.devices.map((device) => (
                          <button
                            key={device}
                            type="button"
                            onClick={() => {
                              setSelectedDevice(device);
                              setErrors(prev => prev.filter(e => e !== 'device'));
                            }}
                            className={`px-6 py-2.5 rounded-[0.8rem] border-2 font-black text-[10px] tracking-[0.05em] uppercase transition-all ${
                              selectedDevice === device
                                ? 'bg-[#ee6996] border-[#ee6996] text-white'
                                : errors.includes('device')
                                  ? 'bg-white border-error text-red-500 animate-shake'
                                  : 'bg-white border-pink-100 text-[#ee6996] hover:bg-pink-50/50'
                            }`}
                          >
                            {device}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Selection (Buttons) */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">Category <span className="text-[#ee6996]">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`px-6 py-2.5 rounded-[0.8rem] border-2 bg-[#ee6996] border-[#ee6996] text-white font-black text-[10px] tracking-[0.05em] uppercase transition-all`}
                      >
                        {selectedStock.category}
                      </button>
                    </div>
                  </div>

                  {/* Slot & Pin Selection (Buttons) */}
                  {selectedStock.slots && selectedStock.slots.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-700 ml-1">Slot & Pin <span className="text-[#ee6996]">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {selectedStock.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot);
                              setErrors(prev => prev.filter(e => e !== 'slot'));
                            }}
                            className={`px-6 py-2.5 rounded-[0.8rem] border-2 font-black text-[10px] tracking-[0.05em] transition-all ${
                              selectedSlot?.slot === slot.slot
                                ? 'bg-[#ee6996] border-[#ee6996] text-white'
                                : errors.includes('slot')
                                  ? 'bg-white border-error text-red-500 animate-shake'
                                  : 'bg-white border-pink-100 text-[#ee6996] hover:bg-pink-50/50'
                            }`}
                          >
                            {slot.slot} - {slot.pin}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buyer Name */}
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-700 ml-1">Buyer Name <span className="text-[#ee6996]">*</span></label>
                     <input
                        type="text"
                        placeholder="Enter buyer name"
                        value={buyerName}
                        onChange={(e) => {
                          setBuyerName(e.target.value);
                          if (e.target.value) setErrors(prev => prev.filter(err => err !== 'buyer'));
                        }}
                        className={`w-full px-5 py-4 rounded-[1.25rem] border-2 bg-[#fff9fb] focus:outline-none focus:border-[#ee6996] placeholder-slate-300 text-sm font-bold text-slate-700 shadow-sm ${
                          errors.includes('buyer') ? 'border-error animate-shake' : 'border-pink-50'
                        }`}
                      />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-700 ml-1">Quantity <span className="text-[#ee6996]">*</span></label>
                     <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-5 py-4 rounded-[1.25rem] border-2 border-pink-50 bg-[#fff9fb] focus:outline-none focus:border-[#ee6996] text-sm font-bold text-slate-700 shadow-sm"
                      />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">
                      Image of Receipt / Screenshot <span className="text-[#ee6996]">*</span> <span className="text-[10px] text-pink-400 lowercase italic ml-1">(Max 10)</span>
                    </label>
                    <div className="relative group">
                      <div className={`flex items-center gap-4 w-full px-5 py-4 rounded-[1.25rem] border-2 bg-white shadow-sm transition-all group-hover:border-pink-200 ${
                        errors.includes('receipt') ? 'border-error animate-shake' : 'border-pink-50'
                      }`}>
                        <label className="cursor-pointer px-6 py-2 bg-pink-50 border-2 border-pink-100 rounded-[1rem] text-[10px] font-black text-[#ee6996] uppercase tracking-widest hover:bg-pink-100 transition-colors">
                          Choose Files
                          <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files).slice(0, 10);
                                setReceiptFiles(files);
                                if (files.length > 0) setErrors(prev => prev.filter(err => err !== 'receipt'));
                              }
                            }}
                          />
                        </label>
                        <span className="text-xs font-bold text-slate-400">
                          {receiptFiles.length > 0 ? receiptFiles.map(f => f.name).join(', ') : 'No file chosen'}
                        </span>
                      </div>
                      {receiptFiles.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-pink-400 mt-3 ml-2 italic">
                            {receiptFiles.length} file(s) selected
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {receiptFiles.map((file, idx) => {
                              const previewUrl = URL.createObjectURL(file);
                              return (
                                <div key={idx} className="relative aspect-square rounded-2xl border-2 border-pink-50 overflow-hidden bg-white group shadow-sm">
                                  <img 
                                    src={previewUrl} 
                                    alt={`preview-${idx}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setReceiptFiles(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-500 shadow-sm border border-pink-50 hover:bg-white hover:scale-110 transition-all"
                                  >
                                    <X size={14} strokeWidth={3} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleMarkAsSold}
                      disabled={submitting || !selectedStockId}
                      className={`w-full py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.25em] transition-all shadow-xl flex items-center justify-center gap-3 ${
                        submitting || !selectedStockId
                        ? 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#ee6996] to-[#f58eb2] hover:from-[#d55a84] hover:to-[#ee6996] text-white shadow-pink-200/50'
                      }`}
                    >
                      {submitting ? 'Processing...' : 'Submit for Approval'}
                    </button>
                  </div>
                </>
                            )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
