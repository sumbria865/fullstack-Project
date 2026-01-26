import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * GET  /api/profile
 * UPDATE /api/profile
 */
router.get("/", authMiddleware, getMyProfile);
router.put("/", authMiddleware, updateMyProfile);

export default router;
