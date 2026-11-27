const db = require('../config/db');

const Menu = {
  getAllMenus: async () => {
    const [rows] = await db.query('SELECT * FROM menus');
    return rows;
  }
};

module.exports = Menu;
