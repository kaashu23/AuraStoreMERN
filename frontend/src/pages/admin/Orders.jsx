import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { FaEye, FaTruck, FaCheckDouble, FaTimesCircle, FaClock, FaDownload, FaChevronRight, FaArchive } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const AdminOrders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      let url = '/orders';
      if (statusFilter) url += `?status=${statusFilter}`;
      
      const { data } = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to retrieve logistics data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = await getToken();
      await api.put(`/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Acquisition protocol updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Logistics update failed');
    }
  };

  const handleExport = async () => {
    try {
      const token = await getToken();
      const response = await api.get(`/orders/export${statusFilter ? `?status=${statusFilter}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aura-logistics-export-${statusFilter || 'all'}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 text-primary mb-2">
             <FaArchive size={14} />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Vault Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-dark-1 uppercase italic leading-none">Order Logistics</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Monitor and manage elite store shipments</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border-none rounded-lg px-8 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-primary cursor-pointer outline-none"
          >
            <option value="">All Shipments</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleExport}
            className="w-full sm:w-auto bg-dark-1 text-white px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95"
          >
            <FaDownload size={10} />
            <span>Export Manifest</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8 animate-pulse">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-24 bg-gray-50 border border-gray-100" />
           ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-40 text-center bg-gray-50/50 rounded-sm border border-dashed border-gray-100">
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] italic text-thin">No logistics records found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-gray-400">Reference</th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-gray-400">Elite Client</th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-gray-400 text-center">Protocol Status</th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-gray-400 text-center">Acquisitions</th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-gray-400 text-center">Valuation</th>
                  <th className="p-5 text-[10px] uppercase tracking-widest font-black text-gray-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-5">
                       <div className="space-y-1">
                          <p className="font-mono font-black text-dark-1 tracking-tighter text-xs uppercase">#{order._id.slice(-8)}</p>
                          <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col space-y-1">
                        <span className="font-black text-dark-1 uppercase tracking-tight text-[11px]">{order.user?.name || 'Archived User'}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight lowercase">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {order.status === 'Pending' && <FaClock size={8} />}
                        {order.status === 'Shipped' && <FaTruck size={8} />}
                        {order.status === 'Delivered' && <FaCheckDouble size={8} />}
                        {order.status === 'Cancelled' && <FaTimesCircle size={8} />}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="p-5 text-center">
                       <div className="flex justify-center -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                             <div key={i} className="w-8 h-10 border border-white bg-gray-50 overflow-hidden shadow-sm" title={item.product?.name}>
                                <img src={item.product?.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                             </div>
                          ))}
                          {order.items.length > 3 && (
                             <div className="w-8 h-10 border border-white bg-dark-1 flex items-center justify-center text-[8px] font-black text-white">
                                +{order.items.length - 3}
                             </div>
                          )}
                       </div>
                    </td>
                    <td className="p-5 text-center font-black text-primary tracking-wider text-sm">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end space-x-3">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                            className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
                            title="Advance to Shipping"
                          >
                            <FaTruck size={12} />
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                            className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full hover:bg-green-700 transition-all shadow-xl shadow-green-500/10"
                            title="Confirm Delivery"
                          >
                            <FaCheckDouble size={12} />
                          </button>
                        )}
                        <Link 
                          to={`/products/${order.items[0]?.product?._id || ''}`}
                          className="w-10 h-10 bg-white border border-gray-100 text-dark-1 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all shadow-sm"
                          title="Inspect Primary Item"
                        >
                          <FaChevronRight size={10} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
