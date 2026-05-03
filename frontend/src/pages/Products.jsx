import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import useDebounce from '../hooks/useDebounce';
import { FaSlidersH, FaTimes, FaThLarge, FaThList, FaSearch, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); 
  
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  
  const debouncedSearch = useDebounce(searchInput, 500);

  // Active filters count
  const activeFiltersCount = [
    category !== '',
    priceRange[1] !== 100000,
    sort !== '-createdAt'
  ].filter(Boolean).length;

  useEffect(() => {
    const catParam = searchParams.get('category') || '';
    const sortParam = searchParams.get('sort') || '-createdAt';
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const searchParam = searchParams.get('search') || '';

    setCategory(catParam);
    setSort(sortParam);
    setPage(pageParam);
    setSearchInput(searchParam);
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, priceRange, sort, debouncedSearch, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (category) params.append('category', category);
      if (debouncedSearch) params.append('search', debouncedSearch);
      params.append('price[lte]', priceRange[1].toString());

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.data || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ ...Object.fromEntries(searchParams), page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefine = (key, value) => {
    const newParams = { ...Object.fromEntries(searchParams), [key]: value, page: '1' };
    if (value === '' || !value) delete newParams[key];
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="section-container py-12 md:py-20 lg:py-24">
        
        {/* Page Header */}
        <div className="mb-16 lg:mb-24 text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-2">
             <span className="w-10 h-[1.5px] bg-primary/20"></span>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Vault</p>
             <span className="w-10 h-[1.5px] bg-primary/20"></span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-dark-1 uppercase italic leading-none">
             The <span className="font-black not-italic text-primary">Collection</span>
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed px-4">
             Curating high-performance essentials for the modern pioneer. Excellence is not a choice, it's an aura.
          </p>
        </div>

        {/* Dynamic Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-8 mb-16 pb-10 border-b border-gray-100">
          <div className="flex flex-1 items-center space-x-8 min-w-[320px]">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden group relative flex items-center space-x-4 bg-white border border-gray-100 text-dark-1 py-4 px-8 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
            >
              <FaSlidersH />
              <span>Refine</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[8px] border-2 border-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {/* Search Input - Clean Minimalist */}
            <div className="relative group flex-1 max-w-md hidden md:block">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={12} />
              <input
                type="text"
                placeholder="DISCOVER PIECES..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-14 pr-6 text-[10px] font-bold uppercase tracking-[0.2em] focus:ring-1 focus:ring-primary/20 focus:border-primary/30 text-dark-1 placeholder:text-gray-300 transition-all shadow-sm hover:border-primary/20"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex items-center space-x-6 border-r border-gray-100 dark:border-dark-3 pr-8">
               <button onClick={() => setViewMode('grid')} className={`p-2 transition-all ${viewMode === 'grid' ? 'text-primary scale-110' : 'text-gray-300 hover:text-dark-1 dark:hover:text-white'}`}><FaThLarge size={14} /></button>
               <button onClick={() => setViewMode('list')} className={`p-2 transition-all ${viewMode === 'list' ? 'text-primary scale-110' : 'text-gray-300 hover:text-dark-1 dark:hover:text-white'}`}><FaThList size={14} /></button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">Priority:</span>
              <select
                value={sort}
                onChange={(e) => handleRefine('sort', e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] focus:ring-0 cursor-pointer text-dark-1 dark:text-gray-300 hover:text-primary transition-colors outline-none"
              >
                <option value="-createdAt">New Arrivals</option>
                <option value="price">Price: Low-High</option>
                <option value="-price">Price: High-Low</option>
                <option value="-averageRating">Popularity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Desktop Persistent Sidebar */}
          <aside className="hidden lg:block lg:w-72 shrink-0 animate-fade-in">
             <div className="sticky top-32">
                <div className="mb-10 flex items-center space-x-4">
                   <FaFilter className="text-primary" size={12} />
                   <h2 className="text-xs font-black uppercase tracking-[0.4em] text-dark-1 dark:text-white">Refinement</h2>
                </div>
                <FilterSidebar 
                  categories={categories} 
                  selectedCategory={category} 
                  onCategoryChange={(cat) => handleRefine('category', cat)} 
                  priceRange={priceRange} 
                  onPriceChange={(range) => setPriceRange(range)} 
                  sort={sort} 
                  onSortChange={(s) => handleRefine('sort', s)} 
                />
             </div>
          </aside>

          {/* Product Feed */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-16">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-6 animate-pulse">
                    <div className="aspect-[4/5] bg-gray-50 dark:bg-dark-2" />
                    <div className="space-y-2">
                       <div className="h-2 bg-gray-50 dark:bg-dark-2 w-1/2 mx-auto" />
                       <div className="h-3 bg-gray-50 dark:bg-dark-2 w-3/4 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-16' : 'grid-cols-1 gap-12'}`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} layout={viewMode} />
                  ))}
                </div>
                
                {/* Pagination - Premium Design */}
                {totalPages > 1 && (
                  <div className="mt-32 flex items-center justify-center space-x-10 border-t border-gray-50 dark:border-dark-3 pt-16">
                    <button 
                      onClick={() => handlePageChange(page - 1)} 
                      disabled={page === 1} 
                      className="p-5 border border-gray-100 dark:border-dark-3 rounded-full text-dark-1 dark:text-white disabled:text-gray-200 dark:disabled:text-dark-3 disabled:cursor-not-allowed hover:bg-dark-1 hover:text-white dark:hover:bg-primary transition-all duration-500"
                    >
                      <FaChevronLeft size={10} />
                    </button>
                    
                    <div className="flex items-center space-x-6">
                      {[...Array(totalPages)].map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => handlePageChange(i + 1)} 
                          className={`group relative text-[11px] font-black tracking-widest transition-all duration-500 ${
                            page === i + 1 ? 'text-primary' : 'text-gray-300 hover:text-dark-1 dark:hover:text-white'
                          }`}
                        >
                          <span className="relative z-10">{String(i + 1).padStart(2, '0')}</span>
                          {page === i + 1 && (
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handlePageChange(page + 1)} 
                      disabled={page === totalPages} 
                      className="p-5 border border-gray-100 dark:border-dark-3 rounded-full text-dark-1 dark:text-white disabled:text-gray-200 dark:disabled:text-dark-3 disabled:cursor-not-allowed hover:bg-dark-1 hover:text-white dark:hover:bg-primary transition-all duration-500"
                    >
                      <FaChevronRight size={10} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 px-6 text-center space-y-10 animate-fade-in">
                <div className="relative">
                   <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                      <FaSearch size={32} className="text-gray-200" />
                   </div>
                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/10 rounded-full animate-ping" />
                </div>
                
                <div className="space-y-4 max-w-sm">
                  <h3 className="text-2xl font-light tracking-tight text-dark-1 uppercase italic leading-none">
                    No matches found in <span className="font-black not-italic">The Vault</span>
                  </h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
                    Our curation protocols returned zero coordinates. Adjust your filters or reset to browse the full collection.
                  </p>
                </div>

                <button 
                  onClick={() => { setSearchInput(''); setSearchParams({}); setPriceRange([0, 100000]); }} 
                  className="px-12 py-5 border border-primary text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl shadow-primary/5 active:scale-95"
                >
                   Reset All Protocols
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE REFINEMENT DRAWER - ELITE INTERFACE */}
      <div className={`fixed inset-0 z-[600] transition-all duration-700 ease-in-out ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-dark-1/80 backdrop-blur-md transition-opacity duration-700 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsSidebarOpen(false)} 
        />
        
        {/* Panel */}
        <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="space-y-1">
               <p className="text-primary text-[8px] font-black uppercase tracking-[0.5em]">Terminal</p>
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-dark-1">Refine Catalog</h3>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-3 text-dark-1 hover:rotate-90 transition-transform duration-500"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
            <FilterSidebar 
              categories={categories} 
              selectedCategory={category} 
              onCategoryChange={(cat) => handleRefine('category', cat)} 
              priceRange={priceRange} 
              onPriceChange={(range) => setPriceRange(range)} 
              sort={sort} 
              onSortChange={(s) => handleRefine('sort', s)} 
            />
          </div>
          
          <div className="p-10 border-t border-gray-50 bg-white">
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="w-full py-6 flex items-center justify-center space-x-6 group bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:bg-dark-1 transition-all"
            >
              <span>Commit Changes</span>
              <FaChevronRight size={10} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
