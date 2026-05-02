import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { FaEdit, FaTrash, FaPlus, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const AdminCategories = () => {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cat = null) => {
    setEditingCategory(cat);
    setName(cat ? cat.name : '');
    setPreview(cat ? cat.image : '');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('name', name);
      if (selectedFile) formData.append('image', selectedFile);

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData, config);
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData, config);
        toast.success('Category created');
      }
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      const token = await getToken();
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-12 bg-white min-h-screen">
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-light tracking-tight text-dark-1 uppercase italic">Store Collections</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Manage your product categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-premium flex items-center space-x-3"
        >
          <FaPlus size={10} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="aspect-[16/10] bg-gray-50 animate-pulse" />)
        ) : categories.map((cat) => (
          <div key={cat._id} className="group relative bg-white border border-gray-50 overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="aspect-[16/10] relative">
              <img src={cat.image || 'https://via.placeholder.com/600x400'} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-dark-1/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="flex space-x-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <button onClick={() => openModal(cat)} className="w-10 h-10 bg-white text-dark-1 flex items-center justify-center rounded-full hover:bg-primary hover:text-white transition-all shadow-xl">
                      <FaEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="w-10 h-10 bg-white text-red-600 flex items-center justify-center rounded-full hover:bg-red-600 hover:text-white transition-all shadow-xl">
                      <FaTrash size={14} />
                    </button>
                 </div>
              </div>
            </div>
            <div className="p-6 text-center space-y-1">
              <h3 className="text-sm font-black text-dark-1 uppercase tracking-[0.2em]">{cat.name}</h3>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">ID: {cat._id.slice(-6)}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-1/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg shadow-2xl animate-fade-in">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">{editingCategory ? 'Edit Collection' : 'New Collection'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-dark-1 transition-colors"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Category Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. SUMMER ESSENTIALS"
                  className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-bold tracking-widest uppercase focus:ring-1 focus:ring-primary placeholder:text-gray-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Collection Cover</label>
                <div className="relative h-56 bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden group">
                  {preview ? (
                    <>
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-dark-1/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer bg-white text-dark-1 px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all">
                          Change Image
                          <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center space-y-4 text-gray-300 hover:text-primary transition-colors">
                      <FaCloudUploadAlt size={48} className="font-light" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Select Cover Image</span>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-center space-x-6 border-t border-gray-50 pt-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-dark-1 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-premium min-w-[200px] flex items-center justify-center space-x-3"
                >
                  {saving && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />}
                  <span>{editingCategory ? 'Update Collection' : 'Create Collection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
