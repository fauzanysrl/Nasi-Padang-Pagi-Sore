import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { LineChart, BarChart } from '../components/Chart';
import api from '../services/api';

export default function Reports() {
  const [summary, setSummary] = useState({ totalOrders: 0, revenue: 0, totalMenu: 0 });
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [sumRes, weekRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/weekly'),
        ]);
        if (sumRes.data.success) setSummary(sumRes.data.data);
        if (weekRes.data.success) setWeekly(weekRes.data.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Generating Reports...</div>;

  const revenueData = {
    labels: weekly.map(w => w.day.substring(0, 3)),
    datasets: [
      {
        label: 'Orders Volume',
        data: weekly.map(w => w.total_orders),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Projected Sales',
        data: weekly.map(w => w.total_orders * 1.2), // Mock projection
        borderColor: '#9333ea',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into restaurant performance metrics</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Net Revenue" value={'Rp ' + summary.revenue.toLocaleString('id-ID')} bgColor="bg-gradient-to-br from-green-500 to-green-600 text-white" />
        <Card title="Total Orders" value={summary.totalOrders} />
        <Card title="Avg. Order Value" value={'Rp ' + (summary.totalOrders ? (summary.revenue / summary.totalOrders).toFixed(0) : 0).toLocaleString('id-ID')} />
        <Card title="Customer Satisfaction" value="4.8 / 5" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Performance Overview</h3>
        <div className="flex-1 relative">
          <LineChart data={revenueData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
