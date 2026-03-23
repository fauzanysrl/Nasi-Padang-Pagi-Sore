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

    console.log("Summary:", data);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Summary Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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
    
    console.log("Analytics:", rows);
    
    if (rows.length === 0) {
      return res.json({ success: true, data: [], message: 'No data available for chart' });
    }
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Analytics Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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
    console.log("Weekly SQL Raw:", rows);

    // Normalize Mon-Sun
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const normalizedData = daysOfWeek.map(dayName => {
      const found = rows.find(r => r.day === dayName);
      return {
        day: dayName.substring(0, 3), // e.g. "Mon"
        total: found ? found.total : 0
      };
    });

    console.log("Weekly Normalized:", normalizedData);
    res.json({ success: true, data: normalizedData });
  } catch (error) {
    console.error("Weekly Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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
    console.log("Recent Orders:", rows);
    
    if (rows.length === 0) {
      return res.json({ success: true, data: [], message: 'No recent orders' });
    }
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Recent Orders Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
