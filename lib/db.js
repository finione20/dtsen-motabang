// lib/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then((client) => {
    console.log('✅ Koneksi database Supabase berhasil!');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Koneksi database Supabase gagal:', err.message);
    console.error('Pastikan DATABASE_URL sudah benar di .env.local');
  });

async function query(sql, params) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('❌ Error saat query database:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

module.exports = { query };