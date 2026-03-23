import { useState } from 'react';

export default function Settings() {
  const [formData, setFormData] = useState({
    restaurantName: 'Nasi Padang Pagi Sore',
    email: 'admin@pagisore.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Padang Raya No. 1, Jakarta',
    taxRate: '10',
    currency: 'IDR',
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your restaurant application preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        <div className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-800">General Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Name</label>
              <input type="text" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Rate (%)</label>
              <input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"></textarea>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 flex justify-end space-x-3">
          <button type="button" className="px-5 py-2 font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition">Cancel</button>
          <button type="submit" className="px-5 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
