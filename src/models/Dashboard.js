const db = require('../config/db');

const Dashboard = {
  getSummary: async () => {
    // 1. totalOrders
    const [ordersCount] = await db.query('SELECT COUNT(*) as total FROM orders');
    // 2. revenue (sum of paid orders)
    const [revenueRow] = await db.query('SELECT SUM(total_price) as revenue FROM orders WHERE status = "paid"');
    // 3. activeTables (dummy = 12)
    const activeTables = 12;
    // 4. totalMenu
    const [menuCount] = await db.query('SELECT COUNT(*) as total FROM menus');

    return {
      totalOrders: ordersCount[0].total || 0,
      revenue: parseFloat(revenueRow[0].revenue) || 0,
      activeTables: activeTables,
      totalMenu: menuCount[0].total || 0
    };
  },

  getAnalytics: async () => {
    // Analytics (Total orders per day)
    const query = `
      SELECT DATE(created_at) as date, COUNT(*) as total_orders 
      FROM orders 
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getWeekly: async () => {
    // Weekly Overview (Orders by day of the week)
    const query = `
      SELECT DAYNAME(created_at) as day, COUNT(*) as total_orders 
      FROM orders 
      WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY DAYNAME(created_at)
      ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getRecentOrders: async () => {
    // Get last 5 orders
    const query = `
      SELECT id as order_id, customer_name, total_price, status, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    const [rows] = await db.query(query);
    return rows;
  }
};

module.exports = Dashboard;
