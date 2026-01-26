import { Router } from "express";
import { addComment, getComments } from "../controllers/comment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, addComment);
router.get("/", protect, getComments);

export default router;