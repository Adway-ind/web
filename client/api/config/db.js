const { Pool } = require('pg');
require('dotenv').config();

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL;

console.log("POSTGRES_URL:", !!process.env.POSTGRES_URL);
console.log("POSTGRES_PRISMA_URL:", !!process.env.POSTGRES_PRISMA_URL);
console.log("Database URL exists:", !!connectionString);

if (!connectionString) {
  throw new Error("POSTGRES_URL is missing");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: async function (sql, params = []) {
    try {
      // 1. Convert MySQL ? to Postgres $1, $2, etc.
      let i = 1;
      let pgSql = sql.replace(/\?/g, () => `$${i++}`);

      // 2. Convert MySQL backticks `desc` to Postgres "desc"
      pgSql = pgSql.replace(/`/g, '"');

      // 3. For INSERT statements, Postgres doesn't return the generated ID by default.
      // So we append RETURNING id, if it's an INSERT and doesn't already have a returning clause.
      if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      // 4. Handle MySQL's "NOW()" which in Postgres is often fine, but just in case
      // "NOW()" is standard in both. "ON UPDATE CURRENT_TIMESTAMP" is handled by schema triggers or ignoring.

      const result = await pool.query(pgSql, params);

      const { command, rowCount, rows } = result;

      // 5. Format response to match mysql2 so the Express app doesn't break
      if (command === 'INSERT' || command === 'UPDATE' || command === 'DELETE') {
        const insertId = rows && rows.length > 0 ? rows[0].id : null;
        return [{
          affectedRows: rowCount,
          insertId: insertId || 0
        }];
      }

      // SELECT queries return [rows]
      return [rows];

    } catch (err) {
      console.error("DB Query Error:", err.message, "SQL:", sql, "PARAMS:", params);
      throw err;
    }
  },
  execute: async function (sql, params = []) {
    return this.query(sql, params);
  }
};
