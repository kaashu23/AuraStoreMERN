import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../redux/wishlistSlice';
import ProductCard from '../components/ProductCard';
import { FaHeart, FaArrowLeft, FaRegHeart } from 'react-icons/fa';

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="space-y-8 inline-block p-12 bg-gray-50/50 rounded-sm border border-gray-100">
          <FaRegHeart className="mx-auto text-6xl text-gray-200" />
          <div className="space-y-2">
            <h2 className="text-3xl font-light tracking-tight text-dark-1 uppercase italic">Your Wishlist is Empty</h2>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">Save your favorite items for later</p>
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
      <div className="section-container py-12 md:py-20">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 text-red-500 mb-2">
            <FaHeart size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Private Collection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-dark-1 uppercase italic">My Wishlist</h1>
          <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Items saved for your future self</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-24 text-center">
           <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-dark-1 transition-colors border-b border-gray-100 pb-2">
              Continue Shopping
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
