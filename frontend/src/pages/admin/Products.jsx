import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaCheckSquare, FaSquare, FaTools, FaChevronDown, FaChevronUp, FaBox } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import ProductForm from '../../components/admin/ProductForm';

const AdminProducts = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({ price: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?search=${search}&limit=200`);
      const productList = data.data || [];
      setProducts(productList);
      
      // Initialize all categories as collapsed (folded) by default
      const cats = {};
      productList.forEach(p => {
        const catName = p.category?.name || 'Uncategorized';
        cats[catName] = false;
      });
      setExpandedCategories(cats);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Group products by category safely
  const groupedProducts = products.reduce((acc, product) => {
    if (!product) return acc;
    const categoryName = product.category?.name || 'Uncategorized';
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});

  const toggleCategory = (catName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length && products.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p._id));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const token = await getToken();
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${name} deleted`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    try {
      const token = await getToken();
      await api.post('/products/bulk-delete', { ids: selectedIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Products deleted');
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      toast.error('Bulk delete failed');
    }
  };

  const handleBulkUpdate = async (e) => {
    e.preventDefault();
    const update = {};
    if (bulkUpdateData.price) update.price = parseFloat(bulkUpdateData.price);
    if (bulkUpdateData.stock) update.stock = parseInt(bulkUpdateData.stock);

    if (Object.keys(update).length === 0) return toast.error('Nothing to update');

    try {
      const token = await getToken();
      await api.put('/products/bulk-update', { ids: selectedIds, update }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bulk update successful');
      setSelectedIds([]);
      setIsBulkUpdateOpen(false);
      setBulkUpdateData({ price: '', stock: '' });
      fetchProducts();
    } catch (error) {
      toast.error('Bulk update failed');
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-extrabold text-dark-1 uppercase tracking-tighter italic">Product Vault</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-primary outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
          </div>
          <button
            onClick={openAddForm}
            className="btn-premium flex items-center space-x-3 shrink-0 py-3 px-8 shadow-xl shadow-primary/20"
          >
            <FaPlus size={10} />
            <span className="text-[10px] font-black uppercase tracking-widest">New Piece</span>
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-dark-1 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 animate-fade-in shadow-2xl">
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">{selectedIds.length} assets selected</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBulkUpdateOpen(!isBulkUpdateOpen)}
              className="bg-white/10 text-white px-6 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center space-x-3 border border-white/10"
            >
              <FaTools size={10} />
              <span>Modify</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-6 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center space-x-3 shadow-lg"
            >
              <FaTrash size={10} />
              <span>Purge</span>
            </button>
          </div>

          {isBulkUpdateOpen && (
            <form onSubmit={handleBulkUpdate} className="w-full mt-6 pt-6 border-t border-white/5 flex flex-wrap items-end gap-6">
               <div className="space-y-3 flex-1 min-w-[120px]">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Valuation Update (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white w-full focus:ring-1 focus:ring-primary outline-none"
                    value={bulkUpdateData.price}
                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, price: e.target.value })}
                  />
               </div>
               <div className="space-y-3 flex-1 min-w-[120px]">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Allocation Update</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white w-full focus:ring-1 focus:ring-primary outline-none"
                    value={bulkUpdateData.stock}
                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, stock: e.target.value })}
                  />
               </div>
               <button type="submit" className="bg-primary text-white px-10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all w-full sm:w-auto">
                  Sync Protocol
               </button>
            </form>
          )}
        </div>
      )}

      {/* Grouped Table View */}
      <div className="space-y-12">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : Object.keys(groupedProducts).length > 0 ? (
          Object.entries(groupedProducts).map(([catName, items]) => (
            <div key={catName} className="space-y-6">
               <button 
                 onClick={() => toggleCategory(catName)}
                 className="flex items-center space-x-4 group w-full text-left"
               >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-dark-1 group-hover:bg-primary group-hover:text-white transition-all">
                     {expandedCategories[catName] ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-dark-1">{catName}</h2>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{items.length} Unique Assets</p>
                  </div>
                  <div className="flex-1 h-[1px] bg-gray-100 group-hover:bg-primary/20 transition-all" />
               </button>

               {expandedCategories[catName] && (
                 <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-gray-50/50 border-b border-gray-50">
                          <tr>
                            <th className="p-6 w-12 text-center">
                               <FaBox size={14} className="text-gray-300 mx-auto" />
                            </th>
                            <th className="p-6 text-[9px] uppercase tracking-widest font-black text-gray-400">Inventory Asset</th>
                            <th className="p-6 text-[9px] uppercase tracking-widest font-black text-gray-400 text-center">Market Valuation</th>
                            <th className="p-6 text-[9px] uppercase tracking-widest font-black text-gray-400 text-center">Protocol Status</th>
                            <th className="p-6 text-[9px] uppercase tracking-widest font-black text-gray-400 text-right">Operations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {items.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50/80 transition-colors group">
                              <td className="p-6 text-center">
                                <button onClick={() => handleToggleSelect(p._id)} className={`${selectedIds.includes(p._id) ? 'text-primary' : 'text-gray-200'} hover:text-primary transition-colors`}>
                                  {selectedIds.includes(p._id) ? <FaCheckSquare size={18} /> : <FaSquare size={18} />}
                                </button>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center space-x-6">
                                  <div className="w-14 h-14 bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                    <img src={p.images?.[0] || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="font-black text-xs uppercase tracking-tight text-dark-1">{p.name}</span>
                                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest truncate max-w-[200px]">ID: {p._id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6 text-center">
                                <span className="font-black text-xs text-primary italic">₹{p.price?.toLocaleString()}</span>
                              </td>
                              <td className="p-6 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                                  p.stock > 10 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                  {p.stock} Units Secure
                                </span>
                              </td>
                              <td className="p-6 text-right">
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => openEditForm(p)}
                                    className="w-9 h-9 bg-gray-50 text-dark-1 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                                  >
                                    <FaEdit size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(p._id, p.name)}
                                    className="w-9 h-9 bg-gray-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
               )}
            </div>
          ))
        ) : (
          <div className="text-center py-40 border border-dashed border-gray-100 rounded-3xl">
             <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-[10px]">Vault is currently empty</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSave={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminProducts;
