import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import ticketRoutes from "./routes/ticket.routes";
import commentRoutes from "./routes/comment.routes";

import { protect } from "./middlewares/auth.middleware";

dotenv.config();

const app: Application = express();

/* =======================
   MIDDLEWARES
   ======================= */

// ✅ CORS (frontend ports allowed)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debug middleware (ONLY logs body when present)
app.use((req, _res, next) => {
  if (req.method !== "GET" && Object.keys(req.body || {}).length > 0) {
    console.log("Parsed body:", req.body);
  }
  next();
});

/* =======================
   ROUTES
   ======================= */

// Auth (public)
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/users", protect, userRoutes);
app.use("/api/projects", protect, projectRoutes);
app.use("/api/tickets",  ticketRoutes); // ✅ IMPORTANT FIX
app.use("/api/comments", protect, commentRoutes);

/* =======================
   HEALTH CHECK
   ======================= */

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("API running...");
});

/* =======================
   DASHBOARD TEST ROUTE
   ======================= */

app.get("/api/dashboard", protect, (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;

  res.status(200).json({
    message: `Welcome to your dashboard, ${user?.email}`,
    user,
  });
});

export default app;
