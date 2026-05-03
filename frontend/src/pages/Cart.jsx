import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaChevronRight, FaMinus, FaPlus, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { updateCartQty, removeFromCart } from '../redux/cartSlice';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 500; // Updated for INR
  const total = subtotal + shipping;

  const handleQtyChange = async (id, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
        return toast.error(`Only ${stock} units available in the vault.`, {
            position: 'bottom-right',
            style: { background: '#0B2B26', color: '#fff', fontSize: '10px', fontWeight: '900' }
        });
    }
    dispatch(updateCartQty({ id, qty }));
    // Backend sync would happen here if needed, but assuming cartSlice handles it or via useEffect
  };

  const handleRemove = async (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from your selection`, {
        position: 'bottom-right',
        icon: '🗑️'
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-10 bg-white">
        <div className="relative">
           <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
              <FaShoppingCart size={40} className="text-gray-200" />
           </div>
           <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full animate-ping opacity-20"></div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-light tracking-tight text-dark-1 uppercase italic">Your Vault is Empty</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Acquire prestige items to begin</p>
        </div>
        <Link to="/products" className="btn-premium">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="section-container pt-12 md:py-20 lg:py-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
               <span className="w-8 h-[1px] bg-primary/30"></span>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Pre-Acquisition</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-dark-1 uppercase italic leading-none">
              Your <span className="font-black not-italic text-primary">Selection</span>
            </h1>
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            {cartItems.length} Unique {cartItems.length === 1 ? 'Piece' : 'Pieces'} Identified
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            {cartItems.map((item) => (
              <div key={item._id} className="group relative flex flex-col sm:flex-row gap-8 pb-12 border-b border-gray-50 last:border-0 transition-all">
                
                {/* Product Image */}
                <div className="w-full sm:w-48 aspect-square bg-gray-50 overflow-hidden relative border border-gray-100">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-dark-1/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{item.category?.name || 'Aura Vault'}</p>
                        <Link to={`/products/${item._id}`} className="text-2xl font-light tracking-tight text-dark-1 uppercase italic hover:text-primary transition-colors block">
                          {item.name}
                        </Link>
                      </div>
                      <button 
                        onClick={() => handleRemove(item._id, item.name)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove Piece"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-12">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Unit Price</p>
                          <p className="text-sm font-bold text-dark-1">₹{item.price.toLocaleString()}</p>
                       </div>
                       
                       <div className="space-y-3">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Allocation</p>
                          <div className="flex items-center border border-gray-100 rounded-full p-1 bg-gray-50/50">
                            <button onClick={() => handleQtyChange(item._id, item.qty - 1, item.stock)} className="w-8 h-8 flex items-center justify-center text-dark-1 hover:bg-white rounded-full transition-all"><FaMinus size={8} /></button>
                            <span className="w-12 text-center text-xs font-black text-dark-1">{item.qty}</span>
                            <button onClick={() => handleQtyChange(item._id, item.qty + 1, item.stock)} className="w-8 h-8 flex items-center justify-center text-dark-1 hover:bg-white rounded-full transition-all"><FaPlus size={8} /></button>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-0 flex justify-between items-end">
                    <div className="flex items-center space-x-3 text-[9px] font-black text-green-600 uppercase tracking-widest">
                       <FaShieldAlt size={10} />
                       <span>Authenticity Verified</span>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Sub-Allocation Total</p>
                       <span className="text-2xl font-black text-dark-1 tracking-tighter italic">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/products" className="inline-flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-all group pt-8">
              <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              <span>Continue Discovery</span>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-10">
              <div className="bg-gray-50/50 border border-gray-100 p-10 rounded-[2.5rem] space-y-10">
                <div className="space-y-2">
                   <p className="text-primary text-[8px] font-black uppercase tracking-[0.5em]">Protocol Summary</p>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter text-dark-1">Acquisition Details</h3>
                </div>

                <div className="space-y-6 border-y border-gray-100 py-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valuation</span>
                    <span className="text-sm font-bold text-dark-1">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logistics</span>
                       <FaTruck size={10} className="text-gray-300" />
                    </div>
                    <span className="text-sm font-bold text-dark-1">{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-dark-1 uppercase tracking-[0.3em]">Total Allocation</span>
                    <span className="text-4xl font-black text-primary tracking-tighter italic">₹{total.toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                    VAT and custom duties are calculated based on your destination protocol during secure checkout.
                  </p>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-premium py-6 flex items-center justify-center space-x-6 group shadow-2xl shadow-primary/20"
                >
                  <span>Begin Secure Transfer</span>
                  <FaChevronRight size={10} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              {/* Promo / Trust Info */}
              <div className="px-8 space-y-6">
                {subtotal < 5000 && (
                  <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
                        Add ₹{(5000 - subtotal).toLocaleString()} more for complimentary white-glove shipping.
                     </p>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-4 text-gray-300">
                   <FaShieldAlt size={16} />
                   <p className="text-[9px] font-black uppercase tracking-widest">End-to-end encrypted acquisition</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
