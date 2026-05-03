import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/wishlistSlice';
import { FaShoppingCart, FaRegHeart, FaHeart, FaExpandAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';

import { useAuth } from '@clerk/clerk-react';
import { addToCart, syncCartItem } from '../redux/cartSlice';

const ProductCard = ({ product, layout = 'grid' }) => {
  const dispatch = useDispatch();
  const { getToken, isSignedIn } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const existItem = cartItems.find((x) => x._id === product._id);
    const currentQty = existItem ? existItem.qty : 0;

    if (currentQty + 1 > product.stock) {
      return toast.error(`Only ${product.stock} units in stock.`, {
        position: 'bottom-right',
        style: { background: '#ef4444', color: '#fff' }
      });
    }

    dispatch(addToCart({ product, qty: 1 }));
    
    // Sync with backend if signed in
    if (isSignedIn) {
      const token = await getToken();
      if (token) {
        dispatch(syncCartItem({ product, qty: 1, token }));
      }
    }

    toast.success(`${product.name} added to cart!`, {
        position: 'bottom-right'
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (isWishlisted) {
      toast.error(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist`);
    }
  };

  if (layout === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-6 items-center bg-white p-5 border border-gray-50 group hover:shadow-xl transition-all duration-500 w-full overflow-hidden">
        <Link to={`/products/${product._id}`} className="w-full sm:w-48 aspect-square overflow-hidden bg-gray-50 relative shrink-0">
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="flex-1 space-y-3 min-w-0">
          <div className="space-y-1">
             <div className="flex items-center space-x-3 mb-1">
                <StarRating rating={product.averageRating} size={10} />
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{product.category?.name}</span>
             </div>
             <Link to={`/products/${product._id}`} className="text-xl font-light tracking-tight text-dark-1 hover:text-primary transition-colors uppercase italic truncate block">{product.name}</Link>
             <p className="text-gray-400 font-light text-xs line-clamp-2 max-w-xl leading-relaxed">{product.description}</p>
          </div>
          <div className="flex items-center space-x-6 pt-1">
            <span className="text-xl font-black text-dark-1">₹{product.price.toFixed(2)}</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-premium flex items-center space-x-2 px-6 py-2.5 text-[10px] disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <FaShoppingCart size={12} />
                <span>Add to Cart</span>
              </button>
              <button 
                onClick={handleWishlist}
                className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100' : 'text-dark-1 hover:bg-gray-50'}`}
              >
                {isWishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white group w-full overflow-hidden">
      {/* Image Container - Ultra Compact Square */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 mb-3">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.createdAt && (new Date() - new Date(product.createdAt) < 7 * 24 * 60 * 60 * 1000) && (
            <span className="bg-dark-1 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">New</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-primary text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">Low Stock</span>
          )}
          {product.stock <= 0 && (
            <span className="bg-gray-400 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 shadow-lg">Sold Out</span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="hidden lg:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-9 h-9 bg-white text-dark-1 rounded-full flex items-center justify-center shadow-xl hover:bg-dark-1 hover:text-white transition-all translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <FaShoppingCart size={12} />
          </button>
          <Link
            to={`/products/${product._id}`}
            className="w-9 h-9 bg-white text-dark-1 rounded-full flex items-center justify-center shadow-xl hover:bg-dark-1 hover:text-white transition-all translate-y-2 group-hover:translate-y-0 duration-500 delay-75"
          >
            <FaExpandAlt size={12} />
          </Link>
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl transition-all translate-y-2 group-hover:translate-y-0 duration-700 delay-150 ${isWishlisted ? 'text-red-500' : 'text-dark-1 hover:bg-dark-1 hover:text-white'}`}
          >
            {isWishlisted ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
          </button>
        </div>
      </div>
      
      {/* Product Details - Compact & Clean */}
      <div className="text-center space-y-1 px-1">
        <div className="space-y-0.5">
          <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em]">{product.category?.name || 'AURA PREMIUM'}</p>
          <Link 
            to={`/products/${product._id}`} 
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-dark-1 hover:text-primary transition-colors block truncate"
          >
            {product.name}
          </Link>
        </div>
        <div className="flex flex-col items-center gap-0.5">
           <StarRating rating={product.averageRating} size={6} />
           <p className="text-[11px] font-black text-dark-1 tracking-wider">
            ₹{product.price.toFixed(2)}
          </p>
        </div>
        
        {/* Mobile Quick Actions */}
        <div className="lg:hidden flex gap-1 pt-1">
           <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex-1 py-1.5 bg-gray-50 text-dark-1 text-[7px] font-black uppercase tracking-widest border border-gray-100 active:bg-dark-1 active:text-white transition-all"
          >
            Add +
          </button>
          <button 
            onClick={handleWishlist}
            className={`px-2.5 bg-gray-50 border border-gray-100 active:bg-red-50 ${isWishlisted ? 'text-red-500' : 'text-dark-1'}`}
          >
            {isWishlisted ? <FaHeart size={10} /> : <FaRegHeart size={10} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
