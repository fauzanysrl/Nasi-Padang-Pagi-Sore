const db = require('../config/db');

exports.getOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data pesanan', data: rows, meta: { total: rows.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan', data: null, error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan', data: null });
    res.status(200).json({ success: true, message: 'Berhasil mengambil data pesanan', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan', data: null, error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { user_id, customer_name, table_number, total_price, status } = req.body;
    if (!user_id || !customer_name || !table_number) {
        return res.status(400).json({ success: false, message: 'Field user_id, customer_name, dan table_number wajib diisi', data: null });
    }

    const [result] = await db.query(
      'INSERT INTO orders (user_id, customer_name, table_number, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, customer_name, table_number, total_price || 0, status || 'pending']
    );
    res.status(201).json({ success: true, message: 'Berhasil membuat pesanan', data: { id: result.insertId, user_id, customer_name, table_number, total_price: total_price || 0, status: status || 'pending' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat pesanan', data: null, error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ success: false, message: 'Field status wajib diisi', data: null });
    }

    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil memperbarui status pesanan', data: { id: parseInt(id), status } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan', data: null, error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil menghapus pesanan', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pesanan', data: null, error: error.message });
  }
};
