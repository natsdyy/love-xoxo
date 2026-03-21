import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OwnerSidebar from '../components/OwnerSidebar';
import Header from '../../admin/components/Header';

export default function OwnerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  return (
    <div className="flex h-screen bg-[#fcf5f7] overflow-hidden font-sans">
      <OwnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#fcf5f7] p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
