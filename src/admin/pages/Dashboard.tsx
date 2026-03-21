import { DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-pink-100 rounded-xl p-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Welcome back, Mir!</h2>
          <p className="text-sm text-gray-600 mt-1">XZ Shop Access - Inventory & Sales Management</p>
        </div>
        <div className="text-right text-xs text-gray-500 space-y-1">
          <p>Owner: @xzelise (Telegram)</p>
          <p>Channel: @xoxoelisee</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 mb-4">
            <DollarSign size={20} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Sales</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">₱0</h3>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">₱0</h3>
        </div>

        {/* Total Stock */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
            <BarChart2 size={20} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Stock</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">0</h3>
        </div>
      </div>



      {/* Bottom Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pending Transactions</p>
          <h3 className="text-3xl font-light text-pink-400 mt-2">0</h3>
        </div>

        {/* Approved Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Approved Sales</p>
          <h3 className="text-3xl font-light text-emerald-500 mt-2">0</h3>
        </div>

        {/* Refunded */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Refunded</p>
          <h3 className="text-3xl font-light text-red-500 mt-2">0</h3>
        </div>
      </div>
      
    </div>
  );
}
