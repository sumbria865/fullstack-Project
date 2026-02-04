import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * GET  /api/profile
 * UPDATE /api/profile
 * ADMIN, MANAGER, USER
 */
router.get(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getMyProfile
);

router.put(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  updateMyProfile
);

// PUT /api/profile/email
// Email/password routes are handled in `user.routes.ts` under /api/users


export default router;
