import {
  LayoutDashboard,
  Package,
  ClipboardList,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Percent,
  Monitor,
  Repeat,
  Banknote,
  X,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Stock Panel', path: '/admin/stock' },
  { icon: ClipboardList, label: 'Inventory', path: '/admin/inventory' },
  { icon: CheckCircle2, label: 'Sold', path: '/admin/sold' },
  { icon: Clock, label: 'Pending', path: '/admin/pending' },
  { icon: RefreshCcw, label: 'Refund', path: '/admin/refund' },
  { icon: Percent, label: 'On Sale', path: '/admin/sale' },
  { icon: Monitor, label: 'Monitoring', path: '/admin/monitoring' },
  { icon: Repeat, label: 'Replacement', path: '/admin/replacement' },
  { icon: Banknote, label: 'Salary', path: '/admin/salary' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl
        md:relative md:shadow-none md:border-r md:border-pink-100/60
        ${isOpen ? 'translate-x-0 md:ml-0' : '-translate-x-full md:-ml-[280px]'}
      `}>
        {/* Logo Area */}
        <div className="flex items-center justify-between px-6 pt-8 mb-8 pb-4 border-b border-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-pink-100 ring-4 ring-pink-50/50">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-[16px] leading-tight">
                Love, Xoxo
              </h1>
              <p className="text-[12px] text-[#ee6996] font-semibold tracking-wide mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all group ${isActive
                  ? 'bg-[#ee6996] text-white shadow-lg shadow-pink-500/20'
                  : 'text-slate-600 hover:bg-pink-50/80 hover:text-[#ee6996]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-[#ee6996] transition-colors"}`}
                    />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={16} strokeWidth={3} className="text-white/80" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

      </div>
    </>
  );
}
