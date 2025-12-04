import { Router } from "express";
import { getBeachList, getBeachDetail, sendReport, getBeachReports } from "../controllers/beachController.js";

const router = Router();

router.get("/get-beach-list", getBeachList);
router.get("/get-beach/:id", getBeachDetail);
router.post("/send-report", sendReport);
router.get("/get-beach-reports/:id", getBeachReports);

export default router;