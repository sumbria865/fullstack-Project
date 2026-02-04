import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

import {
  getTicketsByProject,
  createTicket,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  getMyTickets,
  updateMyTicketStatus,
} from "../controllers/ticket.controller";

const router = Router();

/* =========================
   GET MY TICKETS
   USER ONLY ✅
========================= */
router.get(
  "/my",
  protect,
  allowRoles(UserRole.USER),
  getMyTickets
);

/* =========================
   UPDATE MY TICKET STATUS
   USER ONLY ✅
========================= */
router.patch(
  "/my/:ticketId/status",
  protect,
  allowRoles(UserRole.USER),
  updateMyTicketStatus
);

/* =========================
   GET ALL TICKETS
   ADMIN, MANAGER
========================= */
router.get(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER),
  getTicketsByProject
);

/* =========================
   CREATE TICKET
   ADMIN ONLY
========================= */
router.post(
  "/",
  protect,
  allowRoles(UserRole.ADMIN),
  createTicket
);

/* =========================
   ASSIGN TICKET
   ADMIN ONLY
========================= */
router.post(
  "/assign",
  protect,
  allowRoles(UserRole.ADMIN),
  assignTicket
);

/* =========================
   GET SINGLE TICKET
   ADMIN, MANAGER, USER (own)
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
