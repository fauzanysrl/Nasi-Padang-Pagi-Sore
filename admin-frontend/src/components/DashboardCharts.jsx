import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function DashboardCharts({ analyticsData, weeklyData }) {
  const [activeTab, setActiveTab] = useState("monthly");

  // Fallback Dummy Data format
  const fallbackAnalytics = [{ date: "2026-03-01", total: 0 }];
  const fallbackWeekly = [
    { day: "Mon", total: 0 }, { day: "Tue", total: 0 }, { day: "Wed", total: 0 },
    { day: "Thu", total: 0 }, { day: "Fri", total: 0 }, { day: "Sat", total: 0 }, { day: "Sun", total: 0 }
  ];

  const hasAnalytics = analyticsData && analyticsData.length > 0;
  const validAnalytics = hasAnalytics ? analyticsData : fallbackAnalytics;
  
  const hasWeekly = weeklyData && weeklyData.length > 0;
  const validWeekly = hasWeekly ? weeklyData : fallbackWeekly;

  // 🔥 DATA LINE CHART (Orders Analytics)
  const lineData = {
    labels: validAnalytics.map(a => new Date(a.date).toLocaleDateString()),
    datasets: [
      {
        label: "Orders per Day",
        data: validAnalytics.map(a => a.total),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        fill: true,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  // 🔥 DATA BAR CHART (Weekly)
  const barData = {
    labels: validWeekly.map(w => w.day),
    datasets: [
      {
        label: "Weekly Overview",
        data: validWeekly.map(w => w.total),
        backgroundColor: "#16a34a",
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* ===== LEFT: ORDERS ANALYTICS ===== */}
      <div className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">
          Orders Analytics
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Last 30 Days
        </p>

        {/* 🔥 TAB BUTTON */}
        <div className="flex gap-2 mb-4">
          {["monthly", "6months", "yearly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab === "monthly" && "Monthly"}
              {tab === "6months" && "6 Months"}
              {tab === "yearly" && "Yearly"}
            </button>
          ))}
        </div>

        {/* 🔥 LINE CHART */}
        {!hasAnalytics ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50">
            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <p className="text-gray-500 font-medium">No live data available</p>
            <p className="text-sm text-gray-400 mt-1">Showing dummy data</p>
            <div className="w-full h-48 opacity-40 mt-4 pointer-events-none">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        ) : (
          <Line data={lineData} options={lineOptions} />
        )}
      </div>

      {/* ===== RIGHT: WEEKLY OVERVIEW ===== */}
      <div className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">
          Weekly Overview
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Orders per day (Monday - Sunday)
        </p>

        {/* 🔥 BAR CHART */}
        {!hasWeekly ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50">
             <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             <p className="text-gray-500 font-medium">No live data available</p>
             <p className="text-sm text-gray-400 mt-1">Showing dummy data</p>
             <div className="w-full h-48 opacity-40 mt-4 pointer-events-none">
               <Bar data={barData} options={barOptions} />
             </div>
          </div>
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>

    </div>
  );
}