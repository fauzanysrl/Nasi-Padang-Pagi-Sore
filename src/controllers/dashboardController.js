const db = require('../config/db');

exports.getSummary = async (req, res) => {
  try {
    const [ordersCount] = await db.query('SELECT COUNT(*) as total FROM orders');
    const [revenueRow] = await db.query('SELECT SUM(total_price) as revenue FROM orders WHERE status = "paid"');
    const [menuCount] = await db.query('SELECT COUNT(*) as total FROM menus');
    
    const data = {
      totalOrders: ordersCount[0].total || 0,
      revenue: parseFloat(revenueRow[0].revenue) || 0,
      totalMenu: menuCount[0].total || 0,
      activeTables: 12
    };

    res.status(200).json({ success: true, message: 'Berhasil mengambil data summary dashboard', data });
  } catch (error) {
    console.error("Summary Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data summary dashboard', data: null, error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const query = `
      SELECT DATE(created_at) as date, COUNT(*) as total
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    const [rows] = await db.query(query);
    
    if (rows.length === 0) {
      return res.status(200).json({ success: true, message: 'Tidak ada data analytic', data: [] });
    }
    res.status(200).json({ success: true, message: 'Berhasil mengambil data analytic dashboard', data: rows });
  } catch (error) {
    console.error("Analytics Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data analytic dashboard', data: null, error: error.message });
  }
};

exports.getWeekly = async (req, res) => {
  try {
    const query = `
      SELECT DAYNAME(created_at) as day, COUNT(*) as total
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DAYNAME(created_at)
    `;
    const [rows] = await db.query(query);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const normalizedData = daysOfWeek.map(dayName => {
      const found = rows.find(r => r.day === dayName);
      return {
        day: dayName.substring(0, 3), 
        total: found ? found.total : 0
      };
    });

    res.status(200).json({ success: true, message: 'Berhasil mengambil data mingguan pesanan', data: normalizedData });
  } catch (error) {
    console.error("Weekly Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data mingguan pesanan', data: null, error: error.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const query = `
      SELECT id as order_id, customer_name, total_price, status, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    const [rows] = await db.query(query);
    
    if (rows.length === 0) {
      return res.status(200).json({ success: true, message: 'Tidak ada pesanan terbaru', data: [] });
    }
    res.status(200).json({ success: true, message: 'Berhasil mengambil pesanan terbaru', data: rows });
  } catch (error) {
    console.error("Recent Orders Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil pesanan terbaru', data: null, error: error.message });
  }
};
