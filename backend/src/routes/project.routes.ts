import { Router } from "express";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../controllers/project.controller";
import { protect } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * GET /api/projects
 * ADMIN, MANAGER, USER can view projects
 */
router.get(
  "/",
  protect,
  allowRoles("ADMIN", "MANAGER", "USER"),
  getProjects
);

/**
 * POST /api/projects
 * ONLY ADMIN can create projects
 */
router.post(
  "/",
  protect,
  allowRoles("ADMIN"),
  createProject
);

/**
 * DELETE /api/projects/:id
 * ONLY ADMIN can delete projects
 */
router.delete(
  "/:id",
  protect,
  allowRoles("ADMIN"),
  deleteProject
);

export default router;
