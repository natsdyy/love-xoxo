export default function Approval() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#4a1d4a] mb-6 px-2 tracking-tight">Approval Section</h1>
      
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 p-6 flex items-center justify-center min-h-[140px]">
        <p className="text-[#ee6996] font-medium text-sm">No pending approvals</p>
      </div>
    </div>
  );
}
