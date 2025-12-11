import express from "express";
import request from "supertest";
import authRouter from "../routes/authRoutes.js";

// Mockear AuthService
jest.mock("../services/authService.js", () => ({
    register: jest.fn(async (userData) => ({
        id: 1,
        email: userData.email,
        username: userData.username
    })),
    login: jest.fn(async (credentials) => ({
        token: "fakeToken",
        user: {
            id: 1,
            email: credentials.email,
            username: "testuser"
        }
    })),
    getUser: jest.fn(async (userId) => ({
        id: userId,
        email: "test@example.com",
        username: "testuser"
    })),
    updateUser: jest.fn(async (userId, userData) => ({
        id: userId,
        email: userData.email || "test@example.com",
        username: userData.username || "testuser"
    }))
}));

// Mockear Middleware
jest.mock("../middleware/AuthMiddleware.js", () => ({
    authRequired: (req, res, next) => {
        req.userId = 1; // Simular usuario autenticado
        next();
    }
}));

// Configurar app Express
const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("Auth Routes", () => {
    // Rutas públicas
    describe("POST /api/auth/register", () => {
        test("Registro de nuevo usuario correcto", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "newuser@example.com",
                    username: "newuser",
                    password: "password123"
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("email", "newuser@example.com");
            expect(res.body.user).toHaveProperty("username", "newuser");
        });

        test("Error al registrar usuario", async () => {
            const authService = require("../services/authService.js");
            authService.register.mockRejectedValueOnce({
                status: 400,
                message: "El correo electrónico ya está registrado"
            });

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "existing@example.com",
                    username: "existinguser",
                    password: "password123"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("message", "El correo electrónico ya está registrado");
        });
    });

    describe("POST /api/auth/login", () => {
        test("Inicio de sesión correcto", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("token", "fakeToken");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("email", "test@example.com");
        });

        test("Error en el inicio de sesión", async () => {
            const authService = require("../services/authService.js");
            authService.login.mockRejectedValueOnce({
                status: 401,
                message: "Nombre de usuario o contraseña incorrectos"
            });

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "wrong@example.com",
                    password: "wrongpassword"
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("message", "Nombre de usuario o contraseña incorrectos");
        });
    });

    // Rutas con autenticación requerida
    describe("GET /api/auth/get-user", () => {
        test("Devuelve los datos del usuario", async () => {
            const res = await request(app).get("/api/auth/get-user");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("id", 1);
            expect(res.body).toHaveProperty("email", "test@example.com");
            expect(res.body).toHaveProperty("username", "testuser");
        });

        test("Error al recibir los datos del usuario", async () => {
            const authService = require("../services/authService.js");
            authService.getUser.mockRejectedValueOnce({
                status: 404,
                message: "Error del sistema"
            });

            const res = await request(app).get("/api/auth/get-user");

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("message", "Error del sistema");
        });
    });

    describe("POST /api/auth/update-user", () => {
        test("Actualiza los datos del usuario", async () => {
            const res = await request(app)
                .post("/api/auth/update-user")
                .send({
                    email: "updated@example.com",
                    username: "updateduser"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("email", "updated@example.com");
            expect(res.body).toHaveProperty("username", "updateduser");
        });

        test("Error al actualizar los datos del usuario", async () => {
            const authService = require("../services/authService.js");
            authService.updateUser.mockRejectedValueOnce({
                status: 400,
                message: "Error del sistema"
            });

            const res = await request(app)
                .post("/api/auth/update-user")
                .send({
                    email: "invalid-email"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("message", "Error del sistema");
        });
    });
});
