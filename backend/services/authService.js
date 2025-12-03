import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js"

// User register
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

// User Login
export const login = async ({ identifier, password }) => {
    if (!identifier || !password) {
        throw { status: 400, message: "🪼Se deben rellenar todos los campos🪼" }
    }

    // Check if the identifier is an email
    const isEmail = identifier.includes("@");

    const query = isEmail
        ? "SELECT * FROM users WHERE email = $1"
        : "SELECT * FROM users WHERE username = $1";

    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
        throw { status: 401, message: "🪼Usuario o contraseña incorrectos🪼" }
    }

    const user = result.rows[0];

    // Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        throw { status: 401, message: "🪼Usuario o contraseña incorrectos🪼" }
    }

    // Create token
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