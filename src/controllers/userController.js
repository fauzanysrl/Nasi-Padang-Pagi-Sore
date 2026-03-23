const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [result] = await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role || 'cashier']);
    res.status(201).json({ success: true, data: { id: result.insertId, name, email, role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    let query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    let params = [name, email, role, id];

    if (password) {
      query = 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';
      params = [name, email, password, role, id];
    }

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { id, name, email, role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { message: 'User deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
