import express from "express";
import request from "supertest";
import beachRouter from "../routes/beachRoutes.js";

// Mockear resend
jest.mock("resend", () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: { send: jest.fn().mockResolvedValue({ id: "fake" }) }
        }))
    };
});

// Mockear BeachService
jest.mock("../services/beachService.js", () => ({
    getBeachList: jest.fn(async (userId) => [
        { id: 0, nombre: "Playa Gran", municipio: "Portbou", medusas: null, estadoAgua: null, estadoCielo: null, isFavorite: false },
        { id: 1, nombre: "Playa d'en Goixa-els Morts", municipio: "Colera", medusas: null, estadoAgua: null, estadoCielo: null, isFavorite: true },
    ]),
    getBeachDetail: jest.fn(async (userId, id) => ({
        id,
        nombre: "Playa Gran",
        medusas: null,
        estadoAgua: null,
        estadoCielo: null,
        nearbyBeaches: [],
        isFavorite: false
    })),
    sendReport: jest.fn(async () => ({ id: 123 })),
    getBeachReports: jest.fn(async () => [{ reportId: 1, comment: "Test" }]),
    saveBeachLocations: jest.fn(async () => [{ beach_id: 0 }]),
    getNearbyBeaches: jest.fn(async () => [{ beach_id: 1, distance: 1.2 }]),
    getReportsByUser: jest.fn(async () => [{ reportId: 1, comment: "User report" }]),
    getFavoritesByUser: jest.fn(async () => [
        { id: 1, nombre: "Playa d'en Goixa-els Morts", municipio: "Colera" }
    ]),
    toggleFavoriteBeach: jest.fn(async () => ({ favorite: true }))
}));

// Mockear Middleware
jest.mock("../middleware/AuthMiddleware.js", () => ({
    authOptional: (req, res, next) => next(),
    authRequired: (req, res, next) => next(),
}));

// Configurar app Express
const app = express();
app.use(express.json());
app.use("/api/beaches", beachRouter);

describe("Beach Routes", () => {
    // Rutas públicas
    test("GET /api/beaches/get-beach-list", async () => {
        const res = await request(app).get("/api/beaches/get-beach-list");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty("nombre", "Playa Gran");
    });

    test("GET /api/beaches/get-beach/:id", async () => {
        const res = await request(app).get("/api/beaches/get-beach/0");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id", "0");
        expect(res.body).toHaveProperty("nombre", "Playa Gran");
    });

    test("GET /api/beaches/get-beach-reports/:id", async () => {
        const res = await request(app).get("/api/beaches/get-beach-reports/0");
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("reportId", 1);
    });

    test("GET /api/beaches/get-nearby-beahces/:id", async () => {
        const res = await request(app).get("/api/beaches/get-nearby-beahces/0");
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("beach_id", 1);
    });

    test("POST /api/beaches/contact", async () => {
        const res = await request(app)
            .post("/api/beaches/contact")
            .send({ name: "Test", email: "test@test.com", comment: "Hola" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("ok", true);
    });

    // Rutas con autenticación requerida
    test("POST /api/beaches/send-report", async () => {
        const res = await request(app)
            .post("/api/beaches/send-report")
            .send({ beachId: 0, comment: "Reporte" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toBe(123);
    });

    test("GET /api/beaches/get-user-reports", async () => {
        const res = await request(app).get("/api/beaches/get-user-reports/");
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("comment", "User report");
    });

    test("GET /api/beaches/get-user-favorites", async () => {
        const res = await request(app).get("/api/beaches/get-user-favorites/");
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("nombre", "Playa d'en Goixa-els Morts");
    });

    test("POST /api/beaches/toggle-favorite/:beachId", async () => {
        const res = await request(app).post("/api/beaches/toggle-favorite/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("favorite", true);
    });

    // Ruta insert-locations
    test("GET /api/beaches/insert-locations", async () => {
        const res = await request(app).get("/api/beaches/insert-locations");
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("beach_id", 0);
    });
});
