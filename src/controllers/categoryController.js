const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data kategori', data: rows, meta: { total: rows.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kategori', data: null, error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Field name wajib diisi', data: null });
    
    const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
    res.status(201).json({ success: true, message: 'Berhasil menambahkan kategori', data: { id: result.insertId, name, description: description || null } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan kategori', data: null, error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) return res.status(400).json({ success: false, message: 'Field name wajib diisi', data: null });
    
    const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description || null, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil memperbarui kategori', data: { id: parseInt(id), name, description: description || null } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui kategori', data: null, error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan', data: null });
    
    res.status(200).json({ success: true, message: 'Berhasil menghapus kategori', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori', data: null, error: error.message });
  }
};