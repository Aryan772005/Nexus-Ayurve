import { Router } from "express";
import { logHeartRate, getHeartHistory } from "../controllers/heartRateController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, logHeartRate);
router.get("/", authenticate, getHeartHistory);

export default router;
