import { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wallet,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { subscribeToSales, subscribeToCapital, type Sale, type Capital } from '../../lib/transactionService';
import { getAllUsers } from '../../lib/firebaseAuth';

// --- Date Utilities ---
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, etc.
  d.setDate(d.getDate() - day); // Subtracting day gets us to Sunday
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(start: Date): Date {
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatWeekLabel(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
}

// Get all Mon-Sun weeks that cover a given month
function getWeeksForMonth(year: number, month: number): { start: Date; end: Date }[] {
  const weeks: { start: Date; end: Date }[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let weekStart = getWeekStart(firstDay);
  while (weekStart <= lastDay) {
    const weekEnd = getWeekEnd(weekStart);
    weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) });
    weekStart.setDate(weekStart.getDate() + 7);
  }
  return weeks;
}

function getWeeksForRange(startD: Date, endD: Date): { start: Date; end: Date }[] {
  const weeks: { start: Date; end: Date }[] = [];
  let weekStart = getWeekStart(startD);
  const finalEnd = getWeekEnd(endD);
  while (weekStart <= finalEnd) {
    const weekEnd = getWeekEnd(weekStart);
    weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) });
    weekStart.setDate(weekStart.getDate() + 7);
  }
  return weeks;
}

function getSaleDate(sale: Sale): Date {
  if (!sale.createdAt) return new Date(0);
  return sale.createdAt.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
}

