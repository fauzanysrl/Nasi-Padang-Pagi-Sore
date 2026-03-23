const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ success: true, data: { id: result.insertId, name, description } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: { id, name, description } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: { message: 'Category deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
