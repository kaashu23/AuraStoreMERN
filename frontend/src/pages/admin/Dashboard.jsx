import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { FaDollarSign, FaBox, FaUsers, FaShoppingCart, FaDownload, FaArrowUp, FaChartLine, FaEye, FaTrophy, FaFire } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '@clerk/clerk-react';
import LowStockTable from '../../components/admin/LowStockTable';

const AdminDashboard = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [salesGroup, setSalesGroup] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [getToken, salesGroup]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, salesRes, popularRes] = await Promise.all([
        api.get('/admin/stats', { headers }),
        api.get(`/admin/sales?group=${salesGroup}`, { headers }),
        api.get('/track/popular', { headers })
      ]);
      setStats(statsRes.data.data);
      setSalesData(salesRes.data.data);
      setPopularProducts(popularRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/orders/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aura-orders-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) return (
    <div className="p-8 space-y-10 animate-pulse bg-white min-h-screen">
      <div className="h-10 w-48 bg-gray-50 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-44 bg-gray-50 rounded-[2.5rem]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 h-[500px] bg-gray-50 rounded-[2.5rem]" />
         <div className="lg:col-span-1 h-[500px] bg-gray-50 rounded-[2.5rem]" />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-white min-h-screen">
      
      {/* Header - Mobile Stacked */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-dark-1 uppercase italic leading-none">Business Intel</h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">Real-time store performance analytics</p>
        </div>
        <button
          onClick={handleExport}
          className="w-full md:w-auto bg-dark-1 hover:bg-primary text-white px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95"
        >
          <FaDownload size={12} />
          <span>Export Records</span>
        </button>
      </div>

      {/* Stats Grid - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Revenue', value: `₹${stats?.totalRevenue.toFixed(2)}`, icon: <FaDollarSign />, color: 'from-primary to-accent', shadow: 'shadow-primary/20' },
          { label: 'Orders', value: stats?.ordersCount, icon: <FaShoppingCart />, color: 'from-dark-2 to-dark-3', shadow: 'shadow-dark-2/20' },
          { label: 'Customers', value: stats?.usersCount, icon: <FaUsers />, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/20' },
          { label: 'Inventory', value: stats?.productsCount, icon: <FaBox />, color: 'from-gray-800 to-gray-600', shadow: 'shadow-gray-500/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-44 md:h-48 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 -translate-y-8 translate-x-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-xl ${stat.shadow}`}>
                {stat.icon}
              </div>
              <div className="flex items-center space-x-1 text-primary text-[9px] font-black tracking-widest uppercase bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                <FaArrowUp size={8} />
                <span>+12%</span>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-black text-dark-1 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts - Responsive Aspect Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-10 min-h-[450px] flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4 text-dark-1">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                 <FaChartLine />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest italic">Revenue Stream</h3>
            </div>
            <select 
              className="w-full sm:w-auto bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              value={salesGroup}
              onChange={(e) => setSalesGroup(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D5F20" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0D5F20" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#D1D5DB' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#D1D5DB' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px', textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0D5F20" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col min-h-[450px] overflow-hidden">
          <h3 className="text-lg font-black uppercase tracking-widest italic text-dark-1 mb-10">Daily Volume</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#D1D5DB' }} dy={15} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontSize: '9px', fontWeight: 'bold' }} />
                <Bar dataKey="orders" fill="#163832" radius={[10, 10, 10, 10]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* NEW: Analytics Tables - Popular Products & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Most Viewed / Popular Section */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-8">
           <div className="flex items-center space-x-4 text-primary">
              <FaEye />
              <h3 className="text-lg font-black uppercase tracking-widest italic">Live Interests</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[9px] uppercase tracking-widest font-black text-gray-400">Trending Item</th>
                    <th className="pb-4 text-[9px] uppercase tracking-widest font-black text-gray-400">Total Views</th>
                    <th className="pb-4 text-[9px] uppercase tracking-widest font-black text-gray-400 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {popularProducts.map((item) => (
                    <tr key={item._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs text-dark-1 uppercase tracking-tight">{item.product.name}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.product.category?.name || 'Collection'}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                           <FaEye size={10} className="text-gray-300" />
                           <span className="text-xs font-black text-dark-2">{item.viewCount}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <Link to={`/products/${item.product._id}`} className="text-primary hover:underline text-[9px] font-black uppercase tracking-widest">
                           Inspect Piece
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-8">
           <div className="flex items-center space-x-4 text-primary">
              <FaFire />
              <h3 className="text-lg font-black uppercase tracking-widest italic">Top Sellers</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[9px] uppercase tracking-widest font-black text-gray-400">Product</th>
                    <th className="pb-4 text-[9px] uppercase tracking-widest font-black text-gray-400 text-center">Sold</th>
                    <th className="pb-4 text-[9px] uppercase tracking-widest font-black text-gray-400 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.topProducts?.map((item) => (
                    <tr key={item._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-xs text-dark-1 uppercase tracking-tight">{item.product.name}</p>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black text-dark-2">{item.totalSold}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs font-black text-primary">₹{item.totalRevenue.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-10">
        <LowStockTable />
      </div>

      <div className="mt-12 p-8 bg-gray-50 rounded-sm border border-gray-100 text-center">
         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Aura Store Intelligence Protocol v1.2</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
