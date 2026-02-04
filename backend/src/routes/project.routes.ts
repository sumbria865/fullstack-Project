import { Router } from "express";
import {
  getProjects,
  createProject,
  deleteProject,
  assignProjectToManager,
  getProjectUsers, // ✅ MISSING IMPORT (FIX)
} from "../controllers/project.controller";

import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * =========================
 * GET /api/projects
 * ADMIN → all projects
 * MANAGER / USER → assigned projects
 * =========================
 */
router.get(
  "/",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  getProjects
);

/**
 * =========================
 * POST /api/projects
 * ONLY ADMIN can create projects
 * =========================
 */
router.post(
  "/",
  protect,
  allowRoles(UserRole.ADMIN),
  createProject
);

/**
 * =========================
 * POST /api/projects/assign
 * ADMIN assigns project to MANAGER
 * body: { projectId, managerId }
 * =========================
 */
router.post(
  "/assign",
  protect,
  allowRoles(UserRole.ADMIN),
  assignProjectToManager
);

/**
 * =========================
 * DELETE /api/projects/:id
 * ONLY ADMIN can delete projects
 * =========================
 */
router.delete(
  "/:id",
  protect,
  allowRoles(UserRole.ADMIN),
  deleteProject
);

/**
 * =========================
 * GET /api/projects/:id/users
 * ADMIN / MANAGER only
 * =========================
 */
router.get(
  "/:id/users",
  protect,
  allowRoles(UserRole.ADMIN, UserRole.MANAGER),
  getProjectUsers
);

export default router;
