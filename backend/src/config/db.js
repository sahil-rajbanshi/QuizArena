import pg from 'pg';
import config from './env.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    mode: 'require'
  }
});

export const query = (text, params) => pool.query(text, params);

export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0].now);
    return result;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};