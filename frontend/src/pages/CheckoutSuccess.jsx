import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { FaCheck, FaArrowRight, FaArchive, FaShieldAlt } from 'react-icons/fa';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-xl w-full">
        {/* Certificate Style Card */}
        <div className="bg-white border border-gray-100 shadow-2xl p-10 md:p-16 text-center space-y-12 relative overflow-hidden animate-fade-in">
          
          {/* Top Branding Accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          
          {/* Icon Header */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary relative">
               <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
               <FaCheck size={28} />
            </div>
            <div className="space-y-2">
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Acquisition Verified</p>
               <h1 className="text-4xl md:text-5xl font-light tracking-tight text-dark-1 uppercase italic leading-none">Successful</h1>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-gray-400 font-light text-base leading-relaxed">
              Your selection has been securely processed and added to our global dispatch queue. An official confirmation has been sent to your digital address.
            </p>
            
            {orderId && (
              <div className="inline-block py-3 px-8 bg-gray-50 border border-gray-100 space-y-1">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Vault Reference</p>
                <p className="font-mono text-xs font-black text-dark-1 uppercase tracking-tighter">#{orderId.slice(-12).toUpperCase()}</p>
              </div>
            )}
          </div>

          {/* Action Protocols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              to="/orders"
              className="btn-premium flex items-center justify-center space-x-4 group"
            >
              <FaArchive size={12} />
              <span>My Archive</span>
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 border border-gray-100 text-dark-1 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all flex items-center justify-center space-x-3"
            >
              <span>Explore More</span>
              <FaArrowRight size={10} />
            </Link>
          </div>

          {/* Footer Accent */}
          <div className="pt-10 border-t border-gray-50 flex items-center justify-center space-x-3 text-gray-300">
             <FaShieldAlt size={12} />
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Encrypted Protocol Finalized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
