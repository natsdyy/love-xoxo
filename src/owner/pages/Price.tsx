import { Tag } from 'lucide-react';

export default function Price() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-pink-100 text-pink-500 p-4 rounded-2xl mb-4">
        <Tag size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Price Management</h2>
      <p className="text-slate-500 max-w-sm">This page will allow the owner to manage the pricing of all services.</p>
    </div>
  );
}
