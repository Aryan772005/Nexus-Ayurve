import { Router } from "express";
import { registerUser, loginUser, syncUser } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sync", authenticate, syncUser);

export default router;
