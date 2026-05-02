import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange, sort, onSortChange }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-10 h-fit sticky top-24 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6">Collections</h3>
        <div className="space-y-3">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all text-sm ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat._id)}
              className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all text-sm ${
                selectedCategory === cat._id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Budget</h3>
          <span className="text-sm font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
            ${priceRange[1]}
          </span>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <span>Min: $0</span>
          <span>Max: $5k</span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6">Sort By</h3>
        <div className="relative group">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 appearance-none cursor-pointer"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-averageRating">Best Rating</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <FaChevronDown size={12} />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onCategoryChange('');
          onPriceChange([0, 5000]);
          onSortChange('-createdAt');
        }}
        className="w-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors pt-4 border-t border-gray-100 dark:border-gray-800"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
