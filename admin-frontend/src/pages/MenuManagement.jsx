import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Table from '../components/Table';

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ 
    id: null, name: '', category_id: '', description: '', price: '', status: 'available', image_url: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setCategoriesError(null);
      const [menuRes, catRes] = await Promise.all([
        api.get('/menus').catch(e => ({ error: e })),
        api.get('/categories').catch(e => {
          setCategoriesError('Failed to load categories');
          return { error: e };
        })
      ]);
      if (menuRes && menuRes.data && menuRes.data.success) setMenus(menuRes.data.data);
      if (catRes && catRes.data && catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error(err);
      setCategoriesError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (menu = null) => {
    setImageFile(null);
    if (menu) {
      setFormData(menu);
      setImagePreview(menu.image_url ? `http://localhost:3000${menu.image_url}` : null);
    } else {
      setFormData({ 
        id: null, name: '', category_id: '', 
        description: '', price: '', status: 'available', image_url: '' 
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      try {
        await api.delete(`/menus/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete menu');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }
    
    try {
      // Create FormData instead of JSON
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category_id', formData.category_id);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description || '');
      submitData.append('status', formData.status);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (formData.id) {
        await api.put(`/menus/${formData.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/menus', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert('Error saving menu: ' + err.message);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Unknown';
  };

  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(search.toLowerCase()) ||
    getCategoryName(menu.category_id).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { label: 'Image' },
    { label: 'Menu Name' },
    { label: 'Category' },
    { label: 'Price' },
    { label: 'Status' },
    { label: 'Actions', className: 'text-right' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Menus...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your restaurant menu items</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search menus..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm w-64"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm flex items-center space-x-2"
          >
            <span>+ Add Menu</span>
          </button>
        </div>
      </div>

      {/* List / Table */}
      <Table 
        columns={columns}
        data={filteredMenus}
        keyExtractor={(item) => item.id}
        emptyMessage="No menu items match your search."
        renderRow={(menu) => (
          <>
            <td className="px-6 py-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                {menu.image_url ? (
                  <img src={`http://localhost:3000${menu.image_url}`} alt={menu.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="font-semibold text-gray-800">{menu.name}</span>
              {menu.description && (
                <p className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">{menu.description}</p>
              )}
            </td>
            <td className="px-6 py-4">
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {getCategoryName(menu.category_id)}
              </span>
            </td>
            <td className="px-6 py-4 font-medium text-gray-800">
              Rp {parseFloat(menu.price).toLocaleString('id-ID')}
            </td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${menu.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {menu.status === 'available' ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => handleOpenModal(menu)} 
                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(menu.id)} 
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={formData.id ? "Edit Menu Item" : "Add New Menu"}
        subtitle="Fill in the details for the menu item."
        footer={
          <>
            <button 
              type="button" 
              onClick={closeModal} 
              className="px-4 py-2 font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="menu-form"
              className="px-5 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              Save Details
            </button>
          </>
        }
      >
        <form id="menu-form" onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Menu Name</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Rendang Daging"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select 
                required 
                value={formData.category_id} 
                onChange={e => setFormData({...formData, category_id: parseInt(e.target.value) || ''})} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
                disabled={categories.length === 0}
              >
                <option value="" disabled>
                  {categoriesError ? 'Failed to load' : loading ? 'Loading categories...' : 'Select Category...'}
                </option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {categoriesError && <p className="text-xs text-red-500 mt-1">{categoriesError}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (Rp)</label>
              <input 
                required 
                type="number" 
                min="0"
                placeholder="25000"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea 
                rows="3"
                placeholder="Short description about the menu..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none" 
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={formData.status === 'available'}
                      onChange={(e) => setFormData({...formData, status: e.target.checked ? 'available' : 'unavailable'})}
                    />
                    <div className={`block w-14 h-8 rounded-full transition ${formData.status === 'available' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.status === 'available' ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">
                    {formData.status === 'available' ? 'Active' : 'Inactive'}
                  </div>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image Upload</label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative overflow-hidden group min-h-[160px]">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black/5" />
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-400 mb-2 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or WEBP (max. 10MB)</p>
                  </>
                )}
                
                {imagePreview && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-medium text-sm">Click to change image</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
