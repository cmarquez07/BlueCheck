import pkg from "pg";
import dotenv from "dotenv";

dotenv.config()

const { Pool } = pkg;

let pool;
// Configuración de PostgreSQL
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
  });
} else {
  pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_URL,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB
  });
}

export { pool };
