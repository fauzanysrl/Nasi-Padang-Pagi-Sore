const db = require('../config/db');

exports.getOrderItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM order_items');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data item pesanan', data: rows, meta: { total: rows.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data item pesanan', data: null, error: error.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const { order_id, menu_id, quantity, price } = req.body;
    if (!order_id || !menu_id || !quantity || !price) {
        return res.status(400).json({ success: false, message: 'Field order_id, menu_id, quantity, dan price wajib diisi', data: null });
    }

    const [result] = await db.query(
      'INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, menu_id, quantity, price]
    );
    res.status(201).json({ success: true, message: 'Berhasil menambahkan item ke pesanan', data: { id: result.insertId, order_id, menu_id, quantity, price } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan item ke pesanan', data: null, error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM order_items WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Item pesanan tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil menghapus item pesanan', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus item pesanan', data: null, error: error.message });
  }
};
