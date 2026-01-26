import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
  getTicketsByProject,
  createTicket,
  getTicketById,
} from "../controllers/ticket.controller";

const router = Router();

router.get("/", protect, getTicketsByProject); // ?projectId=
router.post("/", protect, createTicket);
router.get("/:ticketId", protect, getTicketById);

export default router;
