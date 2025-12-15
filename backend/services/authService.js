import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js"

// Registro de usuario
export const register = async ({ email, password, username, name }) => {
    if (!email || !password || !username) {
        return res.status(400).json({ message: '🪼Faltan campos obligatorios🪼' });
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

        return result.rows[0];

    } catch (err) {

        if (err.code === "23505") {
            if (err.constraint === "users_email_key") {
                throw { status: 400, message: "🪼El correo electrónico ya está registrado🪼"}
            }

            if (err.constraint === "users_username_key") {
                throw { status: 400, message: "🪼El nombre de usuario ya está registrado🪼"}
            }
        }

        throw { status: 500, message: "🚩Error del servidor🚩"}
    }
};

// Inicio de sesión
export const login = async ({ identifier, password }) => {
    if (!identifier || !password) {
        throw { status: 400, message: "🪼Se deben rellenar todos los campos🪼" }
    }

    // Comprueba si el identificador es email o nombre de usuario
    const isEmail = identifier.includes("@");

    const query = isEmail
        ? "SELECT * FROM users WHERE email = $1"
        : "SELECT * FROM users WHERE username = $1";

    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
        throw { status: 401, message: "🪼Usuario o contraseña incorrectos🪼" }
    }

    const user = result.rows[0];

    // Comprueba la contraseña
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        throw { status: 401, message: "🪼Usuario o contraseña incorrectos🪼" }
    }

    // Crea el token
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name
        },
        token
    };
};

// Recoger datos de usuario por ID
export const getUser = async (id) => {
    const result = await pool.query(
        `SELECT id, email, username, name FROM users WHERE id = $1`,
        [id]
    );

    const user = result.rows[0];

    if (!user) {
        throw { status: 401, message: "🪼Usuario no encontrado🪼" }
    }

    return user;
}

// Actualizar el usuario
export const updateUser = async (userId, { email, password, username, name }) => {
    let password_hash;
    if (password && password.trim() !== "") {
        const saltRounds = 10;
        password_hash = await bcrypt.hash(password, saltRounds);
    }

    const result = await pool.query(
        `UPDATE users 
        SET email = $1,
            username = $2,
            name = $3,
            password = COALESCE($4, password)
        WHERE id = $5
        RETURNING id, email, username, name`,
        [email, username, name, password_hash || null, userId]
    );

    const user = result.rows[0];

    if (!user) {
        throw { status: 401, message: "🪼Usuario no encontrado🪼" }
    }

    return user;
}
