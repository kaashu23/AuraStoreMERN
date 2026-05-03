import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserButton, SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-react';
import { FaShoppingCart, FaSearch, FaRegHeart, FaHeart, FaBars, FaTimes, FaChevronRight, FaUserShield, FaSpinner, FaArrowRight } from 'react-icons/fa';
import api from '../utils/axios';
import useDebounce from '../hooks/useDebounce';
import { fetchCart, addToCart, clearCart } from '../redux/cartSlice';
import { clearWishlist } from '../redux/wishlistSlice';
import { useDispatch } from 'react-redux';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + (item?.qty || 0), 0);
  
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;
  
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Handle Cart sync and cleanup
  useEffect(() => {
    if (isSignedIn) {
      const syncUserCart = async () => {
        const token = await getToken();
        if (token) {
          dispatch(fetchCart(token));
        }
      };
      syncUserCart();
    } else if (userLoaded && !isSignedIn) {
      // User is logged out, clear the left-over cart and wishlist items
      dispatch(clearCart());
      dispatch(clearWishlist());
    }
  }, [isSignedIn, userLoaded, dispatch, getToken]);

  // Fetch live search results
  useEffect(() => {
    const fetchLiveResults = async () => {
      if (debouncedSearch.length < 2) {
        setSearchResults([]);
        setShowVault(false);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await api.get(`/products?search=${debouncedSearch}&limit=8`);
        setSearchResults(data.data || []);
        if (data.data?.length > 0) setShowVault(true);
      } catch (error) {
        console.error('Live search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchLiveResults();
  }, [debouncedSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowVault(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setShowVault(false);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Collection', path: '/products?collection=new' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="glass-header w-full border-b border-gray-100 shadow-sm sticky top-0 z-[200]">
        <div className="section-container">
          <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
            
            {/* Left: Logo & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden text-dark-1 p-2 -ml-2"
              >
                <FaBars size={20} />
              </button>
              <Link to="/" className="flex-shrink-0 group">
                <span className="text-2xl md:text-3xl font-serif font-light italic tracking-tight text-dark-1 group-hover:text-primary transition-colors duration-500">
                  Aura Store
                </span>
              </Link>
            </div>

            {/* Center: Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-2 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Search & Icons */}
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
              
              {/* Professional Integrated Search Bar */}
              <div ref={searchRef} className="hidden md:relative md:block group">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-48 lg:w-72 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-full py-2.5 pl-10 pr-10 text-[11px] font-bold uppercase tracking-widest outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowVault(true)}
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={12} />
                  {isSearching && (
                    <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={12} />
                  )}
                </form>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-3">
                {isAdmin && (
                  <Link to="/admin" className="text-primary p-2 hover:scale-110 transition-transform" title="Admin">
                    <FaUserShield size={18} />
                  </Link>
                )}
                
                <Link to="/wishlist" className="relative text-dark-1 p-2 hidden sm:block">
                  {wishlistCount > 0 ? <FaHeart size={18} className="text-red-500" /> : <FaRegHeart size={18} />}
                  {wishlistCount > 0 && <span className="absolute top-1 right-1 bg-dark-1 text-white text-[7px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border border-white">{wishlistCount}</span>}
                </Link>

                <Link to="/cart" className="relative text-dark-1 p-2">
                  <FaShoppingCart size={18} />
                  {cartCount > 0 && <span className="absolute top-1 right-1 bg-primary text-white text-[7px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border border-white">{cartCount}</span>}
                </Link>

                <div className="hidden sm:block border-l border-gray-100 h-6 mx-2" />

                <div className="flex items-center">
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                  <SignedOut>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <Link to="/sign-in" className="text-[11px] sm:text-[10px] font-black uppercase tracking-widest text-dark-1 hover:text-primary transition-all">
                        Login
                      </Link>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH VAULT OVERLAY - Slides behind Navbar */}
      <div 
        className={`fixed top-16 md:top-20 lg:top-24 left-0 w-full bg-white shadow-2xl border-t border-gray-50 z-[190] transition-all duration-700 ease-in-out transform ${
          showVault ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="section-container py-8 md:py-12 flex flex-col max-h-[80vh]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-50">
            <div className="space-y-1 min-w-0 max-w-full overflow-hidden">
               <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Live Discovery</p>
               <h3 className="text-lg md:text-xl font-light italic tracking-tight text-dark-1 truncate w-full">
                 Showing matches for: <span className="font-black">"{searchQuery}"</span>
               </h3>
            </div>
            <Link 
              to={`/products?search=${searchQuery}`} 
              onClick={() => setShowVault(false)}
              className="group flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-colors shrink-0 whitespace-nowrap bg-gray-50/50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-lg sm:rounded-none w-full sm:w-auto justify-center sm:justify-start"
            >
              <span>Explore All Results</span>
              <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-6 sm:gap-10 pb-6">
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  onClick={() => { setSearchQuery(''); setShowVault(false); }}
                  className="w-36 sm:w-48 group/item flex flex-col space-y-3 animate-fade-in shrink-0"
                >
                  <div className="aspect-[4/5] w-full bg-gray-50 overflow-hidden border border-gray-100 relative">
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt="" 
                      className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-1000" 
                    />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                     <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest truncate">{product.category?.name || 'AURA VAULT'}</p>
                     <h4 className="text-[10px] sm:text-xs font-bold text-dark-1 uppercase truncate tracking-tight">{product.name}</h4>
                     <p className="text-[10px] sm:text-xs font-black text-primary tracking-tighter">₹{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 text-center">
             <p className="text-[8px] font-black text-gray-200 uppercase tracking-[0.5em]">Aura Store Premium Search Terminal</p>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[600] lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-dark-1/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white transition-transform duration-700 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <span className="text-lg font-black tracking-tighter uppercase italic text-dark-1">Directory</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-dark-1">
              <FaTimes size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-12 px-8">
            <form onSubmit={handleSearchSubmit} className="mb-10 relative">
              <input
                type="text"
                placeholder="SEARCH..."
                className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-10 text-xs font-black tracking-widest outline-none focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            </form>
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="flex justify-between items-center py-5 text-base font-black uppercase tracking-[0.2em] text-dark-1 border-b border-gray-50 active:bg-gray-50 px-2 transition-all" onClick={() => setIsOpen(false)}>
                  <span>{link.name}</span>
                  <FaChevronRight size={10} className="text-gray-200" />
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex justify-between items-center py-5 text-base font-black uppercase tracking-[0.2em] text-primary border-b border-gray-50 active:bg-primary/5 px-2 transition-all italic" onClick={() => setIsOpen(false)}>
                  <span className="flex items-center space-x-3"><FaUserShield /><span>Control Vault</span></span>
                  <FaChevronRight size={10} className="opacity-30" />
                </Link>
              )}
            </nav>
            <div className="mt-16 space-y-6">
              <SignedOut>
                <div className="flex flex-col space-y-3">
                  <Link to="/sign-in" className="btn-premium w-full text-center block py-4 shadow-xl shadow-primary/10" onClick={() => setIsOpen(false)}>
                    Login to Account
                  </Link>
                </div>
              </SignedOut>
              <Link to="/wishlist" className="flex justify-center items-center space-x-6 text-gray-400 group active:text-red-500 transition-all" onClick={() => setIsOpen(false)}>
                <FaRegHeart size={20} className="group-active:scale-125 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Wishlist Collection ({wishlistCount})</span>
              </Link>
            </div>
          </div>
          <div className="p-10 bg-gray-50 text-center border-t border-gray-100"><p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">Aura Store Premium Interface</p></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
