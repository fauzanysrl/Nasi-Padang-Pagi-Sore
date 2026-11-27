const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data user', data: rows, meta: { total: rows.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data user', data: null, error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Field name, email, dan password wajib diisi', data: null });
    }

    const [result] = await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role || 'cashier']);
    res.status(201).json({ success: true, message: 'Berhasil menambahkan user', data: { id: result.insertId, name, email, role: role || 'cashier' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan user', data: null, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ success: false, message: 'Field name, email, dan role wajib diisi', data: null });
    }

    let query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    let params = [name, email, role, id];

    if (password) {
      query = 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';
      params = [name, email, password, role, id];
    }

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil memperbarui user', data: { id: parseInt(id), name, email, role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui user', data: null, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil menghapus user', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus user', data: null, error: error.message });
  }
};
