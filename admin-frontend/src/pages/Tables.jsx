import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Tables() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake static tables schema (1 to 20)
  const totalTables = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        // Find only orders that are pending to determine table occupancy
        setOrders(res.data.data.filter(o => o.status === 'pending'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Tables...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Table Management</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time status of restaurant tables</p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm font-medium text-gray-600">Reserved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {totalTables.map(tableNumber => {
          // Check if table is occupied
          const orderOnTable = orders.find(o => parseInt(o.table_number) === tableNumber);
          // Simulate some random reserved tables just to show the UI requirement
          const isReserved = tableNumber === 7 || tableNumber === 15; 
          
          let statusColor = "bg-green-100 text-green-700 border-green-200";
          let statusText = "Available";

          if (orderOnTable) {
            statusColor = "bg-red-100 text-red-700 border-red-200";
            statusText = "Occupied";
          } else if (isReserved) {
            statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
            statusText = "Reserved";
          }

          return (
            <div key={tableNumber} className={`relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer ${statusColor}`}>
              <div className="text-4xl font-black mb-2 opacity-80">#{tableNumber}</div>
              <p className="text-xs font-bold tracking-widest uppercase">{statusText}</p>
              {orderOnTable && (
                <div className="mt-3 bg-white/80 rounded px-2 py-1 text-xs font-bold text-gray-800 shadow-sm">
                  Order #{orderOnTable.id}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
