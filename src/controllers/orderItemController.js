const db = require('../config/db');

exports.getOrderItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM order_items');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const { order_id, menu_id, quantity, price } = req.body;
    const [result] = await db.query(
      'INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, menu_id, quantity, price]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, order_id, menu_id, quantity, price } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM order_items WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Order item not found' });
    res.json({ success: true, data: { message: 'Order item deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
