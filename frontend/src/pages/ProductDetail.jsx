import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/axios';
import { FaStar, FaShoppingCart, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useUser, useAuth, SignedIn, SignedOut } from '@clerk/clerk-react';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';
import { addToCart, syncCartItem } from '../redux/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
        
        if (user) {
          api.post(`/track/${id}`, {}, {
            headers: { 'x-clerk-user-id': user.id }
          }).catch(err => console.error('Tracking failed:', err));
        } else {
          api.post(`/track/${id}`).catch(err => console.error('Tracking failed:', err));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleAddToCart = async () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const currentQty = existItem ? existItem.qty : 0;

    if (currentQty + qty > product.stock) {
      return toast.error(`Only ${product.stock - currentQty} more units available.`, {
        position: 'bottom-right',
        style: { background: '#ef4444', color: '#fff' }
      });
    }

    dispatch(addToCart({ product, qty }));
    
    // Sync with backend if signed in
    if (isSignedIn) {
      const token = await getToken();
      if (token) {
        dispatch(syncCartItem({ product, qty, token }));
      }
    }

    toast.success(`${product.name} added to cart!`, {
        position: 'bottom-right'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 animate-pulse bg-white">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 aspect-square bg-gray-50" />
          <div className="w-full md:w-1/2 space-y-8 py-4 sm:py-10">
            <div className="h-10 bg-gray-50 rounded w-3/4" />
            <div className="h-4 bg-gray-50 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-40 bg-white uppercase font-black tracking-widest text-gray-200">Product not found</div>;

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 lg:py-24">
        
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start overflow-hidden">
          
          {/* Left: Compact Image Gallery */}
          <div className="w-full space-y-6">
            <div className="aspect-square bg-gray-50 overflow-hidden border border-gray-100 relative group">
              <img
                src={product.images[activeImage] || 'https://via.placeholder.com/800'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 border transition-all ${
                      activeImage === i ? 'border-dark-1 scale-105 shadow-sm' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Premium Information Stack */}
          <div className="w-full min-w-0 space-y-10 lg:py-2">
            
            <div className="space-y-6">
              <nav className="flex text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 space-x-2 truncate">
                <Link to="/" className="hover:text-primary transition-colors">AURA</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-primary transition-colors">VAULT</Link>
                <span>/</span>
                <span className="text-dark-1">{product.name}</span>
              </nav>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">{product.category?.name || 'Limited Series'}</p>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light tracking-tighter text-dark-1 uppercase italic leading-[1.1] break-words">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <StarRating rating={product.averageRating} size={10} count={reviews.length} />
                <div className="hidden sm:block h-4 w-px bg-gray-100" />
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 border border-gray-100 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `Vault: ${product.stock} units` : 'Vault Depleted'}
                </span>
              </div>
            </div>

            <div className="text-4xl lg:text-5xl font-black text-dark-1 tracking-tighter border-b border-gray-50 pb-8">
              ${product.price.toFixed(2)}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-1">Curation details</p>
              <p className="text-gray-500 font-light text-base leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            {product.stock > 0 && (
              <div className="space-y-8 pt-6">
                <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-8">
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-100 sm:w-48">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-6 py-4 text-gray-400 hover:text-dark-1 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-[11px] font-black text-dark-1">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="px-6 py-4 text-gray-400 hover:text-dark-1 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="btn-premium flex-1 flex items-center justify-center space-x-4 py-5 shadow-2xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <FaShoppingCart size={16} />
                    <span>Secure Selection</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-gray-50">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-dark-1 shadow-sm">
                   <FaTruck size={14} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-dark-1">Global Dispatch</p>
                  <p className="text-[9px] text-gray-400 font-medium uppercase">Priority Service</p>
                </div>
              </div>
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-dark-1 shadow-sm">
                   <FaUndo size={14} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-dark-1">30-Day Protocol</p>
                  <p className="text-[9px] text-gray-400 font-medium uppercase">Elite Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Journal Section (Reviews) */}
        <div className="mt-32 pt-24 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
            
            <div className="lg:col-span-7 space-y-16 min-w-0">
              <div className="space-y-3">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Testimonials</p>
                <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-dark-1 uppercase italic leading-none">Aura Experiences</h2>
              </div>
              
              {reviews.length === 0 ? (
                <div className="py-24 text-center bg-gray-50/50 rounded-sm border border-gray-50">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] italic">The record is currently empty. Be the first to share.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50/30 p-8 sm:p-10 border border-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 group min-w-0 relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors duration-700" />
                      
                      <div className="flex justify-between items-start mb-8 gap-6">
                        <div className="space-y-2 min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-dark-1 truncate">{review.user?.name || 'Verified Member'}</p>
                          <StarRating rating={review.rating} size={9} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 shrink-0">
                          {new Date(review.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <span className="absolute -top-4 -left-4 text-4xl text-primary/10 font-serif">“</span>
                        <p className="text-gray-500 font-light italic leading-relaxed text-base max-w-2xl pl-4 break-words">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 min-w-0">
              <SignedIn>
                 <div className="sticky top-32">
                    <ReviewForm productId={id} onReviewAdded={fetchReviews} />
                 </div>
              </SignedIn>
              <SignedOut>
                <div className="bg-dark-1 p-12 lg:p-16 text-center space-y-10 rounded-sm shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="space-y-4">
                    <h3 className="text-white text-xl lg:text-2xl font-black uppercase tracking-widest italic">Identity Check</h3>
                    <p className="text-gray-500 text-[10px] font-medium leading-relaxed uppercase tracking-[0.4em]">Aura authentication required to access member journals.</p>
                  </div>
                  <Link to="/sign-in" className="btn-premium w-full bg-white text-dark-1 hover:bg-gray-100 flex items-center justify-center py-5 shadow-2xl">
                    Sign In
                  </Link>
                </div>
              </SignedOut>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
