import { Router } from "express";
import { getBeachList, getBeachDetail, sendReport, getBeachReports, saveBeachLocations,
    getNearbyBeaches, getReportsByUser, getFavoritesByUser, toggleFavoriteBeach, sendContactMessage } from "../controllers/beachController.js";
import { authOptional, authRequired } from "../middleware/AuthMiddleware.js";

const router = Router();

// Rutas públicas
router.get("/get-beach-list", authOptional, getBeachList);
router.get("/get-beach/:id", authOptional, getBeachDetail);
router.get("/get-beach-reports/:id", getBeachReports);
router.get("/get-nearby-beahces/:id", getNearbyBeaches);
router.post("/contact", sendContactMessage);

// Autenticación requerida
router.post("/send-report",authRequired, sendReport);
router.get("/get-user-reports/", authRequired, getReportsByUser);
router.get("/get-user-favorites/", authRequired, getFavoritesByUser);
router.post("/toggle-favorite/:beachId", authRequired, toggleFavoriteBeach);

// Endpoint para insertar las localizaciones de las playas en la base de datos
router.get("/insert-locations", saveBeachLocations);

export default router;