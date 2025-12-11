import * as authController from "../controllers/authController.js";
import * as AuthService from "../services/authService.js";

// Mockear AuthService
jest.mock("../services/authService.js");

describe("Auth Controller", () => {
    let req, res;

    // Configurar mock de req y res para cada test
    beforeEach(() => {
        req = {
            body: {},
            userId: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe("register", () => {
        test("Registra un nuevo usuario", async () => {
            const mockUser = {
                id: 1,
                email: "newuser@example.com",
                username: "newuser"
            };

            req.body = {
                email: "newuser@example.com",
                username: "newuser",
                password: "password123"
            };

            AuthService.register.mockResolvedValue(mockUser);

            await authController.register(req, res);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ user: mockUser });
        });

        test("Error al registrar un nuevo usuario", async () => {
            const error = {
                status: 400,
                message: "El correo electrónico ya está registrado"
            };

            req.body = {
                email: "existing@example.com",
                username: "existinguser",
                password: "password123"
            };

            AuthService.register.mockRejectedValue(error);

            await authController.register(req, res);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "El correo electrónico ya está registrado" });
        });

        test("Error del sistema al registrar usuario", async () => {
            const error = {
                message: "Error del sistema"
            };

            req.body = {
                email: "test@example.com",
                username: "testuser",
                password: "password123"
            };

            AuthService.register.mockRejectedValue(error);

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error del sistema" });
        });
    });

    describe("login", () => {
        test("Inicio de sesión", async () => {
            const mockResult = {
                token: "fakeToken",
                user: {
                    id: 1,
                    email: "test@example.com",
                    username: "testuser"
                }
            };

            req.body = {
                email: "test@example.com",
                password: "password123"
            };

            AuthService.login.mockResolvedValue(mockResult);

            await authController.login(req, res);

            expect(AuthService.login).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("Error al iniciar sesión", async () => {
            const error = {
                status: 401,
                message: "Nombre de usuario o contraseña incorrectos"
            };

            req.body = {
                email: "wrong@example.com",
                password: "wrongpassword"
            };

            AuthService.login.mockRejectedValue(error);

            await authController.login(req, res);

            expect(AuthService.login).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Nombre de usuario o contraseña incorrectos" });
        });

        test("Error del sistema al iniciar sesión", async () => {
            const error = {
                message: "Error del sistema"
            };

            req.body = {
                email: "test@example.com",
                password: "password123"
            };

            AuthService.login.mockRejectedValue(error);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error del sistema" });
        });
    });

    describe("getUser", () => {
        test("Devuelve los datos del usuario", async () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
                username: "testuser"
            };

            req.userId = 1;

            AuthService.getUser.mockResolvedValue(mockUser);

            await authController.getUser(req, res);

            expect(AuthService.getUser).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        test("Error al recibir los datos del usuario ", async () => {
            const error = {
                message: "Error del sistema"
            };

            req.userId = 1;

            AuthService.getUser.mockRejectedValue(error);

            await authController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error del sistema" });
        });
    });

    describe("updateUser", () => {
        test("Actualiza el usuario", async () => {
            const mockUpdatedUser = {
                id: 1,
                email: "updated@example.com",
                username: "updateduser"
            };

            req.userId = 1;
            req.body = {
                email: "updated@example.com",
                username: "updateduser"
            };

            AuthService.updateUser.mockResolvedValue(mockUpdatedUser);

            await authController.updateUser(req, res);

            expect(AuthService.updateUser).toHaveBeenCalledWith(1, req.body);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
        });

        test("Error al actualizar el usuario", async () => {
            const error = {
                message: "Error del sistema"
            };

            req.userId = 1;
            req.body = {
                username: "newusername"
            };

            AuthService.updateUser.mockRejectedValue(error);

            await authController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error del sistema" });
        });
    });
});
