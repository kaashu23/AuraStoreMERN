import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaThLarge, FaBox, FaShoppingCart, FaListAlt, FaArrowLeft } from 'react-icons/fa';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: <FaThLarge />, path: '/admin' },
    { label: 'Products', icon: <FaBox />, path: '/admin/products' },
    { label: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders' },
    { label: 'Categories', icon: <FaListAlt />, path: '/admin/categories' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      {/* Sidebar - Premium Aura Dark Theme */}
      <aside className="w-full md:w-72 bg-dark-1 border-r border-dark-2 transition-all duration-300">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-all mb-12 group">
            <FaArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Store</span>
          </Link>
          
          <div className="mb-10 px-4">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Management</p>
             <h2 className="text-white text-xl font-black tracking-tighter italic">Aura Control</h2>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]'
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-white' : 'text-gray-600'}`}>{item.icon}</span>
                  <span className="text-xs uppercase tracking-widest">{isActive ? item.label : item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats Overlay (Minimal) */}
          <div className="mt-20 p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Server Status</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Aura Store Backend is operational and synced with Clerk Node.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
