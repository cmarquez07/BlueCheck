import { Router } from "express";
import { register, login, getUser, updateUser } from "../controllers/authController.js";
import { authRequired } from "../middleware/AuthMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Autenticación requerida
router.get("/get-user", authRequired, getUser);
router.post("/update-user", authRequired, updateUser);

export default router;