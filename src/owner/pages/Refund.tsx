import { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Clock, Image as ImageIcon } from 'lucide-react';

interface RefundRequest {
  id: string;
  service: string;
  buyer: string;
  price: string;
  reason: string;
  requestedBy: string;
  status: 'Pending' | 'Refunded' | 'Rejected';
  receipt?: string;
}

export default function Refund() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState('');
  const [fileName, setFileName] = useState('');

  const [refunds] = useState<RefundRequest[]>([
    {
      id: '1',
      service: 'Netflix Premium',
      buyer: 'Juan Dela Cruz',
      price: '₱149',
      reason: 'Wrong account provided',
      requestedBy: 'Admin Sarah',
      status: 'Pending'
    },
    {
      id: '2',
      service: 'Canva Pro',
      buyer: 'Maria Clara',
      price: '₱499',
      reason: 'Feature not working',
      requestedBy: 'Staff Mark',
      status: 'Refunded',
      receipt: 'receipt_h82k.jpg'
    }
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-8 border-b border-pink-50">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Refunds</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium italic">Manage customer refund requests and receipts</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-200"
          >
            <Upload size={16} strokeWidth={3} />
            Upload Receipt
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Buyer</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reason</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Requested By</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Receipt</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <FileText size={32} className="text-gray-400 mb-2" />
                       <p className="text-gray-400 font-medium text-xs italic">No refund requests found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996] font-bold text-[10px]">
                          {refund.service.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{refund.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-600">{refund.buyer}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-[#ee6996]">{refund.price}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-xs text-slate-500 italic truncate max-w-[150px] mx-auto">"{refund.reason}"</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-lg uppercase">{refund.requestedBy}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        refund.status === 'Refunded' ? 'bg-green-50 text-green-500' :
                        refund.status === 'Rejected' ? 'bg-red-50 text-red-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        {refund.status === 'Refunded' ? <CheckCircle2 size={12} /> : 
                         refund.status === 'Rejected' ? <AlertCircle size={12} /> : 
                         <Clock size={12} />}
                        {refund.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {refund.receipt ? (
                        <button className="p-2 hover:bg-pink-50 rounded-xl text-[#ee6996] transition-all border border-pink-100 shadow-sm">
                          <ImageIcon size={14} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-300 italic">No receipt</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="text-[10px] font-black text-slate-400 hover:text-[#ee6996] transition-colors uppercase tracking-widest">
                          Details
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-pink-50">
            <div className="bg-white px-8 pt-8 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#4a1d4a]">Upload Refund Receipt</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-pink-50 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Refund</label>
                <select 
                  value={selectedRefund}
                  onChange={(e) => setSelectedRefund(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-pink-50 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ee6996] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a refund request...</option>
                  {refunds.filter(r => r.status === 'Pending').map(r => (
                    <option key={r.id} value={r.id}>{r.service} - {r.buyer} ({r.price})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipt Image</label>
                  <span className="text-[10px] text-pink-400 font-bold">(Max 5MB)</span>
                </div>
                
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-slate-50 border-2 border-dashed border-pink-100 group-hover:border-[#ee6996] rounded-2xl px-5 py-8 flex flex-col items-center justify-center gap-3 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#ee6996] shadow-sm border border-pink-50">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">{fileName || 'Choose file to upload'}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Drag and drop or click to browse</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={!selectedRefund || !fileName}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all ${
                  !selectedRefund || !fileName 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-[#ee6996] text-white shadow-pink-200/50 hover:bg-[#d55a84] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                Upload Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

