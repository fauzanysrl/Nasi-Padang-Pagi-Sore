const db = require('../config/db');

exports.getMenus = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menus');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM menus WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Menu not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { name, category_id, description, price, status, image_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO menus (name, category_id, description, price, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id, description, price, status || 'available', image_url]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, name, category_id, description, price, status, image_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description, price, status, image_url } = req.body;
    const [result] = await db.query(
      'UPDATE menus SET name = ?, category_id = ?, description = ?, price = ?, status = ?, image_url = ? WHERE id = ?',
      [name, category_id, description, price, status, image_url, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Menu not found' });
    res.json({ success: true, data: { id, name, category_id, description, price, status, image_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM menus WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Menu not found' });
    res.json({ success: true, data: { message: 'Menu deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
