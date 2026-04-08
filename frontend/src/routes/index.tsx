import { createBrowserRouter, Navigate } from 'react-router-dom';
import CustomerAuthGuard from '../components/guards/CustomerAuthGuard';
import AdminAuthGuard from '../components/guards/AdminAuthGuard';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import TableSetupPage from '../pages/customer/TableSetupPage';
import MenuPage from '../pages/customer/MenuPage';
import CartPage from '../pages/customer/CartPage';
import OrderSuccessPage from '../pages/customer/OrderSuccessPage';
import OrderHistoryPage from '../pages/customer/OrderHistoryPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import TableManagementPage from '../pages/admin/TableManagementPage';
import MenuManagementPage from '../pages/admin/MenuManagementPage';
import AdminOrderHistoryPage from '../pages/admin/AdminOrderHistoryPage';

const router = createBrowserRouter([
  {
    path: '/customer/setup',
    element: <TableSetupPage />,
  },
  {
    element: <CustomerAuthGuard />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: '/customer/menu', element: <MenuPage /> },
          { path: '/customer/cart', element: <CartPage /> },
          { path: '/customer/order-success', element: <OrderSuccessPage /> },
          { path: '/customer/orders', element: <OrderHistoryPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    element: <AdminAuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/dashboard', element: <DashboardPage /> },
          { path: '/admin/tables', element: <TableManagementPage /> },
          { path: '/admin/menus', element: <MenuManagementPage /> },
          { path: '/admin/history', element: <AdminOrderHistoryPage /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/customer/menu" replace />,
  },
]);

export default router;
