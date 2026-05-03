import React from 'react';
import { FaChevronDown, FaUndoAlt } from 'react-icons/fa';

const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange, sort, onSortChange }) => {
  return (
    <div className="space-y-12 py-4">
      {/* Collections Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-1 dark:text-gray-400">Collections</h3>
          <span className="w-8 h-[1px] bg-gray-100 dark:bg-dark-3"></span>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`group flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${
              selectedCategory === ''
                ? 'bg-primary/5 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <span>All Products</span>
            {selectedCategory === '' && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat._id)}
              className={`group flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${
                selectedCategory === cat._id
                  ? 'bg-primary/5 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat._id && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-1 dark:text-gray-400">Budget</h3>
          <span className="w-8 h-[1px] bg-gray-100 dark:bg-dark-3"></span>
        </div>
        <div className="space-y-6 px-2">
          <div className="flex justify-between items-baseline">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Cap</p>
            <p className="text-xl font-black text-primary tracking-tighter italic">
              ₹{priceRange[1].toLocaleString()}
            </p>
          </div>
          <div className="relative h-6 flex items-center">
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
              className="w-full h-[2px] bg-gray-100 dark:bg-dark-3 appearance-none cursor-pointer accent-primary hover:accent-dark-1 transition-all"
            />
          </div>
          <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <span>Entry ₹0</span>
            <span>Peak ₹100k</span>
          </div>
        </div>
      </div>

      {/* Sort Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-1 dark:text-gray-400">Priority</h3>
          <span className="w-8 h-[1px] bg-gray-100 dark:bg-dark-3"></span>
        </div>
        <div className="relative group">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-dark-2 border border-transparent hover:border-gray-100 dark:hover:border-dark-3 py-4 px-6 text-[10px] font-black uppercase tracking-widest text-dark-1 dark:text-gray-200 appearance-none cursor-pointer outline-none transition-all focus:ring-1 focus:ring-primary/20"
          >
            <option value="-createdAt">Newest Dispatch</option>
            <option value="price">Price: Ascending</option>
            <option value="-price">Price: Descending</option>
            <option value="-averageRating">Elite Rating</option>
          </select>
          <FaChevronDown size={10} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-primary transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Reset Action */}
      <div className="pt-10">
        <button
          onClick={() => {
            onCategoryChange('');
            onPriceChange([0, 100000]);
            onSortChange('-createdAt');
          }}
          className="w-full flex items-center justify-center space-x-3 py-4 border border-dashed border-gray-200 dark:border-dark-3 text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-500"
        >
          <FaUndoAlt size={10} />
          <span>Clear Protocols</span>
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
