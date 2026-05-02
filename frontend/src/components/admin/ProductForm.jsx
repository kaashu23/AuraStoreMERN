import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { FaTimes, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ProductForm = ({ product, onClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?._id || product.category,
        stock: product.stock,
        images: product.images || [],
      });
      setPreviews(product.images || []);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemovePreview = (index, isExisting) => {
    if (isExisting) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
      setPreviews(previews.filter((_, i) => i !== index));
    } else {
      const newFiles = [...selectedFiles];
      const selectedIndex = index - (formData.images?.length || 0);
      newFiles.splice(selectedIndex, 1);
      setSelectedFiles(newFiles);
      setPreviews(previews.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await window.Clerk.session.getToken();
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      
      const cat = categories.find(c => c._id === formData.category);
      if (cat) data.append('categoryName', cat.name);

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      if (product) {
        await api.put(`/products/${product._id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Product updated');
      } else {
        await api.post('/products', data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Product created');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-1/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl animate-fade-in">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">
            {product ? 'Edit Product' : 'New Arrival'}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-dark-1 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Product Name</label>
              <input
                required
                type="text"
                placeholder="NAME"
                className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Category</label>
              <select
                required
                className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">SELECT COLLECTION</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Description</label>
            <textarea
              required
              rows="4"
              placeholder="DETAILS"
              className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Price (USD)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Stock Available</label>
              <input
                required
                type="number"
                placeholder="0"
                className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Product Gallery</label>
            <div className="grid grid-cols-4 gap-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden group border border-gray-50">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(i, i < (formData.images?.length || 0))}
                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square bg-gray-50 border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-300">
                  <FaCloudUploadAlt size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 italic">Max 5 images. Primary image first.</p>
          </div>

          <div className="pt-10 border-t border-gray-50 flex justify-center space-x-10">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-dark-1 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-premium min-w-[200px] flex items-center justify-center space-x-3"
            >
              {loading && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />}
              <span>{product ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
