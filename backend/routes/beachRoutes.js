import { Router } from "express";
import { getBeachList, getBeachDetail, sendReport, getBeachReports, saveBeachLocations, getNearbyBeaches } from "../controllers/beachController.js";

const router = Router();

router.get("/get-beach-list", getBeachList);
router.get("/get-beach/:id", getBeachDetail);
router.post("/send-report", sendReport);
router.get("/get-beach-reports/:id", getBeachReports);
router.get("/insert-locations", saveBeachLocations);
router.get("/get-nearby-beahces/:id", getNearbyBeaches);

export default router;