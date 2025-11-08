// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

// Configuración de la app
const app = express();
const PORT = process.env.BACKEND_PORT || 3002;

app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_URL,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({ message: "✅ BlueCheck backend funcionando correctamente" });
});

// Ruta para probar la conexión a la base de datos
app.get("/api/db-test", async (req, res) => {
  console.log(process.env.PORT);
  console.log(process.env.DATABASE_URL);
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Conexión exitosa a la base de datos", result: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en ejecución en el puerto ${PORT}`);
});
