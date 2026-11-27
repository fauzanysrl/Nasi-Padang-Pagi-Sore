const app = require('./app');
const runTest = require('./utils/testDb');


const PORT = process.env.PORT || 3000;

// 4. ADD DEBUG LOGS
// Memastikan tipe app adalah function/object express sebelum distart
console.log("=== DEBUG LOGS ===");
console.log("Tipe APP:", typeof app);
console.log("Apakah app.listen valid?", typeof app.listen === 'function' ? 'YA ✅' : 'TIDAK ❌');
console.log("==================\n");

// 5. ENSURE SERVER RUNS
app.listen(PORT, () => {
  console.log(`🚀 Server running di http://localhost:${PORT}`);
  runTest();
});