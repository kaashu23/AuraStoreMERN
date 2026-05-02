import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { FaExclamationTriangle, FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const LowStockTable = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockQty, setRestockQty] = useState({});

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get('/admin/low-stock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching low stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (id, name) => {
    const qtyToAdd = parseInt(restockQty[id]);
    if (!qtyToAdd || qtyToAdd <= 0) return toast.error('Enter valid quantity');

    try {
      const token = await getToken();
      const product = products.find(p => p._id === id);
      const newStock = product.stock + qtyToAdd;

      await api.put(`/products/${id}`, { stock: newStock }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Restocked ${name} to ${newStock} units`);
      setRestockQty({ ...restockQty, [id]: '' });
      fetchLowStock();
    } catch (error) {
      toast.error('Restock failed');
    }
  };

  if (loading) return <div className="h-64 bg-gray-50 animate-pulse rounded-[2.5rem]" />;

  if (products.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
      <div className="flex items-center space-x-4 text-red-500">
        <FaExclamationTriangle size={20} />
        <h3 className="text-xl font-black uppercase tracking-widest italic">Critical Inventory Alert</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-gray-400">Product</th>
              <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-gray-400">Current Stock</th>
              <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-gray-400 text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p._id} className="group">
                <td className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-50 overflow-hidden rounded-lg">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-xs text-dark-1 uppercase tracking-tight">{p.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="bg-red-50 text-red-600 px-3 py-1 text-[10px] font-black rounded-full border border-red-100">
                    {p.stock} units left
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <input
                      type="number"
                      placeholder="QTY"
                      className="w-16 bg-gray-50 border-none rounded-lg py-2 px-3 text-[10px] font-black focus:ring-1 focus:ring-primary"
                      value={restockQty[p._id] || ''}
                      onChange={(e) => setRestockQty({ ...restockQty, [p._id]: e.target.value })}
                    />
                    <button
                      onClick={() => handleRestock(p._id, p.name)}
                      className="text-primary hover:scale-110 transition-transform"
                    >
                      <FaPlusCircle size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockTable;
