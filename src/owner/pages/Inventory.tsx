export default function Inventory() {
  const headers = [
    'Service',
    'Category',
    'Duration',
    'Price',
    'Total Qty',
    'Status'
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-pink-50">
          <h1 className="text-xl font-bold text-[#7c2d12] font-serif">Inventory</h1>
        </div>

        {/* Table Body */}
        <div className="p-4 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-50/30 rounded-xl overflow-hidden">
                  {headers.map((header) => (
                    <th key={header} className="px-4 py-4 text-left text-xs font-bold text-[#7c2d12] first:rounded-l-2xl last:rounded-r-2xl">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <p className="text-sm font-bold text-[#ee6996]">No inventory items</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
