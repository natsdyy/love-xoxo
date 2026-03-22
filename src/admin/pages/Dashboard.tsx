import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart2, Clock, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react';
import { getUserDisplayName } from '../../lib/auth';
import { subscribeToSales, subscribeToRefunds, subscribeToCapital, type Sale, type Refund, type Capital } from '../../lib/transactionService';
import { subscribeToStocks, type Stock } from '../../lib/stockService';

export default function Dashboard() {
  const username = localStorage.getItem('username') || '';
  const userRole = localStorage.getItem('userRole');
  const isOwner = userRole === 'owner';
  const displayName = getUserDisplayName(username);

  const [sales, setSales] = useState<Sale[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [capitals, setCapitals] = useState<Capital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For Owner, we don't filter. For Admin, we filter by adminName.
    const unsubSales = subscribeToSales((data) => {
      if (isOwner) {
        setSales(data);
      } else {
        setSales(data.filter(s => s.adminName === displayName));
      }
    });

    const unsubStocks = subscribeToStocks((data) => setStocks(data));
    const unsubRefunds = subscribeToRefunds((data) => setRefunds(data));
    const unsubCapital = subscribeToCapital((data) => setCapitals(data));
    
    const timer = setTimeout(() => setLoading(false), 800);
    return () => {
      unsubSales();
      unsubStocks();
      unsubRefunds();
      unsubCapital();
      clearTimeout(timer);
    };
  }, [displayName, isOwner]);

  // Calculations
  const approvedSales = sales.filter(s => s.status === 'approved');
  const pendingSales = sales.filter(s => s.status === 'pending');
  const totalRevenue = approvedSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
  const totalStockCount = stocks.filter(s => s.status === 'available').length;
  
  // Salary/Profit (Only for Owner)
  const calculateTotals = () => {
    let totalProfit = 0;
    approvedSales.forEach(s => {
       const matchingCapital = capitals.find(c => 
        c.service.toLowerCase() === s.service.toLowerCase() &&
        c.category.toLowerCase() === s.serviceCategory.toLowerCase()
      );
      const capPrice = matchingCapital ? matchingCapital.price : 0;
      totalProfit += (s.totalPrice - capPrice);
    });
    return totalProfit;
  };

  const totalProfit = calculateTotals();
  const refundedCount = refunds.filter(r => r.status === 'completed' && (isOwner || sales.some(s => s.id === r.saleId))).length;

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-[#ee6996]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-bold uppercase tracking-widest opacity-40">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] rounded-[2.5rem] p-8 flex justify-between items-center shadow-xl shadow-pink-200 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight">Welcome back, {displayName}!</h2>
          <p className="text-sm text-white/80 mt-1 font-medium italic">Love, Xoxo • {isOwner ? 'Overseeing Business Operations' : 'Tracking Your Performance'}</p>
        </div>
        <div className="relative z-10 text-right text-[10px] text-white/60 space-y-0.5 uppercase font-black tracking-widest hidden md:block">
          <p>Owner: @xzelise (Telegram)</p>
          <p>Channel: @xoxoelisee</p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 group hover:border-[#ee6996] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996] mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{approvedSales.length}</h3>
          <div className="mt-2 h-1 w-12 bg-pink-100 rounded-full" />
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 group hover:border-emerald-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">₱{totalRevenue.toLocaleString()}</h3>
          <div className="mt-2 h-1 w-12 bg-emerald-100 rounded-full" />
        </div>

        {/* Total Profit (Owner) / Stock (Admin) */}
        {isOwner ? (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 group hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Profit</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">₱{totalProfit.toLocaleString()}</h3>
            <div className="mt-2 h-1 w-12 bg-blue-100 rounded-full" />
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 group hover:border-indigo-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <BarChart2 size={24} strokeWidth={2.5} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Stock</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{totalStockCount}</h3>
            <div className="mt-2 h-1 w-12 bg-indigo-100 rounded-full" />
          </div>
        )}

        {/* Pending Transactions */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 group hover:border-amber-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <Clock size={24} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{pendingSales.length}</h3>
          <div className="mt-2 h-1 w-12 bg-amber-100 rounded-full" />
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart Simulation (Dummy visuals but dynamic data) */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-[#4a1d4a] uppercase tracking-tighter">Business Overview</h3>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ee6996]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sales</span>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col gap-6">
              {isOwner ? (
                // Owner view: Show which admins are selling
                <div className="space-y-4">
                   {Array.from(new Set(sales.map(s => s.adminName))).slice(0, 4).map(name => {
                     const adminSales = sales.filter(s => s.adminName === name).length;
                     const percentage = Math.min(100, (adminSales / Math.max(1, sales.length)) * 100);
                     return (
                       <div key={name} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                             <span>{name}</span>
                             <span className="text-[#ee6996]">{adminSales} items</span>
                          </div>
                          <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                             <div className="bg-[#ee6996] h-full rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                       </div>
                     );
                   })}
                   {sales.length === 0 && <p className="text-center text-slate-300 text-xs italic py-10">No admin sales yet</p>}
                </div>
              ) : (
                // Admin view: Show recent sales activity
                <div className="space-y-4">
                   {approvedSales.slice(0, 5).map((s, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-pink-50/20 rounded-2xl border border-pink-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#ee6996] shadow-sm">
                              {s.service.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">{s.service}</span>
                              <span className="text-[10px] text-slate-400">{s.buyerName}</span>
                           </div>
                        </div>
                        <span className="text-xs font-black text-[#ee6996]">₱{s.totalPrice}</span>
                     </div>
                   ))}
                   {approvedSales.length === 0 && <p className="text-center text-slate-300 text-xs italic py-10">Your approved sales will appear here</p>}
                </div>
              )}
           </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refunds</p>
                <h4 className="text-2xl font-black text-slate-800">{refundedCount}</h4>
              </div>
           </div>

           <div className="bg-[#4a1d4a] rounded-[2rem] p-6 shadow-xl shadow-purple-900/10 flex flex-col justify-between text-white">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-pink-300 mb-4">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Team Performance</p>
                <h4 className="text-2xl font-black text-white">Excellent</h4>
              </div>
           </div>

           <div className="col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={24} />
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Monthly Growth</p>
                    <h4 className="text-xl font-black text-slate-800">+12.5%</h4>
                 </div>
              </div>
              <div className="flex gap-1">
                 {[40, 70, 50, 90, 60, 80].map((h, i) => (
                    <div key={i} className="w-1.5 bg-emerald-100 rounded-full self-end" style={{ height: `${h/2}px` }} />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
