const db = require('../config/db');

async function runTest() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('✅ Database connected');
    console.log('✔ Hasil:', rows[0].solution);
  } catch (error) {
    console.error('❌ Error database:', error.message);
  }
}

module.exports = runTest;
