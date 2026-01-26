import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../controllers/project.controller";

const router = Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.delete("/:id", protect, deleteProject);

export default router;
