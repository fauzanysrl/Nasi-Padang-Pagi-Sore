import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Table from '../components/Table';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State for Viewing Order
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orderRes, itemsRes, menusRes] = await Promise.all([
        api.get('/orders'),
        api.get('/order-items'),
        api.get('/menus')
      ]);
      if (orderRes.data.success) setOrders(orderRes.data.data);
      if (itemsRes.data.success) setOrderItems(itemsRes.data.data);
      if (menusRes.data.success) setMenus(menusRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getOrderItemsList = (orderId) => {
    return orderItems
      .filter(item => item.order_id === orderId)
      .map(item => {
        const menu = menus.find(m => m.id === item.menu_id);
        return {
          ...item,
          menuName: menu ? menu.name : 'Unknown Item'
        };
      });
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toString().includes(search)
  );

  const columns = [
    { label: 'Order ID' },
    { label: 'Customer' },
    { label: 'Total' },
    { label: 'Status' },
    { label: 'Date' },
    { label: 'Actions', className: 'text-right' },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Orders...</div>;

  const currentOrderItems = selectedOrder ? getOrderItemsList(selectedOrder.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer orders and transactions</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm w-64"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <Table 
        columns={columns}
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        emptyMessage="No orders found."
        renderRow={(o) => (
          <>
            <td className="px-6 py-4 font-semibold text-gray-700">#{o.id}</td>
            <td className="px-6 py-4 font-medium">{o.customer_name}</td>
            <td className="px-6 py-4 font-bold text-gray-800">Rp {parseFloat(o.total_price).toLocaleString('id-ID')}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                o.status === 'paid' ? 'bg-green-100 text-green-700' :
                o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {o.status.toUpperCase()}
              </span>
            </td>
            <td className="px-6 py-4 text-gray-500 text-sm">{new Date(o.created_at).toLocaleString('id-ID')}</td>
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => handleViewOrder(o)} 
                className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition"
                title="View Details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </td>
          </>
        )}
      />

      {selectedOrder && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title={`Order #${selectedOrder.id}`}
          subtitle={`Placed by ${selectedOrder.customer_name}`}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                <p className={`text-sm font-bold mt-1 ${
                  selectedOrder.status === 'paid' ? 'text-green-600' :
                  selectedOrder.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {selectedOrder.status.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</p>
                <p className="text-sm font-medium text-gray-800 mt-1">{new Date(selectedOrder.created_at).toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Order Items</h3>
              <ul className="space-y-3">
                {currentOrderItems.length > 0 ? currentOrderItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{item.menuName}</p>
                      <p className="text-xs text-gray-500">{item.quantity}x @ Rp {parseFloat(item.price).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="font-bold text-gray-800">
                      Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                    </div>
                  </li>
                )) : (
                  <li className="text-sm text-gray-500 text-center py-2">No items found for this order.</li>
                )}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-600">Total</span>
              <span className="text-2xl font-black text-green-700">Rp {parseFloat(selectedOrder.total_price).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
