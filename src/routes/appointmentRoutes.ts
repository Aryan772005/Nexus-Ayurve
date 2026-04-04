import { Router } from "express";
import { createAppointment, getUserAppointments, deleteAppointment } from "../controllers/appointmentController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createAppointment);
router.get("/", authenticate, getUserAppointments);
router.delete("/:id", authenticate, deleteAppointment);

export default router;
