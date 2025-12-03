import { Router } from "express";
import { getBeachList, getBeachDetail, sendReport } from "../controllers/beachController.js";

const router = Router();

router.get("/get-beach-list", getBeachList);
router.get("/get-beach/:id", getBeachDetail);
router.post("/send-report", sendReport);

export default router;