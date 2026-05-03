import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FaBox, FaClock, FaTruck, FaCheckDouble, FaTimesCircle, FaChevronRight } from 'react-icons/fa';
import StarRating from '../components/StarRating';

const Orders = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get('/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, getToken]);

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(status);
    if (status === 'Cancelled') return -1;
    return currentIdx;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12 animate-pulse bg-white min-h-screen">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-50 rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-12 md:py-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center space-y-4">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Inventory Status</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-dark-1 uppercase italic">My Archive</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Tracking your premium acquisitions</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 rounded-sm border border-gray-100">
            <FaBox className="mx-auto text-6xl text-gray-100 mb-8" />
            <h2 className="text-2xl font-light tracking-tight text-dark-1 uppercase italic">No Acquisitions found</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Start your collection in the vault</p>
          </div>
        ) : (
          <div className="space-y-16">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border-b border-gray-100 pb-16 last:border-0"
              >
                {/* Order Header - Responsive Stack */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">Order Reference</p>
                    <p className="font-mono text-xs font-black text-dark-1 uppercase">#{order._id.slice(-12)}</p>
                  </div>
                  <div className="flex gap-12">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">Placed On</p>
                       <p className="text-xs font-black text-dark-1 uppercase">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    </div>
                    <div className="space-y-2 text-right">
                       <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">Valuation</p>
                       <p className="text-lg font-black text-primary tracking-tighter">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline UI - High-End Responsive */}
                <div className="mb-16">
                  {order.status === 'Cancelled' ? (
                    <div className="flex items-center space-x-4 text-red-500 font-black text-[10px] uppercase tracking-widest p-6 bg-red-50/50 border border-red-100">
                      <FaTimesCircle size={14} />
                      <span>This acquisition protocol has been terminated.</span>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Desktop Progress Line */}
                      <div className="hidden sm:block absolute top-5 left-0 w-full h-[1px] bg-gray-100 z-0" />
                      <div 
                        className="hidden sm:block absolute top-5 left-0 h-[1.5px] bg-primary z-0 transition-all duration-1000"
                        style={{ width: `${(getStatusStep(order.status) / 2) * 100}%` }}
                      />
                      
                      <div className="grid grid-cols-3 relative z-10">
                        {['Pending', 'Shipped', 'Delivered'].map((step, i) => {
                          const currentStep = getStatusStep(order.status);
                          const isCompleted = i <= currentStep;
                          return (
                            <div key={step} className={`flex flex-col items-center space-y-4 ${i === 0 ? 'items-start' : i === 2 ? 'items-end' : ''}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-700 ${
                                isCompleted 
                                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110' 
                                  : 'bg-white border-gray-100 text-gray-200'
                              }`}>
                                {i === 0 && <FaClock size={14} />}
                                {i === 1 && <FaTruck size={14} />}
                                {i === 2 && <FaCheckDouble size={14} />}
                              </div>
                              <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] ${
                                isCompleted ? 'text-dark-1' : 'text-gray-300'
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Mini Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {order.items.map((item, i) => (
                    <Link 
                      key={i} 
                      to={`/products/${item.product?._id}`}
                      className="flex items-center space-x-5 p-4 bg-gray-50/50 hover:bg-gray-50 transition-all border border-gray-50 group"
                    >
                      <div className="w-16 h-20 bg-white overflow-hidden shrink-0">
                        <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-[10px] font-black text-dark-1 uppercase truncate tracking-tight">{item.product?.name || 'Archived Item'}</h4>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{item.qty} x ₹{item.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center">
           <Link to="/products" className="group inline-flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-dark-1 transition-all">
              <span>Return to Vault</span>
              <FaChevronRight size={8} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
