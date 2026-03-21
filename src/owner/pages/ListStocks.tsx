import { List } from 'lucide-react';

export default function ListStocks() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-pink-100 text-pink-500 p-4 rounded-2xl mb-4">
        <List size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">List of Stocks</h2>
      <p className="text-slate-500 max-w-sm">This page will show a detailed list of all stocks available in the shop.</p>
    </div>
  );
}
