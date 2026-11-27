const db = require('../config/db');

exports.getTableStatus = async (req, res) => {
  try {
    // Get all pending orders (Occupied tables)
    // Here we also try to get the ordered items to display "Order apa saja yang dipesan"
    const [orders] = await db.query(`
      SELECT o.id, o.table_number, o.customer_name, o.total_price, o.status,
             oi.menu_id, oi.quantity, m.name as menu_name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE o.status = 'pending'
    `);

    // Group items by order
    const occupiedTablesMap = {};
    orders.forEach(row => {
      // Handle edge cases where table might be null or undefined
      if (!row.table_number) return;
      
      const tId = parseInt(row.table_number);
      
      if (!occupiedTablesMap[tId]) {
        occupiedTablesMap[tId] = {
          order_id: row.id,
          customer_name: row.customer_name,
          total_price: row.total_price,
          items: []
        };
      }
      
      if (row.menu_name) {
        occupiedTablesMap[tId].items.push({
          menu_name: row.menu_name,
          quantity: row.quantity
        });
      }
    });

    // Get Active Reservations (pending/confirmed for today or future)
    // To keep it simple, we just get 'pending' or 'confirmed' reservations
    const [reservations] = await db.query(`
      SELECT id, customer_name, reservation_time, table_number, status
      FROM reservations
      WHERE status IN ('pending', 'confirmed')
      AND DATE(reservation_time) >= CURDATE()
    `);

    // Construct response
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil status meja',
      data: {
        occupied: occupiedTablesMap,
        reservations: reservations
      }
    });
  } catch (error) {
    console.error("Tables Status Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil status meja', data: null, error: error.message });
  }
};
