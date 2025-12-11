import * as authService from "../services/authService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// Mockear dependencias
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../config/db.js", () => ({
    pool: {
        query: jest.fn()
    }
}));

describe("Auth Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        test("Registra un nuevo usuario", async () => {
            const userData = {
                email: "nuevo@example.com",
                password: "password123",
                username: "nuevousuario",
                name: "Nuevo Usuario"
            };

            const mockHashedPassword = "hashed_password_123";
            const mockUser = {
                id: 1,
                email: "nuevo@example.com",
                username: "nuevousuario",
                name: "Nuevo Usuario",
                created_at: new Date()
            };

            bcrypt.hash.mockResolvedValue(mockHashedPassword);
            pool.query.mockResolvedValue({ rows: [mockUser] });

            const result = await authService.register(userData);

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO users"),
                ["nuevo@example.com", mockHashedPassword, "nuevousuario", "Nuevo Usuario"]
            );
            expect(result).toEqual(mockUser);
        });

        test("Error al registrar un nuevo usuario", async () => {
            const userData = {
                email: "existente@example.com",
                password: "password123",
                username: "usuario",
                name: "Usuario"
            };

            const mockError = {
                code: "23505",
                constraint: "users_email_key"
            };

            bcrypt.hash.mockResolvedValue("hashed_password");
            pool.query.mockRejectedValue(mockError);

            await expect(authService.register(userData)).rejects.toEqual({
                status: 400,
                message: "🪼El correo electrónico ya está registrado🪼"
            });
        });

        test("Error al registrar - username duplicado", async () => {
            const userData = {
                email: "nuevo@example.com",
                password: "password123",
                username: "existente",
                name: "Usuario"
            };

            const mockError = {
                code: "23505",
                constraint: "users_username_key"
            };

            bcrypt.hash.mockResolvedValue("hashed_password");
            pool.query.mockRejectedValue(mockError);

            await expect(authService.register(userData)).rejects.toEqual({
                status: 400,
                message: "🪼El nombre de usuario ya está registrado🪼"
            });
        });

        test("Error del sistema al registrar usuario", async () => {
            const userData = {
                email: "nuevo@example.com",
                password: "password123",
                username: "usuario",
                name: "Usuario"
            };

            const mockError = new Error("Database connection error");

            bcrypt.hash.mockResolvedValue("hashed_password");
            pool.query.mockRejectedValue(mockError);

            await expect(authService.register(userData)).rejects.toEqual({
                status: 500,
                message: "🚩Error del servidor🚩"
            });
        });
    });

    describe("login", () => {
        test("Inicio de sesión", async () => {
            const credentials = {
                identifier: "test@example.com",
                password: "password123"
            };

            const mockUser = {
                id: 1,
                email: "test@example.com",
                username: "testuser",
                name: "Test User",
                password: "hashed_password"
            };

            const mockToken = "fake-jwt-token";

            pool.query.mockResolvedValue({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);

            const result = await authService.login(credentials);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM users WHERE email = $1",
                ["test@example.com"]
            );
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed_password");
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1 },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            expect(result).toEqual({
                user: {
                    id: 1,
                    email: "test@example.com",
                    username: "testuser",
                    name: "Test User"
                },
                token: mockToken
            });
        });

        test("Inicio de sesión con username", async () => {
            const credentials = {
                identifier: "testuser",
                password: "password123"
            };

            const mockUser = {
                id: 1,
                email: "test@example.com",
                username: "testuser",
                name: "Test User",
                password: "hashed_password"
            };

            const mockToken = "fake-jwt-token";

            pool.query.mockResolvedValue({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);

            const result = await authService.login(credentials);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM users WHERE username = $1",
                ["testuser"]
            );
            expect(result.token).toBe(mockToken);
        });

        test("Error al iniciar sesión - campos vacíos", async () => {
            const credentials = {
                identifier: "",
                password: ""
            };

            await expect(authService.login(credentials)).rejects.toEqual({
                status: 400,
                message: "🪼Se deben rellenar todos los campos🪼"
            });

            expect(pool.query).not.toHaveBeenCalled();
        });

        test("Error al iniciar sesión - usuario no existe", async () => {
            const credentials = {
                identifier: "noexiste@example.com",
                password: "password123"
            };

            pool.query.mockResolvedValue({ rows: [] });

            await expect(authService.login(credentials)).rejects.toEqual({
                status: 401,
                message: "🪼Usuario o contraseña incorrectos🪼"
            });

            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        test("Error al iniciar sesión", async () => {
            const credentials = {
                identifier: "test@example.com",
                password: "wrongpassword"
            };

            const mockUser = {
                id: 1,
                email: "test@example.com",
                username: "testuser",
                name: "Test User",
                password: "hashed_password"
            };

            pool.query.mockResolvedValue({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(credentials)).rejects.toEqual({
                status: 401,
                message: "🪼Usuario o contraseña incorrectos🪼"
            });

            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });

    describe("getUser", () => {
        test("Devuelve los datos del usuario", async () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
                username: "testuser",
                name: "Test User"
            };

            pool.query.mockResolvedValue({ rows: [mockUser] });

            const result = await authService.getUser(1);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("SELECT id, email, username, name FROM users WHERE id = $1"),
                [1]
            );
            expect(result).toEqual(mockUser);
        });

        test("Error al recibir los datos del usuario ", async () => {
            pool.query.mockResolvedValue({ rows: [] });

            await expect(authService.getUser(999)).rejects.toEqual({
                status: 401,
                message: "🪼Usuario no encontrado🪼"
            });
        });
    });

    describe("updateUser", () => {
        test("Actualiza el usuario", async () => {
            const userId = 1;
            const updateData = {
                email: "updated@example.com",
                username: "updateduser",
                name: "Updated User",
                password: ""
            };

            const mockUpdatedUser = {
                id: 1,
                email: "updated@example.com",
                username: "updateduser",
                name: "Updated User"
            };

            pool.query.mockResolvedValue({ rows: [mockUpdatedUser] });

            const result = await authService.updateUser(userId, updateData);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE users"),
                ["updated@example.com", "updateduser", "Updated User", null, 1]
            );
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(result).toEqual(mockUpdatedUser);
        });

        test("Actualiza el usuario con nueva contraseña", async () => {
            const userId = 1;
            const updateData = {
                email: "updated@example.com",
                username: "updateduser",
                name: "Updated User",
                password: "newpassword123"
            };

            const mockHashedPassword = "new_hashed_password";
            const mockUpdatedUser = {
                id: 1,
                email: "updated@example.com",
                username: "updateduser",
                name: "Updated User"
            };

            bcrypt.hash.mockResolvedValue(mockHashedPassword);
            pool.query.mockResolvedValue({ rows: [mockUpdatedUser] });

            const result = await authService.updateUser(userId, updateData);

            expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE users"),
                ["updated@example.com", "updateduser", "Updated User", mockHashedPassword, 1]
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        test("Error al actualizar el usuario", async () => {
            const userId = 999;
            const updateData = {
                email: "updated@example.com",
                username: "updateduser",
                name: "Updated User"
            };

            pool.query.mockResolvedValue({ rows: [] });

            await expect(authService.updateUser(userId, updateData)).rejects.toEqual({
                status: 401,
                message: "🪼Usuario no encontrado🪼"
            });
        });
    });
});
