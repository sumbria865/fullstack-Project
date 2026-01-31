import { Router } from "express";
import { getCommentsByTicket, addComment } from "../controllers/comment.controller";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * GET comments by ticket
 * ADMIN, MANAGER, USER
 */
router.get(
  "/tickets/:ticketId/comments",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getCommentsByTicket
);

/**
 * ADD comment to ticket
 * ADMIN, MANAGER, USER
 */
router.post(
  "/tickets/:ticketId/comments",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  addComment
);

export default router;
