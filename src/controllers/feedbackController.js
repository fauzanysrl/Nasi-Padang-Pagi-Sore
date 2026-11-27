const db = require('../config/db');

exports.getFeedbacks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, c.name as customer_name 
      FROM feedbacks f
      LEFT JOIN customers c ON f.customer_id = c.id
      ORDER BY f.created_at DESC
    `);
    res.status(200).json({ success: true, message: 'Berhasil mengambil data feedback', data: rows, meta: { total: rows.length } });
  } catch (error) {
    console.error('getFeedbacks error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data feedback', data: null, error: error.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT f.*, c.name as customer_name 
      FROM feedbacks f
      LEFT JOIN customers c ON f.customer_id = c.id
      WHERE f.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan', data: null });
    res.status(200).json({ success: true, message: 'Berhasil mengambil data feedback', data: rows[0] });
  } catch (error) {
    console.error('getFeedbackById error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal mengambil data feedback', data: null, error: error.message });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const { customer_id, order_id, rating, comment } = req.body;
    console.log('createFeedback req.body:', req.body);

    if (!customer_id || !rating) {
      return res.status(400).json({ success: false, message: 'Field customer_id dan rating wajib diisi', data: null });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1 sampai 5', data: null });
    }

    const [result] = await db.query(
      'INSERT INTO feedbacks (customer_id, order_id, rating, comment) VALUES (?, ?, ?, ?)',
      [customer_id, order_id || null, rating, comment || null]
    );
    res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan feedback',
      data: { id: result.insertId, customer_id, order_id: order_id || null, rating, comment: comment || null }
    });
  } catch (error) {
    console.error('createFeedback error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menambahkan feedback', data: null, error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM feedbacks WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan', data: null });

    res.status(200).json({ success: true, message: 'Berhasil menghapus feedback', data: null });
  } catch (error) {
    console.error('deleteFeedback error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menghapus feedback', data: null, error: error.message });
  }
};
