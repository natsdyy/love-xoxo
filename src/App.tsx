import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './admin/layouts/DashboardLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminStockPanel from './admin/pages/StockPanel';
import AdminInventory from './admin/pages/Inventory';
import AdminSold from './admin/pages/Sold';
import AdminPending from './admin/pages/Pending';
import AdminRefund from './admin/pages/Refund';
import AdminOnSale from './admin/pages/OnSale';
import AdminMonitoring from './admin/pages/Monitoring';
import AdminReplacements from './admin/pages/Replacements';
import AdminSalary from './admin/pages/Salary';

// Owner Imports
import OwnerLayout from './owner/layouts/OwnerLayout';
import OwnerNewStocks from './owner/pages/NewStocks';
import OwnerStockPanel from './owner/pages/StockPanel';
import OwnerListStocks from './owner/pages/ListStocks';
import OwnerInventory from './owner/pages/Inventory';
import OwnerOrders from './owner/pages/Orders';
import OwnerCapital from './owner/pages/Capital';
import OwnerPrice from './owner/pages/Price';
import OwnerApproval from './owner/pages/Approval';
import OwnerSold from './owner/pages/Sold';
import OwnerRefund from './owner/pages/Refund';
import OwnerOnSale from './owner/pages/OnSale';
import OwnerMonitoring from './owner/pages/Monitoring';
import OwnerReplacements from './owner/pages/Replacements';
import OwnerSalary from './owner/pages/Salary';
import OwnerPending from './owner/pages/Pending';

// Auth Imports
import Login from './pages/Login';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/owner'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="stock" element={<AdminStockPanel />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="sold" element={<AdminSold />} />
          <Route path="pending" element={<AdminPending />} />
          <Route path="refund" element={<AdminRefund />} />
          <Route path="sale" element={<AdminOnSale />} />
          <Route path="monitoring" element={<AdminMonitoring />} />
          <Route path="replacement" element={<AdminReplacements />} />
          <Route path="salary" element={<AdminSalary />} />
        </Route>

        {/* Owner Routes */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRole="owner">
            <OwnerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="new-stocks" element={<OwnerNewStocks />} />
          <Route path="stock" element={<OwnerStockPanel />} />
          <Route path="list" element={<OwnerListStocks />} />
          <Route path="inventory" element={<OwnerInventory />} />
          <Route path="sold" element={<OwnerSold />} />
          <Route path="pending" element={<OwnerPending />} />
          <Route path="refund" element={<OwnerRefund />} />
          <Route path="orders" element={<OwnerOrders />} />
          <Route path="capital" element={<OwnerCapital />} />
          <Route path="price" element={<OwnerPrice />} />
          <Route path="sale" element={<OwnerOnSale />} />
          <Route path="monitoring" element={<OwnerMonitoring />} />
          <Route path="replacement" element={<OwnerReplacements />} />
          <Route path="approval" element={<OwnerApproval />} />
          <Route path="salary" element={<OwnerSalary />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
