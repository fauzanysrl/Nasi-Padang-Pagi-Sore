const db = require('../config/db');

const Menu = {
  // Method untuk mengambil semua menu dari padang_db
  getAllMenus: async () => {
    // Jalankan query SQL
    const [rows] = await db.query('SELECT * FROM menus');
    return rows;
  }
};

module.exports = Menu;
