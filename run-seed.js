const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function runSeed() {
  try {
    const sqlPath = path.join(__dirname, 'seed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split queries by semicolon to execute them one by one
    // Filter out empty statements and comments
    const queries = sql.split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));

    console.log(`Found ${queries.length} queries to execute.`);

    for (const query of queries) {
      if (query.trim()) {
        await db.query(query);
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

runSeed();
