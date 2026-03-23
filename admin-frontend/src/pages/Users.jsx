import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/users');
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { label: 'ID' },
    { label: 'User' },
    { label: 'Role' },
    { label: 'Actions', className: 'text-right' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Users...</div>;

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
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm flex items-center space-x-2">
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      <Table 
        columns={columns}
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        emptyMessage="No users found."
        renderRow={(u) => (
          <>
            <td className="px-6 py-4 font-semibold text-gray-700">#{u.id}</td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {u.role.toUpperCase()}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end space-x-3 text-sm">
                <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
