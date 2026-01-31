import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

import {
  getTicketsByProject,
  createTicket,
  getTicketById,
  updateTicketStatus,
} from "../controllers/ticket.controller";

const router = Router();

/* =========================
   GET ALL TICKETS (by project)
   ADMIN, MANAGER, USER
========================= */
router.get(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getTicketsByProject
);

/* =========================
   CREATE TICKET
   ADMIN, MANAGER
========================= */
router.post(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER),
  createTicket
);

/* =========================
   GET SINGLE TICKET
   ADMIN, MANAGER, USER
========================= */
router.get(
  "/:ticketId",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getTicketById
);

/* =========================
   UPDATE TICKET STATUS
   ADMIN, MANAGER
========================= */
router.patch(
  "/:ticketId/status",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER),
  updateTicketStatus
);

export default router;
