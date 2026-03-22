import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown';

const routeNames: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/stock': 'Stock Panel',
  '/admin/inventory': 'Inventory',
  '/admin/sold': 'Sold',
  '/admin/pending': 'Pending',
  '/admin/refund': 'Refund',
  '/admin/sale': '% On Sale',
  '/admin/monitoring': 'Monitoring',
  '/admin/replacement': 'Replacements',
  '/admin/salary': 'Salary',
  '/owner': 'Dashboard',
  '/owner/new-stocks': 'New Stocks',
  '/owner/stock': 'Stock Panel',
  '/owner/list': 'List of Stocks',
  '/owner/inventory': 'Inventory',
  '/owner/sold': 'Sold',
  '/owner/pending': 'Pending',
  '/owner/refund': 'Refund',
  '/owner/orders': 'Orders',
  '/owner/capital': 'Capital',
  '/owner/price': 'Price',
  '/owner/sale': '% On Sale',
  '/owner/monitoring': 'Monitoring',
  '/owner/replacement': 'Replacements',
  '/owner/approval': 'Approval',
  '/owner/salary': 'Salary',
  '/owner/users': 'Users & Activity',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const title = routeNames[location.pathname] || 'Dashboard';

  return (
    <header className="h-[72px] bg-white border-b border-pink-100 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm relative z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <UserProfileDropdown />
      </div>
    </header>
  );
}