export default function Salary() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [capitals, setCapitals] = useState<Capital[]>([]);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<{ id: string; displayName: string }[]>([]);
  const [expandedAdmins, setExpandedAdmins] = useState<Record<string, boolean>>({});

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    const unsubSales = subscribeToSales((data) => setSales(data));
    const unsubCapital = subscribeToCapital((data) => setCapitals(data));
    const timer = setTimeout(() => setLoading(false), 800);
    const fetchAdmins = async () => {
      const users = await getAllUsers();
      setAdmins(users.map(u => ({ id: u.id, displayName: u.displayName })));
    };
    fetchAdmins();
    return () => { unsubSales(); unsubCapital(); clearTimeout(timer); };
  }, []);

  const toggleAdmin = (name: string) =>
    setExpandedAdmins(prev => ({ ...prev, [name]: !prev[name] }));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // --- Salary Calculation ---
  const getTierRate = (profit: number) => {
    if (profit >= 1500) return 0.40;
    if (profit >= 1000) return 0.35;
    if (profit >= 500) return 0.30;
    return 0.20;
  };

  const getCapital = (sale: Sale) => {
    const cap = capitals.find(c =>
      c.service.toLowerCase() === sale.service.toLowerCase() &&
      c.serviceCategory?.toLowerCase() === sale.serviceCategory?.toLowerCase() &&
      c.duration.toLowerCase() === (sale.duration || '').toLowerCase() &&
      c.category.toLowerCase() === (sale.category || '').toLowerCase()
    );
    return cap ? (Number(cap.price) || 0) : 0;
  };

  const approvedSales = sales.filter(s => s.status === 'approved');

  // --- Current Week ---
  const currentWeekStart = getWeekStart(today);
  const currentWeekEnd = getWeekEnd(currentWeekStart);
  const currentWeekLabel = formatWeekLabel(currentWeekStart, currentWeekEnd);

  const getCurrentWeekMetrics = (adminName: string) => {
    const weekSales = approvedSales.filter(s => {
      const d = getSaleDate(s);
      return s.adminName === adminName && d >= currentWeekStart && d <= currentWeekEnd;
    });
    let sales_ = 0, profit = 0, salary = 0;
    weekSales.forEach(s => {
      const gross = Number(s.totalPrice) || 0;
      const cap = getCapital(s);
      const p = gross - cap;
      sales_ += gross;
      profit += p;
      salary += p * getTierRate(p);
    });
    return { sales: sales_, profit, salary };
  };

  // --- Monthly / Custom Weekly Breakdown per admin ---
  const isCustomRange = filterStartDate && filterEndDate;
  const weeks = isCustomRange
    ? getWeeksForRange(new Date(filterStartDate), new Date(filterEndDate))
    : getWeeksForMonth(viewYear, viewMonth);

  const getWeekMetrics = (adminName: string, weekStart: Date, weekEnd: Date) => {
    const weekSales = approvedSales.filter(s => {
      const d = getSaleDate(s);
      return s.adminName === adminName && d >= weekStart && d <= weekEnd;
    });
    let grossSales = 0, capitalTotal = 0, profit = 0, salary = 0;
    weekSales.forEach(s => {
      const gross = Number(s.totalPrice) || 0;
      const cap = getCapital(s);
      const p = gross - cap;
      grossSales += gross;
      capitalTotal += cap;
      profit += p;
      salary += p * getTierRate(p);
    });
    return { count: weekSales.length, grossSales, capitalTotal, profit, salary };
  };

  const getMonthlyTotal = (adminName: string) => {
    return weeks.reduce((acc, w) => {
      const m = getWeekMetrics(adminName, w.start, w.end);
      acc.sales += m.grossSales;
      acc.capital += m.capitalTotal;
      acc.profit += m.profit;
      acc.salary += m.salary;
      return acc;
    }, { sales: 0, capital: 0, profit: 0, salary: 0 });
  };

  const activeAdminNames = admins.map(a => a.displayName);
  const salesAdminNames = Array.from(new Set(approvedSales.filter(s => s.adminName).map(s => s.adminName)));
  const allAdminNames = Array.from(new Set([...activeAdminNames, ...salesAdminNames]));

  // Global totals for current month
  const globalMonthly = allAdminNames.reduce((acc, adminName) => {
    const m = getMonthlyTotal(adminName);
    acc.profit += m.profit;
    acc.salary += m.salary;
    return acc;
  }, { profit: 0, salary: 0 });

  // Colors palette
  const colors = ['bg-[#ee6996]', 'bg-purple-400', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-[#ee6996]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-bold uppercase tracking-widest opacity-40">Calculating Salary...</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-20 space-y-10">

      {/* ── Current Week ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-3 px-1">
          <Calendar className="text-[#ee6996]" size={20} strokeWidth={2.5} />
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Current Week</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">({currentWeekLabel})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allAdminNames.map((adminName, i) => {
            const m = getCurrentWeekMetrics(adminName);
            const isUnregistered = !activeAdminNames.includes(adminName);
            return (
              <div key={adminName} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50 hover:shadow-lg hover:shadow-pink-100 transition-all duration-300">
                <div className="flex items-center gap-4 mb-7">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base ${colors[i % colors.length]}`}>
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-700 leading-tight">
                      {adminName}
                    </h3>
                    {isUnregistered && (
                       <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">Unregistered</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-400 text-[11px]">Sales</span>
                    <span className="font-black text-slate-700">₱{m.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-400 text-[11px]">Profit</span>
                    <span className="font-black text-emerald-500">₱{m.profit.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-pink-50 flex justify-between items-center">
                    <span className="font-black text-slate-600 text-[11px] uppercase tracking-wider">Weekly Salary</span>
                    <span className="text-lg font-black text-[#ee6996]">₱{m.salary.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {allAdminNames.length === 0 && (
            <div className="col-span-full py-12 bg-pink-50/20 rounded-[2.5rem] border-2 border-dashed border-pink-100 flex items-center justify-center">
              <p className="text-slate-400 font-bold italic">No admins found</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Global Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-emerald-500 rounded-[2rem] p-8 shadow-lg shadow-emerald-100 flex items-center gap-6 text-white overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
            <TrendingUp size={120} strokeWidth={3} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <TrendingUp size={28} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Global Net Profit</p>
            <p className="text-3xl font-black">₱{globalMonthly.profit.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-[#ee6996] rounded-[2rem] p-8 shadow-lg shadow-pink-100 flex items-center gap-6 text-white overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
            <Wallet size={120} strokeWidth={3} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet size={28} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Combined Salary Liabilities</p>
            <p className="text-3xl font-black">₱{globalMonthly.salary.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ── Monthly / Custom Range Breakdown per Admin ── */}
      <section className="space-y-5">
        {/* Controls Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between px-1 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
            <TrendingUp className="text-[#ee6996] flex-shrink-0" size={20} strokeWidth={2.5} />
            <h2 className="text-xl font-black text-slate-800 tracking-tight truncate">
              {isCustomRange ? 'Custom Range' : 'Monthly'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             {/* Custom Date Pickers */}
             <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className={`bg-white border-2 rounded-2xl px-3 py-2 text-xs font-bold focus:outline-none transition-all shadow-sm ${
                  filterStartDate ? 'border-[#ee6996] text-[#ee6996]' : 'border-pink-50 text-slate-500'
                }`}
                title="Start Date"
              />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">to</span>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className={`bg-white border-2 rounded-2xl px-3 py-2 text-xs font-bold focus:outline-none transition-all shadow-sm ${
                  filterEndDate ? 'border-[#ee6996] text-[#ee6996]' : 'border-pink-50 text-slate-500'
                }`}
                title="End Date"
              />
              {(filterStartDate || filterEndDate) && (
                <button
                  onClick={() => { setFilterStartDate(''); setFilterEndDate(''); }}
                  className="text-[10px] font-black text-slate-400 hover:text-red-400 uppercase tracking-widest pl-2"
                >
                  Clear
                </button>
              )}
             </div>

            {/* Month Navigator (Hide if using proper custom range) */}
            {!isCustomRange && (
              <div className="flex items-center gap-3 bg-pink-50/40 px-4 py-2 rounded-2xl border border-pink-100/50">
                <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#ee6996] shadow-sm hover:scale-110 active:scale-95 transition-all">
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <span className="text-sm font-black text-[#4a1d4a] min-w-[140px] text-center">{monthLabel}</span>
                <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#ee6996] shadow-sm hover:scale-110 active:scale-95 transition-all">
                  <ChevronRight size={16} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Per-admin weekly breakdown */}
        <div className="space-y-4">
          {allAdminNames.map((adminName, i) => {
            const isExpanded = expandedAdmins[adminName] !== false; // default expanded
            const monthly = getMonthlyTotal(adminName);
            const isUnregistered = !activeAdminNames.includes(adminName);
            return (
              <div key={adminName} className="bg-white rounded-[2rem] border border-pink-50 shadow-sm overflow-hidden">
                {/* Admin Header */}
                <button
                  onClick={() => toggleAdmin(adminName)}
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-pink-50/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm ${colors[i % colors.length]}`}>
                      {adminName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-[#ee6996]">
                        {adminName}'s Weekly Breakdown {isUnregistered && <span className="text-[9px] ml-1 bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded text-slate-500 font-bold">Unreg</span>}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isCustomRange ? 'Range Total' : 'Monthly Total'}: ₱{monthly.salary.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Net Profit</p>
                      <p className="text-sm font-black text-emerald-500">₱{monthly.profit.toFixed(2)}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#ee6996] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} strokeWidth={3} />
                    </div>
                  </div>
                </button>

                {/* Weekly Table */}
                {isExpanded && (
                  <div className="overflow-x-auto border-t border-pink-50/50">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fff9fb]">
                          <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Week</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Sales</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Capital</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Profit</th>
                          <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Salary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50/30">
                        {weeks.map((w, wi) => {
                          const m = getWeekMetrics(adminName, w.start, w.end);
                          return (
                            <tr key={wi} className="hover:bg-pink-50/10 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2">
                                  {m.count > 0 && (
                                    <span className="text-[8px] font-black text-white bg-[#ee6996] rounded-full px-1.5 py-0.5 mt-0.5">
                                      {m.count}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold text-slate-600 leading-tight">
                                    {formatWeekLabel(w.start, w.end)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className="text-[11px] font-black text-slate-700">₱{m.grossSales.toLocaleString()}</span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className="text-[11px] font-black text-slate-400">₱{m.capitalTotal.toLocaleString()}</span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className={`text-[11px] font-black ${m.profit > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                                  ₱{m.profit.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className={`text-[11px] font-black ${m.salary > 0 ? 'text-[#ee6996]' : 'text-slate-300'}`}>
                                  ₱{m.salary.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {/* Monthly Total Row */}
                        <tr className="bg-pink-50/30 border-t-2 border-pink-100">
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                              {isCustomRange ? 'Range Total' : `Monthly Total (${new Date(viewYear, viewMonth).toLocaleString('en-US', { month: 'long' })})`}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-[11px] font-black text-slate-700">₱{monthly.sales.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-[11px] font-black text-slate-500">—</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-[11px] font-black text-emerald-600">₱{monthly.profit.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-[#ee6996]">₱{monthly.salary.toFixed(2)}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
          {allAdminNames.length === 0 && (
            <div className="py-12 bg-pink-50/20 rounded-[2.5rem] border-2 border-dashed border-pink-100 flex items-center justify-center">
              <p className="text-slate-400 font-bold italic">No admins registered yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
