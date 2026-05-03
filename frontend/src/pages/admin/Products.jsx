import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaCheckSquare, FaSquare, FaTools } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import ProductForm from '../../components/admin/ProductForm';

const AdminProducts = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modal state
  const [isFormOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({ price: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?search=${search}&limit=100`);
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
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
    setIsSidebarOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsSidebarOpen(true);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 bg-white min-h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-extrabold text-dark-1 uppercase tracking-tighter italic">Product Vault</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
          <button
            onClick={openAddForm}
            className="btn-premium flex items-center space-x-2 shrink-0 py-2.5 px-6"
          >
            <FaPlus size={10} />
            <span className="hidden sm:inline text-[10px]">Add Product</span>
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-primary/5 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center border border-primary/10 gap-6 animate-fade-in">
          <span className="text-primary font-black text-xs uppercase tracking-widest">{selectedIds.length} items selected</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBulkUpdateOpen(!isBulkUpdateOpen)}
              className="bg-dark-1 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center space-x-2"
            >
              <FaTools size={10} />
              <span>Bulk Update</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center space-x-2"
            >
              <FaTrash size={10} />
              <span>Delete All</span>
            </button>
          </div>

          {isBulkUpdateOpen && (
            <form onSubmit={handleBulkUpdate} className="w-full mt-6 pt-6 border-t border-primary/10 flex flex-wrap items-end gap-6">
               <div className="space-y-2 flex-1 min-w-[120px]">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">New Price</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-xs font-bold w-full focus:ring-1 focus:ring-primary"
                    value={bulkUpdateData.price}
                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, price: e.target.value })}
                  />
               </div>
               <div className="space-y-2 flex-1 min-w-[120px]">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">New Stock</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-xs font-bold w-full focus:ring-1 focus:ring-primary"
                    value={bulkUpdateData.stock}
                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, stock: e.target.value })}
                  />
               </div>
               <button type="submit" className="btn-premium px-8 py-2.5 w-full sm:w-auto">
                  Execute Changes
               </button>
            </form>
          )}
        </div>
      )}

      {/* Responsive Table Wrapper */}
      <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 w-12 text-center">
                  <button onClick={handleSelectAll} className="text-gray-300 hover:text-primary transition-all">
                    {selectedIds.length === products.length && products.length > 0 ? <FaCheckSquare size={18} /> : <FaSquare size={18} />}
                  </button>
                </th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-black text-gray-400">Inventory Item</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-black text-gray-400">Collection</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-black text-gray-400">Retail Price</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-black text-gray-400">Status</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-black text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="p-4 h-20 bg-gray-50/50" />
                  </tr>
                ))
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 text-center">
                    <button onClick={() => handleToggleSelect(p._id)} className={`${selectedIds.includes(p._id) ? 'text-primary' : 'text-gray-200'} hover:text-primary transition-colors`}>
                      {selectedIds.includes(p._id) ? <FaCheckSquare size={18} /> : <FaSquare size={18} />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 overflow-hidden shrink-0">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest text-dark-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category?.name || 'Uncategorized'}</td>
                  <td className="p-4 font-black text-sm text-primary">₹{p.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      p.stock > 10 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditForm(p)}
                        className="w-8 h-8 bg-gray-50 text-dark-1 flex items-center justify-center rounded-full hover:bg-primary hover:text-white transition-all"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="w-8 h-8 bg-gray-50 text-red-500 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-all"
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

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsSidebarOpen(false)}
          onSave={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminProducts;
