import { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userRole = localStorage.getItem('userRole');
  const userName = userRole === 'admin' ? 'Mir' : 'Eli';

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-[#ee6996] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-pink-100 hover:bg-pink-600 transition-colors"
      >
        {userName.charAt(0)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-1 duration-200">
          
          {/* User Info */}
          <div className="px-4 py-3 border-b border-pink-50">
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Signed in as</p>
            <p className="font-bold text-slate-700 mt-1">{userName}</p>
            <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mt-0.5">
              {userRole === 'admin' ? 'Administrator' : 'Owner'}
            </p>
          </div>

          {/* Menu Items */}
          <div className="px-2 py-2">    
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <LogOut size={16} className="text-red-400 group-hover:text-red-500 transition-colors" />
              Sign Out
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}
