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
  getUsersForAssign,
} from "../controllers/user.controller";

const router = Router();

/* =====================================================
   GET USERS FOR TICKET ASSIGNMENT
   ADMIN / MANAGER ONLY
   ❌ USER CANNOT ACCESS
===================================================== */
router.get(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER),
  getUsersForAssign
);

/* =====================================================
   USER PROFILE (SELF)
   ADMIN / MANAGER / USER
===================================================== */
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

/* =====================================================
   ACCOUNT SETTINGS
===================================================== */
router.put(
  "/me/email",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  changeEmail
);

router.put(
  "/me/password",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  changePassword
);

/* =====================================================
   USER ACTIVITY TRACKING
===================================================== */
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
