import pkg from "pg";
import dotenv from "dotenv";

dotenv.config()

const { Pool } = pkg;

// Configuración de PostgreSQL
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_URL,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});
