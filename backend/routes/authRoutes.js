import { Router } from "express";
import { register, login, getUser, updateUser } from "../controllers/authController.js"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-user/:userId", getUser);
router.post("/update-user", updateUser);

export default router;