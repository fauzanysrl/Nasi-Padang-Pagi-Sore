const db = require('../config/db');

exports.getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data pelanggan', data: rows, meta: { total: rows.length } });
  } catch (error) {
    console.error('getCustomers error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pelanggan', data: null, error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan', data: null });
    res.status(200).json({ success: true, message: 'Berhasil mengambil data pelanggan', data: rows[0] });
  } catch (error) {
    console.error('getCustomerById error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pelanggan', data: null, error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    console.log('createCustomer req.body:', req.body);

    if (!name) {
      return res.status(400).json({ success: false, message: 'Field name wajib diisi', data: null });
    }

    const [result] = await db.query(
      'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      [name, phone || null, email || null, address || null]
    );
    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan pelanggan',
      data: { id: result.insertId, name, phone: phone || null, email: email || null, address: address || null }
    });
  } catch (error) {
    console.error('createCustomer error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menambahkan pelanggan', data: null, error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    console.log('updateCustomer req.body:', req.body);

    if (!name) {
      return res.status(400).json({ success: false, message: 'Field name wajib diisi', data: null });
    }

    const [result] = await db.query(
      'UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, phone || null, email || null, address || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan', data: null });

    res.status(200).json({
      success: true,
      message: 'Berhasil memperbarui pelanggan',
      data: { id: parseInt(id), name, phone: phone || null, email: email || null, address: address || null }
    });
  } catch (error) {
    console.error('updateCustomer error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal memperbarui pelanggan', data: null, error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan', data: null });

    res.status(200).json({ success: true, message: 'Berhasil menghapus pelanggan', data: null });
  } catch (error) {
    console.error('deleteCustomer error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menghapus pelanggan', data: null, error: error.message });
  }
};
