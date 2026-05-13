import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Image as ImageIcon, Settings, LogOut, 
  Menu as MenuIcon, DollarSign, ShoppingCart, CheckCircle, XCircle, 
  Clock, TrendingUp, MessageSquare, ChefHat, X, Bell
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import AdminMenu from './AdminMenu';
import AdminSettings from './AdminSettings';
import AdminGallery from './AdminGallery';
import AdminReviews from './AdminReviews';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/menu', label: 'Kelola Menu', icon: Utensils },
  { to: '/admin/gallery', label: 'Kelola Galeri', icon: ImageIcon },
  { to: '/admin/reviews', label: 'Kelola Testimoni', icon: MessageSquare },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const currentPage = navItems.find(n => isActive(n.to, n.exact))?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-900 flex font-sans text-gray-100 overflow-hidden">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-gray-900 border-r border-gray-800 shadow-2xl
        transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-matcha-600 rounded-lg flex items-center justify-center shadow-sm">
              <ChefHat size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white leading-none">Catering-in</p>
              <p className="text-[10px] text-matcha-400 font-semibold tracking-wider uppercase leading-none mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-3">Menu Utama</p>
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${active
                    ? 'bg-matcha-600 text-white shadow-md shadow-matcha-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
                `}
              >
                <Icon size={18} className={active ? 'text-white' : 'text-gray-500'} />
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1 bg-gray-800/50 rounded-xl p-2">
            <div className="w-8 h-8 rounded-lg bg-matcha-100 flex items-center justify-center text-matcha-700 font-bold text-sm flex-shrink-0 uppercase">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-200 truncate">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@catering.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 md:px-6 gap-4 flex-shrink-0 z-10 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
          >
            <MenuIcon size={20} />
          </button>

          <div>
            <h1 className="text-sm font-extrabold text-white">{currentPage}</h1>
            <p className="text-xs text-gray-500 leading-none mt-0.5">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors relative">
              <Bell size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2.5 bg-gray-700/60 border border-gray-600 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-matcha-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                {user?.email?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-bold text-gray-200 max-w-[120px] truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-5 md:p-7 bg-gray-900">
          {children}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bg, trend }) => (
  <div className={`bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${bg} opacity-10 -mr-6 -mt-6 group-hover:scale-110 transition-transform duration-500`} />
    <div className="flex justify-between items-start mb-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      <div className={`p-2.5 rounded-xl ${bg}`}>
        <Icon size={18} className={color} />
      </div>
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
    {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    countPending: 0,
    countCompleted: 0,
    countCanceled: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateStats = (orders) => {
    let revenue = 0, pending = 0, completed = 0, canceled = 0;
    orders.forEach(order => {
      if (order.status === 'selesai') { revenue += (order.total_price || 0); completed++; }
      else if (order.status === 'dibatalkan') { canceled++; }
      else { pending++; }
    });
    setStats({ totalRevenue: revenue, countPending: pending, countCompleted: completed, countCanceled: canceled });
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
        if (orders) { calculateStats(orders); setRecentOrders(orders); }
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
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setRecentOrders(prev => {
        const updated = prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      alert("Gagal mengupdate status pesanan.");
    }
  };

  const statusConfig = {
    selesai:    { label: 'Selesai',   cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    diproses:   { label: 'Diproses',  cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    dibatalkan: { label: 'Dibatalkan',cls: 'bg-red-100 text-red-700 border-red-200' },
    pending:    { label: 'Menunggu',  cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  };

  const getStatusCls = (s) => (statusConfig[s] || statusConfig.pending).cls;

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600" />
        </div>
      ) : (
        <>
          {/* Revenue Hero Card */}
          <div className="bg-gradient-to-br from-matcha-600 via-matcha-700 to-matcha-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/5 -mb-12" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-matcha-200 text-sm font-semibold mb-3">
                  <DollarSign size={16} />
                  <span>Total Pendapatan Bersih</span>
                </div>
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  Rp {stats.totalRevenue.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center gap-1.5 text-matcha-200/80 text-xs">
                  <TrendingUp size={13} />
                  <span>Dihitung dari {stats.countCompleted} pesanan selesai</span>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-fit">
                <ShoppingCart size={40} className="text-white/80" />
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Dalam Proses"
              value={stats.countPending}
              icon={Clock}
              color="text-amber-500"
              bg="bg-amber-100"
              trend="Menunggu & sedang diproses"
            />
            <StatCard
              title="Berhasil"
              value={stats.countCompleted}
              icon={CheckCircle}
              color="text-emerald-500"
              bg="bg-emerald-100"
              trend="Pesanan selesai"
            />
            <StatCard
              title="Dibatalkan"
              value={stats.countCanceled}
              icon={XCircle}
              color="text-red-500"
              bg="bg-red-100"
              trend="Pesanan dibatalkan"
            />
          </div>

          {/* Orders Table */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-white">Riwayat Pesanan</h2>
                <p className="text-xs text-gray-500 mt-0.5">10 pesanan terbaru</p>
              </div>
              <span className="text-xs font-bold text-matcha-400 bg-matcha-900/40 px-3 py-1 rounded-full border border-matcha-800">
                {recentOrders.length} Total Pesanan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700 bg-gray-900/40">
                    <th className="px-5 py-3.5">Pemesan</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Tanggal</th>
                    <th className="px-5 py-3.5 hidden md:table-cell">Item</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-600">
                          <ShoppingCart size={40} className="opacity-30" />
                          <div>
                            <p className="font-semibold text-gray-400">Belum ada pesanan</p>
                            <p className="text-xs mt-0.5 text-gray-600">Pesanan pelanggan akan muncul di sini</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentOrders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-700/30 transition-colors group">
                        <td className="px-5 py-4">
                          <p className="font-bold text-gray-100 text-sm">{order.customer_name || `Pesanan #${order.id}`}</p>
                          {order.customer_phone && <p className="text-xs text-gray-500 mt-0.5">{order.customer_phone}</p>}
                          {order.payment_method && (
                            <span className="text-[10px] font-bold text-matcha-600 uppercase tracking-wider">{order.payment_method}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <p className="text-sm text-gray-300 font-medium">
                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <p className="text-sm text-gray-400 max-w-[180px] line-clamp-2 leading-relaxed">
                            {order.items?.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-extrabold text-white">
                            Rp {order.total_price?.toLocaleString('id-ID')}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border transition-colors appearance-none text-center ${getStatusCls(order.status || 'pending')}`}
                            style={{ backgroundImage: 'none' }}
                          >
                            <option value="pending">Menunggu</option>
                            <option value="diproses">Diproses</option>
                            <option value="selesai">Selesai</option>
                            <option value="dibatalkan">Dibatalkan</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {recentOrders.length > 10 && (
              <div className="px-5 py-4 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500">
                  Menampilkan 10 dari <span className="font-bold text-gray-300">{recentOrders.length}</span> pesanan
                </p>
              </div>
            )}
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
