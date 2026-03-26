import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Receipt,
  User,
  DollarSign,
  Loader2
} from 'lucide-react';
import { getUserDisplayName } from '../../lib/auth';
import { subscribeToSales, subscribeToCapital, type Sale, type Capital } from '../../lib/transactionService';

export default function Salary() {
  const username = localStorage.getItem('username') || '';
  const isAdmin = window.location.pathname.startsWith('/admin');
  const userDisplayName = getUserDisplayName(username);

  const [sales, setSales] = useState<Sale[]>([]);
  const [capitals, setCapitals] = useState<Capital[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }));

  useEffect(() => {
    const unsubSales = subscribeToSales((data) => setSales(data));
    const unsubCapital = subscribeToCapital((data) => setCapitals(data));
    
    // Wait a bit for both to fetch
    const timer = setTimeout(() => setLoading(false), 1000);
    
    return () => {
      unsubSales();
      unsubCapital();
      clearTimeout(timer);
    };
  }, []);

  const getTierRate = (profit: number) => {
    if (profit >= 1500) return 0.40;
    if (profit >= 1000) return 0.35;
    if (profit >= 500) return 0.30;
    return 0.20;
  };

  // Grouping logic for Admin vs Owner
  const targetSales = isAdmin ? sales.filter(s => s.adminName === userDisplayName) : sales;
  const approvedSales = targetSales.filter(s => s.status === 'approved');

  // Simple profit logic: 
  // For each sale, we find a matching capital price based on service/duration/category
  const calculateSalaryData = () => {
    let totalGross = 0;
    let totalCapital = 0;
    let totalProfit = 0;
    let totalSalary = 0;

    const breakdown = approvedSales.map(s => {
      const matchingCapital = capitals.find(c => 
        c.service.toLowerCase() === s.service.toLowerCase() &&
        c.serviceCategory?.toLowerCase() === s.serviceCategory?.toLowerCase() &&
        c.duration.toLowerCase() === s.duration?.toLowerCase() &&
        c.category.toLowerCase() === s.category?.toLowerCase()
      );
      
      const capPrice = matchingCapital ? (Number(matchingCapital.price) || 0) : 0;
      const salesPrice = Number(s.totalPrice) || 0;
      const profit = salesPrice - capPrice;
      const rate = getTierRate(profit);
      const salary = profit * rate;

      totalGross += salesPrice;
      totalCapital += capPrice;
      totalProfit += profit;
      totalSalary += salary;

      return {
        ...s,
        totalPrice: salesPrice, // Ensure numeric
        profit,
        salary
      };
    });

    return { totalGross, totalCapital, totalProfit, totalSalary, breakdown };
  };

  const { totalProfit, totalSalary, breakdown } = calculateSalaryData();

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-[#ee6996]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-bold uppercase tracking-widest opacity-40">Calculating Salary...</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#ee6996] rounded-[2rem] p-6 shadow-lg shadow-pink-100 flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Partner</p>
            <p className="text-xl font-black">{isAdmin ? userDisplayName : 'Owner / All Partners'}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Net Profit</p>
            <p className="text-2xl font-black text-slate-800">₱{totalProfit.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
            <Wallet size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Salary</p>
            <p className="text-2xl font-black text-slate-800">₱{totalSalary.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden mb-8">
        {/* Header Section */}
        <div className="px-8 py-8 border-b border-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#4a1d4a] tracking-tight">Salary Breakdown</h1>
            <p className="text-xs text-slate-500 font-medium italic">Detailed earnings based on actual sales</p>
          </div>

          <div className="flex items-center gap-4 bg-pink-50/50 p-2 rounded-2xl">
            <button className="p-2 hover:bg-white rounded-xl text-[#ee6996] transition-all shadow-sm disabled:opacity-30">
              <ChevronLeft size={16} strokeWidth={3} />
            </button>
            <span className="text-xs font-black text-[#ee6996] uppercase tracking-widest">{currentMonth}</span>
            <button className="p-2 hover:bg-white rounded-xl text-[#ee6996] transition-all shadow-sm disabled:opacity-30">
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Gross Sales</th>
                {!isAdmin && <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Admin</th>}
                <th className="px-6 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-center">Net Profit</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#ee6996] uppercase tracking-widest text-right">Partner Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {breakdown.length === 0 ? (
                <tr>
                   <td colSpan={isAdmin ? 4 : 5} className="px-8 py-20 text-center text-slate-300 italic text-sm">No approved sales this period</td>
                </tr>
              ) : (
                breakdown.map((data, idx) => (
                  <tr key={idx} className="hover:bg-pink-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#ee6996]">
                          <Calendar size={14} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-700 text-sm">{data.service}</span>
                           <span className="text-[10px] text-slate-400 italic">{(data as any).duration || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-400">₱{data.totalPrice.toLocaleString()}</span>
                    </td>
                    {!isAdmin && (
                      <td className="px-6 py-5 text-center">
                        <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-1 rounded-lg uppercase border border-slate-100">{data.adminName}</span>
                      </td>
                    )}
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-emerald-500">₱{data.profit.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-black text-[#ee6996] bg-pink-50 px-3 py-1 rounded-lg">
                        ₱{data.salary.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-pink-50/30">
                <td colSpan={isAdmin ? 2 : 3} className="px-8 py-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Calculation</p>
                </td>
                <td className="px-6 py-6 text-center">
                   <p className="text-lg font-black text-emerald-600">₱{totalProfit.toLocaleString()}</p>
                </td>
                <td className="px-8 py-6 text-right">
                   <p className="text-lg font-black text-[#ee6996]">₱{totalSalary.toLocaleString()}</p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Formula & Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-pink-50 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#ee6996]">
                <Receipt size={20} />
              </div>
              <h3 className="font-black text-[#4a1d4a] uppercase tracking-tight text-sm">Calculation Logic</h3>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">1</div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   <span className="text-slate-700 font-bold">Net Profit</span> is calculated by subtracting matching capital price from individual gross sale.
                 </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">2</div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   <span className="text-pink-600 font-bold">Salary</span> is determined by tiers based on the profit of each individual sale.
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-[#4a1d4a] rounded-[2rem] p-8 shadow-xl shadow-purple-900/10 text-white">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-pink-300">
                <DollarSign size={20} />
              </div>
              <h3 className="font-black text-white uppercase tracking-tight text-sm">Commission Tiers</h3>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Below ₱500', rate: '20%' },
                { label: '₱500 - ₱999', rate: '30%' },
                { label: '₱1,000 - ₱1,499', rate: '35%' },
                { label: '₱1,500+', rate: '40%' }
              ].map((tier, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all">
                   <span className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">{tier.label}</span>
                   <span className="text-sm font-black text-pink-300">{tier.rate}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
