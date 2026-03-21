import { UserCheck } from 'lucide-react';

export default function Approval() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-pink-100 text-pink-500 p-4 rounded-2xl mb-4">
        <UserCheck size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Approvals</h2>
      <p className="text-slate-500 max-w-sm">This page will manage approvals for sales and other actions.</p>
    </div>
  );
}
