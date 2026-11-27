const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getMenus = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menus');
    res.status(200).json({ success: true, message: 'Berhasil mengambil data menu', data: rows, meta: { total: rows.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data menu', data: null, error: error.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM menus WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan', data: null });
    res.status(200).json({ success: true, message: 'Berhasil mengambil data menu', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data menu', data: null, error: error.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { name, category_id, description, price, status } = req.body;
    
    if (!name || null == category_id || null == price) {
        return res.status(400).json({ success: false, message: 'Field name, category_id, dan price wajib diisi', data: null });
    }

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/menus/${req.file.filename}`;
    }

    const [result] = await db.query(
      'INSERT INTO menus (name, category_id, description, price, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id, description || null, price, status || 'available', image_url]
    );
    res.status(201).json({ success: true, message: 'Berhasil menambahkan menu', data: { id: result.insertId, name, category_id, description: description || null, price, status: status || 'available', image_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan menu', data: null, error: error.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description, price, status } = req.body;
    
    if (!name || null == category_id || null == price) {
        return res.status(400).json({ success: false, message: 'Field name, category_id, dan price wajib diisi', data: null });
    }
    
    const [existing] = await db.query('SELECT image_url FROM menus WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan', data: null });
    
    let image_url = existing[0].image_url;

    if (req.file) {
      if (image_url) {
        const oldImagePath = path.join(__dirname, '..', '..', 'public', image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/menus/${req.file.filename}`;
    }

    const [result] = await db.query(
      'UPDATE menus SET name = ?, category_id = ?, description = ?, price = ?, status = ?, image_url = ? WHERE id = ?',
      [name, category_id, description || null, price, status || 'available', image_url, id]
    );
    
    res.status(200).json({ success: true, message: 'Berhasil memperbarui menu', data: { id: parseInt(id), name, category_id, description: description || null, price, status: status || 'available', image_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui menu', data: null, error: error.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [existing] = await db.query('SELECT image_url FROM menus WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan', data: null });
    
    const [result] = await db.query('DELETE FROM menus WHERE id = ?', [id]);
    
    if (existing[0].image_url) {
      const imagePath = path.join(__dirname, '..', '..', 'public', existing[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.status(200).json({ success: true, message: 'Berhasil menghapus menu', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus menu', data: null, error: error.message });
  }
};
