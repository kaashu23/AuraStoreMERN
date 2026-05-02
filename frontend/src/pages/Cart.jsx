import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartQty } from '../redux/cartSlice';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 150 ? 0 : 25; // Elite shipping threshold
  const total = subtotal + shipping;

  const handleQtyChange = (id, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
        return toast.error(`Only ${stock} units available in the vault.`, {
            position: 'bottom-right',
            style: { background: '#0B2B26', color: '#fff' }
        });
    }
    dispatch(updateCartQty({ id, qty }));
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from your selection`, {
        position: 'bottom-right',
        icon: '🗑️'
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center bg-white min-h-screen">
        <div className="space-y-10 inline-block p-16 bg-gray-50/50 border border-gray-100 rounded-sm">
          <FaShoppingCart className="mx-auto text-6xl text-gray-200" />
          <div className="space-y-2">
            <h2 className="text-3xl font-light tracking-tight text-dark-1 uppercase italic">Your selection is empty</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Curate your aura with our latest arrivals</p>
          </div>
          <Link
            to="/products"
            className="btn-premium inline-flex items-center space-x-4"
          >
            <FaArrowLeft size={10} />
            <span>Explore Collections</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="section-container py-12 md:py-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 space-y-4">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Your Curation</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-dark-1 uppercase italic">Shopping Bag</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Cart Items List */}
          <div className="flex-1 w-full space-y-12">
            <div className="hidden md:grid grid-cols-12 pb-6 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
               <div className="col-span-6">Product Details</div>
               <div className="col-span-2 text-center">Quantity</div>
               <div className="col-span-2 text-center">Subtotal</div>
               <div className="col-span-2 text-right">Action</div>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 border-b border-gray-50 group"
              >
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6 flex items-center space-x-8">
                  <div className="w-24 h-32 shrink-0 bg-gray-50 overflow-hidden border border-gray-100">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{item.category?.name || 'Limited'}</p>
                    <Link to={`/products/${item._id}`} className="text-xl font-bold text-dark-1 hover:text-primary transition-colors uppercase italic tracking-tight">
                      {item.name}
                    </Link>
                    <p className="text-gray-400 font-light text-sm">${item.price.toFixed(2)} / unit</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
                    <button
                      onClick={() => handleQtyChange(item._id, item.qty - 1, item.stock)}
                      className="text-gray-400 hover:text-dark-1 font-black transition-colors px-2"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-black text-dark-1 min-w-[40px] text-center">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item._id, item.qty + 1, item.stock)}
                      className="text-gray-400 hover:text-dark-1 font-black transition-colors px-2"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-1 md:col-span-2 text-center">
                   <span className="text-lg font-black text-dark-1 tracking-tighter">${(item.price * item.qty).toFixed(2)}</span>
                </div>

                {/* Remove Button */}
                <div className="col-span-1 md:col-span-2 text-right">
                  <button
                    onClick={() => handleRemove(item._id, item.name)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                    title="Remove from selection"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            <Link to="/products" className="inline-flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-dark-1 transition-all pt-8">
              <FaArrowLeft size={10} />
              <span>Continue Browsing</span>
            </Link>
          </div>

          {/* Checkout Summary - Premium Sidebar */}
          <div className="lg:w-[400px] w-full shrink-0">
            <div className="bg-gray-50 p-10 md:p-12 space-y-12 border border-gray-100 rounded-sm sticky top-32">
              <div className="space-y-2">
                 <h2 className="text-2xl font-black uppercase tracking-tighter italic text-dark-1">Order Review</h2>
                 <div className="h-1 w-12 bg-primary" />
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Selection Subtotal</span>
                  <span className="text-dark-1 text-sm">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Elite Delivery</span>
                  <span className="text-dark-1 text-sm">
                    {shipping === 0 ? <span className="text-primary italic">Complimentary</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-dark-1">Total Valuation</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-premium w-full flex items-center justify-center space-x-4 py-5 shadow-2xl shadow-primary/10 group"
                >
                  <span>Begin Secure Checkout</span>
                  <FaChevronRight size={10} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                <p className="text-center text-[8px] text-gray-400 uppercase tracking-[0.4em] font-black px-4 leading-relaxed">
                  Secured by Aura Encryption & Stripe Technology
                </p>
              </div>
              
              {shipping !== 0 && (
                <div className="bg-primary/5 p-4 text-center">
                   <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                     Add ${(150 - subtotal).toFixed(2)} more for complimentary shipping.
                   </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
