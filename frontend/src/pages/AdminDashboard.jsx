import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Gift, LogOut, Users, FileText } from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalHamperBoxes: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [products, categories, hamperBoxes, orders] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/hamper-boxes'),
        api.get('/orders')
      ]);

      setStats({
        totalProducts: products.data.length,
        totalCategories: categories.data.length,
        totalOrders: orders.data.length,
        totalHamperBoxes: hamperBoxes.data.length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-pink-600" />
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Hamper Boxes */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-rose-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Hamper Boxes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalHamperBoxes}</p>
              </div>
              <div className="bg-rose-100 p-3 rounded-lg">
                <Gift className="h-8 w-8 text-rose-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-left"
            >
              <ShoppingBag className="h-8 w-8 text-pink-500 mb-3" />
              <h3 className="font-semibold text-lg">Manage Products</h3>
              <p className="text-gray-600 text-sm mt-1">Add, edit, or remove products</p>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
              <Package className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-lg">Manage Categories</h3>
              <p className="text-gray-600 text-sm mt-1">Organize product categories</p>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all text-left">
              <Gift className="h-8 w-8 text-rose-500 mb-3" />
              <h3 className="font-semibold text-lg">Manage Hampers</h3>
              <p className="text-gray-600 text-sm mt-1">Configure hamper boxes</p>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <FileText className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-lg">View Orders</h3>
              <p className="text-gray-600 text-sm mt-1">Manage customer orders</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

