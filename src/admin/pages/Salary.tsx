import { 
  Wallet, 
  Calendar,
  LineChart,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

export default function Salary() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      
      {/* 1. Top Hero Banner */}
      <div className="bg-pink-100/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-pink-500 text-white p-3 rounded-xl shadow-sm">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Salary Overview</h1>
            <p className="text-sm text-pink-600/80 font-medium">Mir's salary breakdown</p>
          </div>
        </div>
        
        <div className="bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm text-xs font-medium text-slate-600 space-y-1">
          <p>Weekly: Sunday → Saturday</p>
          <p>Monthly: Sum of all weekly salaries</p>
        </div>
      </div>

      {/* 2. Current Week Section */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-pink-50/30 flex items-center gap-2 border-b border-pink-50">
          <Calendar size={16} className="text-pink-500" />
          <h2 className="text-sm font-semibold text-slate-700">Current Week <span className="text-slate-400 font-normal">(March 15 - March 21)</span></h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-medium text-sm shadow-sm ring-2 ring-pink-100">
              M
            </div>
            <span className="font-semibold text-slate-700">Mir</span>
          </div>
          
          <div className="space-y-3 pl-11">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Sales</span>
              <span className="font-semibold text-slate-700">₱0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Profit</span>
              <span className="font-bold text-emerald-500">₱0</span>
            </div>
            <div className="w-full h-[1px] bg-slate-100 my-1"></div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-slate-700 font-semibold">Weekly Salary</span>
              <span className="font-bold text-pink-600 text-base">₱0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Monthly Salary Section */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-pink-50">
          <div className="flex items-center gap-2">
            <LineChart size={18} className="text-pink-500" />
            <h2 className="text-[15px] font-semibold text-slate-700">Monthly Salary</h2>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors"><ChevronLeft size={16} /></button>
            March 2026
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-pink-500 font-semibold text-sm">
              <TrendingUp size={16} />
              Mir's Weekly Breakdown
            </div>
            <div className="text-pink-500 font-bold text-sm">
              Monthly Total: ₱0
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium">
                  <th className="text-left py-3 font-semibold pb-4">Week</th>
                  <th className="text-right py-3 font-semibold pb-4">Sales</th>
                  <th className="text-right py-3 font-semibold pb-4">Capital</th>
                  <th className="text-right py-3 font-semibold pb-4">Profit</th>
                  <th className="text-right py-3 font-semibold pb-4 text-pink-600">Salary</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                {['March 1 - March 7', 'March 8 - March 14', 'March 15 - March 21', 'March 22 - March 28', 'March 29 - April 4'].map((week, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-slate-500 relative pl-4">
                      <span className="absolute left-0 text-slate-300">•</span>
                      {week}
                    </td>
                    <td className="text-right py-3">₱0</td>
                    <td className="text-right py-3">₱0</td>
                    <td className="text-right py-3 text-emerald-500 font-bold">₱0</td>
                    <td className="text-right py-3 text-pink-500 font-bold">₱0</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-pink-50/50 font-bold border-t-2 border-pink-100">
                  <td className="py-4 text-slate-700 pl-4 rounded-bl-xl">Monthly Total (March)</td>
                  <td className="text-right py-4">₱0</td>
                  <td className="text-right py-4 text-slate-400">—</td>
                  <td className="text-right py-4 text-emerald-500">₱0</td>
                  <td className="text-right py-4 text-pink-600 rounded-br-xl">₱0</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Salary Rates Section */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-pink-500" />
          <h2 className="text-[15px] font-semibold text-slate-800">Salary Rates</h2>
        </div>

        <div className="text-xs font-medium space-y-1.5 text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p><span className="text-slate-700 font-bold">Formula:</span> Profit = Sales - Capital <span className="px-2 text-pink-400">→</span> Salary = Profit × Percentage (per week)</p>
          <p><span className="text-slate-700 font-bold">Monthly Salary</span> = Sum of all weekly salaries in the month</p>
        </div>

        <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-5">
          <h3 className="text-sm font-bold text-pink-600 mb-4">Mir's Rates</h3>
          
          <div className="space-y-3 font-medium text-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span>Below ₱499</span>
              <span className="text-pink-500 font-bold">20%</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>₱500 - ₱999</span>
              <span className="text-pink-500 font-bold">30%</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>₱1,000 - ₱1,499</span>
              <span className="text-pink-500 font-bold">35%</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>₱1,500+</span>
              <span className="text-pink-500 font-bold">40%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
