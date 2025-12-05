import { Router } from "express";
import { getBeachList, getBeachDetail, sendReport, getBeachReports, saveBeachLocations,
    getNearbyBeaches, getReportsByUser, getFavoritesByUser, toggleFavoriteBeach } from "../controllers/beachController.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";

const router = Router();


router.get("/get-beach-list", authMiddleware, getBeachList);
router.get("/get-beach/:id", getBeachDetail);
router.post("/send-report", sendReport);
router.get("/get-beach-reports/:id", getBeachReports);
router.get("/insert-locations", saveBeachLocations);
router.get("/get-nearby-beahces/:id", getNearbyBeaches);
router.get("/get-user-reports/:userId", getReportsByUser);
router.get("/get-user-favorites/:userId", getFavoritesByUser);
router.post("/toggle-favorite/:beachId", authMiddleware, toggleFavoriteBeach);

export default router;