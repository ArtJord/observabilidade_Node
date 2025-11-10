const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

(async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'observa_db'
  });
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../sql/schema.sql')).toString();
    await pool.query(schemaSql);
    console.log('Migrations applied.');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
