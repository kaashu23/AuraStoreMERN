import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';
import { FaLock, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@clerk/clerk-react';

const Checkout = () => {
  const { getToken } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (Object.values(address).some(val => !val)) {
      return toast.error('Please complete all delivery details');
    }

    setLoading(true);
    try {
      const token = await getToken();
      const items = cartItems.map(item => ({
        product: item._id,
        qty: item.qty,
        price: item.price,
        name: item.name
      }));

      const { data } = await api.post('/orders', { items, address }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.url) {
        // Use window.location.replace to prevent back-button loops on mobile
        window.location.replace(data.url);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || error.message || 'Transaction failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-white">
        <div className="w-20 h-20 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-light tracking-tight text-dark-1 uppercase italic">Initializing Secure Vault</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Redirecting to payment gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="section-container py-12 md:py-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 space-y-4">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Secure Terminal</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-dark-1 uppercase italic">Checkout</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Address Form */}
          <div className="flex-1 w-full">
            <div className="space-y-12">
              <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
                <FaMapMarkerAlt className="text-primary" size={16} />
                <h2 className="text-xl font-black uppercase tracking-widest italic text-dark-1">Delivery Protocol</h2>
              </div>
              
              <form onSubmit={handleCheckout} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                    placeholder="ENTER YOUR FULL ADDRESS"
                    value={address.street}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                      placeholder="CITY"
                      value={address.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">State / Province</label>
                    <input
                      type="text"
                      name="state"
                      required
                      className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                      placeholder="STATE"
                      value={address.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Zip / Postal Code</label>
                    <input
                      type="text"
                      name="zip"
                      required
                      className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                      placeholder="ZIP CODE"
                      value={address.zip}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Country</label>
                    <input
                      type="text"
                      name="country"
                      required
                      className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                      placeholder="COUNTRY"
                      value={address.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="pt-10">
                   <button
                    type="submit"
                    disabled={loading}
                    className="btn-premium w-full flex items-center justify-center space-x-4 py-5 shadow-2xl shadow-primary/10"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <FaLock size={14} />
                        <span>Authorize Payment of ₹{total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Snapshot */}
          <div className="lg:w-[400px] w-full shrink-0">
             <div className="bg-dark-1 p-10 md:p-12 space-y-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center space-x-4">
                     <FaShieldAlt className="text-primary" />
                     <h2 className="text-xl font-black uppercase tracking-widest italic text-white">Snapshot</h2>
                  </div>

                  <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between items-center group">
                        <div className="flex items-center space-x-4">
                           <span className="text-[10px] font-black text-primary">{item.qty}x</span>
                           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight truncate w-32">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-white">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-white">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                      <span>Handling</span>
                      <span className="text-white">₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Total</span>
                       <span className="text-2xl font-black text-white tracking-tighter">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
