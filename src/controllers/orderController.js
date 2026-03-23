const db = require('../config/db');

exports.getOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { user_id, customer_name, table_number, total_price, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (user_id, customer_name, table_number, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, customer_name, table_number, total_price, status || 'pending']
    );
    res.status(201).json({ success: true, data: { id: result.insertId, user_id, customer_name, table_number, total_price, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: { id, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: { message: 'Order deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
