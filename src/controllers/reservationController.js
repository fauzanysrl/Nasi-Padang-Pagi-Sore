const db = require('../config/db');

exports.getReservations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservations ORDER BY reservation_time DESC');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data reservasi', data: rows, meta: { total: rows.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data reservasi', data: null, error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan', data: null });
    res.status(200).json({ success: true, message: 'Berhasil mengambil data reservasi', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data reservasi', data: null, error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { customer_name, phone, reservation_time, table_number, status } = req.body;
    if (!customer_name || !reservation_time || !table_number) {
        return res.status(400).json({ success: false, message: 'Field customer_name, reservation_time, dan table_number wajib diisi', data: null });
    }

    const [result] = await db.query(
      'INSERT INTO reservations (customer_name, phone, reservation_time, table_number, status) VALUES (?, ?, ?, ?, ?)',
      [customer_name, phone || null, reservation_time, table_number, status || 'pending']
    );
    res.status(201).json({ success: true, message: 'Berhasil membuat reservasi', data: { id: result.insertId, customer_name, phone: phone || null, reservation_time, table_number, status: status || 'pending' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat reservasi', data: null, error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, phone, reservation_time, table_number, status } = req.body;
    if (!customer_name || !reservation_time || !table_number || !status) {
        return res.status(400).json({ success: false, message: 'Field customer_name, reservation_time, table_number, dan status wajib diisi', data: null });
    }

    const [result] = await db.query(
      'UPDATE reservations SET customer_name = ?, phone = ?, reservation_time = ?, table_number = ?, status = ? WHERE id = ?',
      [customer_name, phone || null, reservation_time, table_number, status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil memperbarui reservasi', data: { id: parseInt(id), customer_name, phone: phone || null, reservation_time, table_number, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui reservasi', data: null, error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM reservations WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil menghapus reservasi', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus reservasi', data: null, error: error.message });
  }
};
