import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Image as ImageIcon, Settings, LogOut, 
  Menu as MenuIcon, DollarSign, ShoppingCart, CheckCircle, XCircle, Clock, TrendingUp, MessageSquare
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import AdminMenu from './AdminMenu';
import AdminSettings from './AdminSettings';
import AdminGallery from './AdminGallery';
import AdminReviews from './AdminReviews';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-matcha-900 text-white w-64 flex flex-col transition-transform duration-300 shadow-2xl lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-center border-b border-matcha-800/50 bg-matcha-900 flex-shrink-0">
          <span className="text-xl font-bold tracking-wide">Catering-in <span className="text-matcha-300">Admin</span></span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-2">
          <Link to="/admin" onClick={() => { if(window.innerWidth < 1024) setSidebarOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-matcha-800/80 transition-colors font-medium">
            <LayoutDashboard size={20} className="text-matcha-300" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/menu" onClick={() => { if(window.innerWidth < 1024) setSidebarOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-matcha-800/80 transition-colors font-medium">
            <Utensils size={20} className="text-matcha-300" />
            <span>Kelola Menu</span>
          </Link>
          <Link to="/admin/gallery" onClick={() => { if(window.innerWidth < 1024) setSidebarOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-matcha-800/80 transition-colors font-medium">
            <ImageIcon size={20} className="text-matcha-300" />
            <span>Kelola Galeri</span>
          </Link>
          <Link to="/admin/reviews" onClick={() => { if(window.innerWidth < 1024) setSidebarOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-matcha-800/80 transition-colors font-medium">
            <MessageSquare size={20} className="text-matcha-300" />
            <span>Kelola Testimoni</span>
          </Link>
          <Link to="/admin/settings" onClick={() => { if(window.innerWidth < 1024) setSidebarOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-matcha-800/80 transition-colors font-medium">
            <Settings size={20} className="text-matcha-300" />
            <span>Pengaturan</span>
          </Link>
          <div className="pt-8 pb-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors font-medium">
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen bg-gray-50/50">
        <header className="h-20 bg-white shadow-sm flex items-center px-4 md:px-6 border-b border-gray-100 z-10 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-matcha-600 focus:outline-none bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors lg:hidden"
          >
            <MenuIcon size={24} />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-matcha-100 flex items-center justify-center text-matcha-700 font-bold border-2 border-white shadow-sm uppercase">
              {user?.email ? user.email.charAt(0) : 'A'}
            </div>
            <span className="text-sm font-bold text-gray-700 hidden sm:block">
              {user?.email ? user.email.split('@')[0] : 'Admin Workspace'}
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    countPending: 0,
    countCompleted: 0,
    countCanceled: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to calculate stats locally
  const calculateStats = (orders) => {
    let revenue = 0;
    let pending = 0;
    let completed = 0;
    let canceled = 0;

    orders.forEach(order => {
      if (order.status === 'selesai') {
        revenue += (order.total_price || 0);
        completed++;
      } else if (order.status === 'dibatalkan') {
        canceled++;
      } else {
        // pending & diproses
        pending++;
      }
    });

    setStats({
      totalRevenue: revenue,
      countPending: pending,
      countCompleted: completed,
      countCanceled: canceled
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;

        if (orders) {
          calculateStats(orders);
          setRecentOrders(orders); // Keep all in state for local calculation when status changes
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state and recalculate
      setRecentOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        calculateStats(updatedOrders);
        return updatedOrders;
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Gagal mengupdate status pesanan.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // pending/menunggu
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ringkasan Penjualan</h1>
          <p className="text-gray-500 mt-2">Pantau performa bisnis dan pesanan terbaru Anda hari ini.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600"></div>
        </div>
      ) : (
        <>
          {/* Main Stat Card - Revenue */}
          <div className="bg-gradient-to-br from-matcha-600 to-matcha-800 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-0 right-16 -mb-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-matcha-100 mb-2 font-medium">
                  <DollarSign size={20} />
                  <span>Total Pendapatan Bersih</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Rp {stats.totalRevenue.toLocaleString('id-ID')}
                </h2>
                <p className="text-matcha-200 text-sm mt-3 flex items-center gap-1">
                  <TrendingUp size={16} /> Hanya dihitung dari pesanan selesai
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl flex items-center justify-center">
                <ShoppingCart size={48} className="text-white opacity-90" />
              </div>
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Dalam Proses</p>
                  <h3 className="text-3xl font-black text-gray-800">{stats.countPending}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Clock size={24} className="text-amber-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Berhasil</p>
                  <h3 className="text-3xl font-black text-gray-800">{stats.countCompleted}</h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle size={24} className="text-emerald-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Dibatalkan</p>
                  <h3 className="text-3xl font-black text-gray-800">{stats.countCanceled}</h3>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <XCircle size={24} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-gray-800">Riwayat Pesanan</h2>
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                Total {recentOrders.length} Pesanan
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-semibold">Pemesan</th>
                    <th className="p-5 font-semibold">Tanggal</th>
                    <th className="p-5 font-semibold">Ringkasan Item</th>
                    <th className="p-5 font-semibold">Total Tagihan</th>
                    <th className="p-5 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <ShoppingCart size={48} className="mb-4 opacity-50" />
                          <p className="text-lg font-medium text-gray-600">Belum Ada Pesanan Masuk</p>
                          <p className="text-sm mt-1">Pesanan dari pelanggan akan muncul di sini.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Display up to 10 recent orders on dashboard
                    recentOrders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{order.customer_name || `Pesanan #${order.id}`}</span>
                            {order.customer_phone && <span className="text-xs text-gray-500 mt-1">{order.customer_phone}</span>}
                            {order.payment_method && <span className="text-[10px] font-semibold text-matcha-600 uppercase mt-1 tracking-wider">{order.payment_method}</span>}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="text-sm text-gray-600 max-w-[200px] line-clamp-2">
                            {order.items && order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-extrabold text-gray-800">
                            Rp {order.total_price.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border transition-colors shadow-sm appearance-none text-center ${getStatusColor(order.status || 'pending')}`}
                            style={{ backgroundImage: 'none' }} // Remove default dropdown arrow for cleaner look
                          >
                            <option value="pending" className="bg-white text-gray-800 font-medium">Menunggu</option>
                            <option value="diproses" className="bg-white text-gray-800 font-medium">Diproses</option>
                            <option value="selesai" className="bg-white text-gray-800 font-medium">Selesai</option>
                            <option value="dibatalkan" className="bg-white text-gray-800 font-medium">Dibatalkan</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {recentOrders.length > 10 && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button className="text-sm font-semibold text-matcha-600 hover:text-matcha-700">
                    Lihat Semua Pesanan ({recentOrders.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AdminPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | Catering-in</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<AdminMenu />} />
        <Route path="/gallery" element={<AdminGallery />} />
        <Route path="/reviews" element={<AdminReviews />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;
