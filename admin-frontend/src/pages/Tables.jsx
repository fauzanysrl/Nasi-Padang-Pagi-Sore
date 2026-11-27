import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Tables() {
  const [occupiedTables, setOccupiedTables] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake static tables schema (1 to 20)
  const totalTables = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/tables/status');
      if (res.data.success) {
        setOccupiedTables(res.data.data.occupied || {});
        setReservations(res.data.data.reservations || []);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {totalTables.map(tableNumber => {
          // Check if table is occupied
          const occupiedInfo = occupiedTables[tableNumber];
          
          // Check if there's a reservation for today for this table that's pending/confirmed
          // Find the earliest upcoming reservation
          const tableReservations = reservations.filter(r => r.table_number === tableNumber);
          const nextReservation = tableReservations.length > 0 ? tableReservations[0] : null;
          
          let statusColor = "bg-green-100 text-green-700 border-green-200";
          let statusText = "Available";

          if (occupiedInfo) {
            statusColor = "bg-red-100 text-red-700 border-red-200";
            statusText = "Occupied";
          } else if (nextReservation) {
            statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
            statusText = "Reserved";
          }

          return (
            <div key={tableNumber} className={`relative p-6 rounded-2xl border-2 flex flex-col items-center transition-all hover:scale-[1.02] cursor-pointer ${statusColor}`}>
              <div className="text-4xl font-black mb-2 opacity-80">#{tableNumber}</div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4 shadow-sm bg-white/50 px-3 py-1 rounded-full">{statusText}</p>
              
              <div className="w-full text-sm text-left mt-auto bg-white/60 p-3 rounded-xl min-h-[100px] flex flex-col justify-center">
                
                {occupiedInfo ? (
                  <>
                    <p className="font-bold text-gray-800 border-b border-red-200 pb-1 mb-2">
                       <span className="text-xs font-normal text-gray-500 block">Atas Nama:</span>
                       {occupiedInfo.customer_name} 
                    </p>
                    {occupiedInfo.items.length > 0 ? (
                      <ul className="text-xs text-gray-700 space-y-1 mt-1 max-h-24 overflow-y-auto pr-1">
                        {occupiedInfo.items.map((item, idx) => (
                           <li key={idx} className="flex justify-between">
                             <span className="truncate pr-2">- {item.menu_name}</span>
                             <span className="font-semibold px-1 bg-red-100 rounded">x{item.quantity}</span>
                           </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-500 italic mt-1">Belum ada pesanan terinput.</p>
                    )}
                  </>
                ) : nextReservation ? (
                  <>
                    <p className="font-bold text-gray-800 border-b border-yellow-200 pb-1 mb-2">
                      <span className="text-xs font-normal text-gray-500 block">Reservasi Atas Nama:</span>
                      {nextReservation.customer_name}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(nextReservation.reservation_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    {nextReservation.phone && <p className="text-xs text-gray-500 mt-1">{nextReservation.phone}</p>}
                  </>
                ) : (
                  <div className="text-center text-gray-400 opacity-60 m-auto flex flex-col items-center">
                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span>Meja kosong dan siap digunakan.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
