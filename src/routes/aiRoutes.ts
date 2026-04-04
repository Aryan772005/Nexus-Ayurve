import { Router } from "express";
import { getAIAnalysis } from "../controllers/aiController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, getAIAnalysis);

export default router;
