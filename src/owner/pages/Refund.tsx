import { Upload } from 'lucide-react';

export default function Refund() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Refunds</h1>
          <button className="bg-[#ee6996] hover:bg-[#d55a84] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-pink-200">
            <Upload size={18} />
            Upload Receipt
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb] border-y border-pink-50">
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Buyer</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Price</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Reason</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Requested By</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Receipt</th>
                <th className="px-8 py-4 text-[11px] font-black text-[#ee6996] uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td colSpan={8} className="px-8 py-20 text-center">
                  <p className="text-[#ee6996] font-bold text-sm">No refunds</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
