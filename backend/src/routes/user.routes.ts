import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

import {
  getProfile,
  updateProfile,
  changeEmail,
  changePassword,
  getActivity,
  toggleActivity,
} from "../controllers/user.controller";

const router = Router();

/**
 * USER PROFILE
 * ADMIN, MANAGER, USER
 */
router.get(
  "/me",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getProfile
);

router.put(
  "/me",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  updateProfile
);

/**
 * ACCOUNT SETTINGS
 * ADMIN, MANAGER, USER
 */
router.put(
  "/change-email",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  changeEmail
);

router.put(
  "/change-password",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  changePassword
);

/**
 * USER ACTIVITY
 * ADMIN, MANAGER, USER
 */
router.get(
  "/activity",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getActivity
);

router.post(
  "/activity",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  toggleActivity
);

export default router;
