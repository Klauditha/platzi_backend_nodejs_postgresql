const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'clau',
  password: 'admin123',
  database: 'my_store',
});

module.exports = pool;
