import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import useDebounce from '../hooks/useDebounce';
import { FaSlidersH, FaTimes, FaThLarge, FaThList, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  
  const debouncedSearch = useDebounce(searchInput, 500);

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
      <div className="section-container py-12 md:py-20">
        
        {/* Page Header */}
        <div className="mb-12 md:mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-dark-1 uppercase italic leading-tight text-thin">The Collection</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Curated premium essentials</p>
        </div>

        {/* Normal Toolbar with Integrated Search */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-50">
          <div className="flex flex-1 items-center space-x-6 min-w-[300px]">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-dark-1 hover:text-primary transition-colors"
            >
              <FaSlidersH />
              <span>Refine</span>
            </button>
            
            {/* Search Input - Integrated & Normal Sized */}
            <div className="relative group flex-1 max-w-sm">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={12} />
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary shadow-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 border-r border-gray-100 pr-6">
               <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'text-dark-1' : 'text-gray-200'} hover:text-primary transition-colors`}><FaThLarge size={14} /></button>
               <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'text-dark-1' : 'text-gray-200'} hover:text-primary transition-colors`}><FaThList size={14} /></button>
            </div>
            <select
              value={sort}
              onChange={(e) => handleRefine('sort', e.target.value)}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-dark-2 hover:text-primary"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low-High</option>
              <option value="-price">Price: High-Low</option>
              <option value="-averageRating">Popularity</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-12">
                {[...Array(limit)].map((_, i) => (
                  <div key={i} className="space-y-6">
                    <div className="aspect-square bg-gray-50 animate-pulse" />
                    <div className="h-4 bg-gray-50 w-2/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-12' : 'grid-cols-1 gap-12'}`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} layout={viewMode} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-24 flex items-center justify-center space-x-8">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-4 border border-gray-100 rounded-full text-dark-1 disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-gray-50"><FaChevronLeft size={10} /></button>
                    <div className="flex items-center space-x-4">
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${page === i + 1 ? 'bg-dark-1 text-white shadow-xl scale-110' : 'text-gray-400 hover:text-dark-1'}`}>{i + 1}</button>
                      ))}
                    </div>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-4 border border-gray-100 rounded-full text-dark-1 disabled:text-gray-200 disabled:cursor-not-allowed hover:bg-gray-50"><FaChevronRight size={10} /></button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40 bg-gray-50/50 rounded-sm">
                <div className="text-2xl mb-6 opacity-40 italic font-light uppercase tracking-widest">No pieces found</div>
                <button onClick={() => { setSearchInput(''); setSearchParams({}); }} className="btn-premium">Clear All Refinements</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-dark-1/60 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
        <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.3em]">Refine Collection</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:rotate-90 transition-transform duration-300"><FaTimes size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FilterSidebar categories={categories} selectedCategory={category} onCategoryChange={(cat) => handleRefine('category', cat)} priceRange={priceRange} onPriceChange={(range) => setPriceRange(range)} sort={sort} onSortChange={(s) => handleRefine('sort', s)} />
          </div>
          <div className="p-8 border-t border-gray-50 bg-gray-50/50">
            <button onClick={() => setIsSidebarOpen(false)} className="btn-premium w-full">Show Results</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
