import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FaChevronRight, FaHistory } from 'react-icons/fa';

const RecentlyViewed = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchRecentViews();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const fetchRecentViews = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get('/track/recent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching recent views:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading || products.length === 0) return null;

  return (
    <section className="w-full overflow-hidden py-12 border-t border-gray-50">
      <div className="section-container">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-primary/5 p-2 rounded-lg text-primary">
            <FaHistory size={16} />
          </div>
          <h2 className="text-xl font-black text-dark-1 uppercase tracking-widest italic">Acquisition History</h2>
        </div>

        <div className="relative group -mx-2">
          {/* Constrained scrollable container */}
          <div className="flex gap-6 overflow-x-auto pb-6 px-2 scrollbar-hide scroll-smooth">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="w-48 md:w-56 shrink-0 bg-white border border-gray-50 p-4 hover:shadow-2xl transition-all duration-700 group/card relative overflow-hidden"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden mb-4 rounded-sm">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-1000"
                  />
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{product.category?.name || 'Limited'}</p>
                   <h3 className="font-bold text-dark-1 text-[11px] uppercase truncate transition-colors group-hover/card:text-primary">
                    {product.name}
                   </h3>
                   <div className="flex justify-between items-center pt-1">
                     <p className="text-primary font-black text-xs tracking-tighter">₹{product.price.toFixed(2)}</p>
                     <div className="opacity-0 group-hover/card:opacity-100 transition-all translate-x-2 group-hover/card:translate-x-0">
                        <FaChevronRight size={8} className="text-primary" />
                     </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Subtle Fades for scroll indication */}
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
