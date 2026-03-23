import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, menuRes] = await Promise.all([
        api.get('/categories'),
        api.get('/menus')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (menuRes.data.success) setMenus(menuRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMenuCountForCategory = (categoryId) => {
    return menus.filter(m => m.category_id === categoryId).length;
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ id: null, name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/categories/${formData.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert('Error saving category: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage food and beverage categories</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm flex items-center space-x-2"
        >
          <span>+ Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleOpenModal(c)} className="text-gray-400 hover:text-blue-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{c.name}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{c.description || 'No description provided.'}</p>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Items</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                {getMenuCountForCategory(c.id)} items
              </span>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500">No categories found. Start by creating one!</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={formData.id ? "Edit Category" : "Add New Category"}
        subtitle="Organize your menu items efficiently."
        footer={
          <>
            <button type="button" onClick={closeModal} className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" form="category-form" className="px-5 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm">Save</button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Main Course"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              rows="3"
              placeholder="Description of the category..."
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none" 
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
}
