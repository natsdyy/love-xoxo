import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-5 bg-[#fff9fb] border-t border-pink-50 gap-4">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest order-2 sm:order-1">
        Showing <span className="text-slate-700">{startIdx}-{endIdx}</span> of <span className="text-[#ee6996]">{totalItems}</span> items
      </div>
      
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-pink-100/50 bg-white text-slate-400 hover:text-[#ee6996] hover:border-[#ee6996]/30 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft size={16} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, i) => (
            typeof page === 'string' ? (
              <span key={`dots-${i}`} className="px-2 text-slate-300 font-bold text-xs">...</span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  currentPage === page
                    ? 'bg-[#ee6996] text-white shadow-lg shadow-pink-200 border-transparent'
                    : 'bg-white border border-pink-100/50 text-slate-400 hover:text-[#ee6996] hover:border-[#ee6996]/30 shadow-sm'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-pink-100/50 bg-white text-slate-400 hover:text-[#ee6996] hover:border-[#ee6996]/30 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
