// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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


// User register
app.post('/api/register', async (req, res) => {
  const { email, password, username, name } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  
  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      `INSERT INTO users (email, password, username, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, name, created_at`,
      [email, password_hash, username, name]
    );

    return res.status(201).json({ user: result.rows[0] });

  } catch (err) {
    
    if (err.code === "23505") {
      if (err.constraint === "users_email_key") {
        return res.status(400).json({ message: "🪼El correo electrónico ya está registrado🪼"});
      }
      
      if (err.constraint === "users_username_key") {
        return res.status(400).json({ message: "🪼El nombre de usuario ya está registrado🪼"});
      }
    }
    
    return res.status(500).json({ message: "🚩Error del servidor🚩"});
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier could be username or email

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Se deben rellenar todos los campos' });
  }

  try {
    // Check if the identifier is an email
    const isEmail = identifier.includes("@");

    const query = isEmail
    ? "SELECT * FROM users WHERE email = $1"
    : "SELECT * FROM users WHERE username = $1";

    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "🪼Usuario o contraseña incorrectos🪼"})
    }
    
    const user = result.rows[0];

    // Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "🪼Usuario o contraseña incorrectos🪼"})
    }

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name
      },
      token
    });

  } catch (err) {
        return res.status(500).json({ message: "🚩Error del servidor🚩"});
  }
})



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en ejecución en el puerto ${PORT}`);
});
