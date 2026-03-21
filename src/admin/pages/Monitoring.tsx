import { useState } from 'react';
import { Monitor, Activity, ShieldCheck, ExternalLink } from 'lucide-react';

interface MonitoredStock {
  id: string;
  service: string;
  email: string;
  status: 'Healthy' | 'Issue' | 'Checking';
  lastCheck: string;
  uptime: string;
}

export default function Monitoring() {
  const [stocks] = useState<MonitoredStock[]>([
    { id: '1', service: 'Netflix Premium', email: 'nf-01@xoxo.com', status: 'Healthy', lastCheck: '5 mins ago', uptime: '99.9%' },
    { id: '2', service: 'Disney+', email: 'dp-shared@xoxo.com', status: 'Checking', lastCheck: 'Just now', uptime: '98.5%' },
    { id: '3', service: 'Canva Pro', email: 'canva-edu@xoxo.com', status: 'Healthy', lastCheck: '12 mins ago', uptime: '100%' },
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="text-[#ee6996]" size={20} strokeWidth={3} />
              <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">System Monitoring</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">Real-time health status of all active accounts</p>
          </div>

          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-pink-50 text-[#ee6996] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-100 transition-all shadow-sm">
                <ShieldCheck size={14} strokeWidth={3} />
                Run Global Check
             </button>
          </div>
        </div>

        {/* Grid Area */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <div key={stock.id} className="bg-white border-2 border-pink-50/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-pink-100/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50/30 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex justify-between items-start mb-6 relative">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
                  <Monitor size={24} strokeWidth={2.5} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  stock.status === 'Healthy' ? 'bg-green-50 text-green-500' : 
                  stock.status === 'Checking' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                }`}>
                  {stock.status}
                </div>
              </div>

              <div className="space-y-1 mb-6 relative">
                <h3 className="text-sm font-black text-[#4a1d4a]">{stock.service}</h3>
                <p className="text-[11px] text-slate-400 font-bold truncate">{stock.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pink-50 relative">
                <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Uptime</p>
                   <p className="text-xs font-black text-slate-700">{stock.uptime}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Last Check</p>
                   <p className="text-xs font-black text-slate-700">{stock.lastCheck}</p>
                </div>
              </div>

              <button className="mt-6 w-full py-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-[#ee6996] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                 <ExternalLink size={12} strokeWidth={3} />
                 View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
