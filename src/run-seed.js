const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function runSeed() {
  try {
    const seedSql = fs.readFileSync(path.join(__dirname, '..', 'seed.sql'), 'utf8');
    
    // Split by semicolons for individual statements
    const statements = seedSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (const stmt of statements) {
      if (stmt) {
        await db.query(stmt);
      }
    }
    
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
