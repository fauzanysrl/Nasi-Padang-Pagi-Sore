const mysql = require('mysql2/promise');

// 1. Membuat connection pool (Best Practice)
// Pool lebih baik daripada connection tunggal (createConnection) karena
// dapat digunakan ulang (reused) oleh berbagai request secara bersamaan.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'padang_db',
  waitForConnections: true,
  connectionLimit: 10,  // Maksimal koneksi yang bisa dibuat
  queueLimit: 0         // Tidak ada limit antrian
});

// 2. Test koneksi awal (Optional namun sangat disarankan)
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connected to padang_db');
    connection.release(); // Kembalikan koneksi ke pool agar bisa dipakai yang lain
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;
