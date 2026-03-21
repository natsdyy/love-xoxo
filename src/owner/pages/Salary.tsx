import { useState } from 'react';

interface SalaryRecord {
  admin: string;
  sales: number;
  profit: string;
  salary: string;
}

export default function Salary() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  
  const records: SalaryRecord[] = [
    { admin: 'admin_cherry', sales: 0, profit: '₱0.00', salary: '₱0.00' },
    { admin: 'admin_mlr', sales: 0, profit: '₱0.00', salary: '₱0.00' },
    { admin: 'admin_slca', sales: 0, profit: '₱0.00', salary: '₱0.00' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#4a1d4a] mb-6 px-2 tracking-tight">Salary Breakdown</h1>
      
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden mb-8">
        {/* Weekly Header */}
        <div className="px-10 py-8 border-b border-pink-50">
           <h2 className="text-sm font-bold text-gray-800 tracking-tight">Current Week</h2>
           <p className="text-[10px] font-bold text-[#ee6996] uppercase tracking-widest mt-0.5">Mar 15 - Mar 21, 2026</p>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Admin</th>
                <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Sales</th>
                <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Profit</th>
                <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Weekly Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-pink-50/20 transition-colors">
                  <td className="px-10 py-5 text-sm font-bold text-gray-700">{record.admin}</td>
                  <td className="px-10 py-5 text-sm font-medium text-gray-500">{record.sales}</td>
                  <td className="px-10 py-5 text-sm font-bold text-gray-800">{record.profit}</td>
                  <td className="px-10 py-5 text-sm font-black text-[#ee6996]">{record.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs at bottom */}
      <div className="flex gap-2 p-1 bg-white inline-flex rounded-full shadow-sm border border-pink-50">
        <button 
          onClick={() => setActiveTab('weekly')}
          className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'weekly' 
            ? 'bg-[#ee6996] text-white shadow-md shadow-pink-200' 
            : 'text-gray-400 hover:text-pink-500'
          }`}
        >
          Weekly Breakdown
        </button>
        <button 
          onClick={() => setActiveTab('monthly')}
          className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'monthly' 
            ? 'bg-[#ee6996] text-white shadow-md shadow-pink-200' 
            : 'text-gray-400 hover:text-[#ee6996]'
          }`}
        >
          Monthly Breakdown
        </button>
      </div>
    </div>
  );
}
