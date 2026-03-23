import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { LineChart, BarChart } from '../components/Chart';
import api from '../services/api';
import DashboardCharts from "../components/DashboardCharts";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalOrders: 0, revenue: 0, totalMenu: 0, activeTables: 0 });
  const [analytics, setAnalytics] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, anRes, weekRes, recentRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/analytics'),
          api.get('/dashboard/weekly'),
          api.get('/dashboard/recent-orders'),
        ]);

        if (sumRes.data.success) setSummary(sumRes.data.data);
        if (anRes.data.success) setAnalytics(anRes.data.data);
        if (weekRes.data.success) setWeekly(weekRes.data.data);
        if (recentRes.data.success) setRecentOrders(recentRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  const lineChartData = {
    labels: analytics.map(a => new Date(a.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Orders per Day',
        data: analytics.map(a => a.total_orders),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };

  const barChartData = {
    labels: weekly.map(w => w.day.substring(0, 3)),
    datasets: [
      {
        label: 'Weekly Overview',
        data: weekly.map(w => w.total_orders),
        backgroundColor: '#16a34a',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Orders" value={summary.totalOrders} />
        <Card title="Total Revenue" value={'Rp ' + summary.revenue.toLocaleString('id-ID')} />
        <Card title="Total Menu" value={summary.totalMenu} />
        <Card title="Active Tables" value={summary.activeTables} />
      </div>

      {/* Live Data Charts */}
      <DashboardCharts analyticsData={analytics} weeklyData={weekly} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">#{order.order_id}</td>
                  <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                  <td className="px-6 py-4">Rp {parseFloat(order.total_price).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
