import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { FaArrowRight, FaTruck, FaUndo, FaShieldAlt, FaPlay, FaShoppingBag } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/products?limit=5&sort=-createdAt');
        setFeaturedProducts(data.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      
      {/* Hero Section - Elite Split Layout */}
      <section className="relative w-full bg-white flex flex-col lg:flex-row items-stretch min-h-[550px] lg:h-[calc(100vh-80px)] max-h-[800px]">
        {/* Left Side: Cinematic Visual */}
        <div className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-auto overflow-hidden order-1 lg:order-1">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=90"
            alt="Premium Fashion"
            className="w-full h-full object-cover animate-fade-in object-[center_20%] lg:object-center scale-105"
          />
          <div className="absolute inset-0 bg-dark-1/5 sm:bg-transparent" />
          <div className="hidden sm:flex absolute bottom-8 lg:bottom-12 right-8 lg:right-12 bg-white/20 backdrop-blur-xl p-4 rounded-full border border-white/30 text-white animate-pulse">
            <FaPlay size={10} className="ml-0.5" />
          </div>
        </div>

        {/* Right Side: High-Contrast Messaging */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 lg:p-24 xl:p-32 flex flex-col justify-center space-y-8 order-2 lg:order-2 bg-white relative">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[15rem] font-black text-gray-50/50 pointer-events-none select-none z-0 tracking-tighter uppercase">Aura</span>
          
          <div className="space-y-4 sm:space-y-6 relative z-10">
            <div className="flex items-center space-x-3">
              <span className="w-6 sm:w-10 h-[1.5px] bg-primary"></span>
              <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-primary">Pre-Fall 2026</p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-dark-1 leading-[1.05] uppercase italic">
              Cultivate <br />
              <span className="font-black not-italic text-dark-1">Your Identity.</span>
            </h1>
            <p className="text-gray-400 font-light text-base sm:text-lg max-w-sm leading-relaxed">
              Curating high-performance essentials for the modern pioneer. Excellence is not a choice, it's an aura.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 pt-4">
            <Link to="/products" className="btn-premium group flex items-center justify-center space-x-4 py-4 sm:py-5 px-10">
              <span>Enter Store</span>
              <FaArrowRight size={10} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/about" className="px-10 py-4 sm:py-5 border border-gray-100 text-dark-1 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all text-center">
              Our Ethos
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Markers - High Performance Responsive */}
      <section className="py-16 sm:py-24 border-b border-gray-50">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 lg:gap-20 text-center">
            {[
              { icon: <FaTruck />, title: 'Global Dispatch', desc: 'Complimentary shipping on orders over ₹5000' },
              { icon: <FaShieldAlt />, title: 'Vault Security', desc: 'End-to-end encryption for your peace of mind' },
              { icon: <FaUndo />, title: 'Elite Exchange', desc: 'Hassle-free 30-day digital return protocol' },
            ].map((item, i) => (
              <div key={i} className="space-y-4 flex flex-col items-center group animate-fade-in">
                <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-xl text-dark-1 group-hover:bg-dark-1 group-hover:text-white transition-all duration-700">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-dark-1">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 font-medium max-w-[180px] leading-relaxed mx-auto uppercase">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Feed - Modern Responsive Grid */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-16 sm:mb-24 gap-6">
            <div className="text-center sm:text-left space-y-4">
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">The Vault</p>
               <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-dark-1 uppercase italic leading-none">New Arrivals</h2>
            </div>
            <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2 hover:text-primary hover:border-primary transition-all">Explore Collections</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-8 gap-y-16">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Full-Width Brand Banner */}
      <section className="mb-24 sm:mb-32">
        <div className="relative h-[400px] sm:h-[600px] w-full overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=90" 
            alt="Luxury Statement" 
            className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-dark-1/50 flex flex-col items-center justify-center text-center p-8 backdrop-blur-[2px]">
            <h2 className="text-white text-3xl sm:text-6xl font-light italic uppercase tracking-tighter mb-10 leading-tight">Identity is the new currency.</h2>
            <Link to="/contact" className="px-12 py-5 border border-white text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-dark-1 transition-all">
              Membership Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Magazine Section */}
      <section className="py-24 sm:py-32 bg-gray-50/30">
        <div className="section-container text-center space-y-16 sm:space-y-24">
          <div className="space-y-4">
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Inside Aura</p>
             <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-dark-1 uppercase italic leading-none">The Journal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-20">
            {[
              { cat: 'LIFESTYLE', title: 'Minimalism in 2026', date: 'MAY 12', img: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { cat: 'FASHION', title: 'Sustainable Silk Journey', date: 'MAY 08', img: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { cat: 'TECH', title: 'Next-Gen Wearables', date: 'MAY 05', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            ].map((blog, i) => (
              <div key={i} className="group text-left space-y-6">
                <div className="aspect-[16/11] overflow-hidden bg-white shadow-sm transition-all duration-700 group-hover:shadow-2xl">
                  <img src={blog.img} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-primary">
                    <span>{blog.cat}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-gray-400">{blog.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-dark-1 group-hover:text-primary transition-colors uppercase leading-tight">{blog.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Terminal */}
      <section className="section-container py-32">
        <div className="bg-dark-1 p-12 sm:p-24 md:p-32 flex flex-col items-center text-center relative overflow-hidden rounded-sm shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="relative z-10 space-y-12 w-full max-w-2xl">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-6xl font-light text-white tracking-tighter uppercase italic leading-tight">The Aura Circle</h2>
              <p className="text-gray-400 text-xs sm:text-sm font-light tracking-[0.2em] px-4 uppercase">Access private sales and limited dispatch notifications.</p>
            </div>
            
            <form className="flex flex-col sm:flex-row w-full gap-0 border-b border-white/10 focus-within:border-primary transition-all duration-500 pb-4">
              <input
                type="email"
                placeholder="ENTER YOUR PROTOCOL ADDRESS"
                className="flex-1 bg-transparent px-4 py-4 text-white text-[10px] font-black uppercase tracking-[0.3em] outline-none text-center sm:text-left placeholder:text-gray-800"
              />
              <button className="text-white text-[10px] font-black uppercase tracking-[0.5em] px-10 py-6 sm:py-0 hover:text-primary transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  );
};

export default Home;
