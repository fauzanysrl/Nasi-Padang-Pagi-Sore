import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', password: '', role: 'cashier' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Ensure interceptor handles Token, or we add it explicitly here just in case! 
      // (api.js already handles localStorage token interceptor)
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name || user.username || '',
        email: user.email || '',
        password: '', // Never pre-fill password
        role: user.role || 'cashier'
      });
    } else {
      setFormData({ id: null, name: '', email: '', password: '', role: 'cashier' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Exclude password if empty on update
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${formData.id}`, payload);
      } else {
        await api.post('/users', formData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert('Error saving user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  const columns = [
    { label: 'No' },
    { label: 'Username' },
    { label: 'Role' },
    { label: 'Created At' },
    { label: 'Actions', className: 'text-right' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Users...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system administrators and staff</p>
        </div>
        <div className="flex justify-end space-x-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
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
            <span>+ Create New User</span>
          </button>
        </div>
      </div>

      <Table 
        columns={columns}
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        emptyMessage="No users found."
        renderRow={(u, index) => (
          <>
            <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  {(u.name || u.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{u.name || u.username || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{u.email || 'No email'}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {(u.role || 'GUEST').toUpperCase()}
              </span>
            </td>
            <td className="px-6 py-4 text-gray-500 text-sm">
              {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end space-x-3 text-sm">
                <button 
                  onClick={() => handleOpenModal(u)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </td>
          </>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={formData.id ? "Edit User" : "Add New User"}
        subtitle="Fill in the details for the user."
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
              form="user-form"
              className="px-5 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              Save Details
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. John Doe"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              required 
              type="email" 
              placeholder="user@example.com"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password {formData.id && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}
            </label>
            <input 
              required={!formData.id}
              type="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select 
              required 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})} 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="waiter">Waiter</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
