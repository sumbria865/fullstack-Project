import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import ticketRoutes from "./routes/ticket.routes";
import commentRoutes from "./routes/comment.routes";
import { protect } from "./middlewares/auth.middleware";
//import devRoutes from "./routes/dev.routes";

dotenv.config();

const app: Application = express();

/* =======================
   MIDDLEWARES
   ======================= */

// Allowlist for CORS - configure via FRONTEND_ORIGINS env (comma-separated)
const FRONTEND_ORIGINS = (
  process.env.FRONTEND_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,https://fullstack-project-nine-beta.vercel.app"
)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, server-side)
      if (!origin) return callback(null, true);
      if (FRONTEND_ORIGINS.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Ensure OPTIONS (preflight) requests receive proper CORS headers
app.options(
  "*",
  cors({ origin: FRONTEND_ORIGINS, credentials: true })
);

// Log allowed origins for easier debugging
console.log("CORS allowed origins:", FRONTEND_ORIGINS);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req, _res, next) => {
  if (req.method !== "GET" && Object.keys(req.body || {}).length > 0) {
    console.log("Parsed body:", req.body);
  }
  next();
});

/* =======================
   ROUTES
   ======================= */

// Public
app.use("/api/auth", authRoutes);

// Protected
app.use("/api/projects", protect, projectRoutes);
app.use("/api/tickets", protect, ticketRoutes); // change here
app.use("/api/users", protect, userRoutes);

// Comments (ticket-scoped)
app.use("/api", protect, commentRoutes);
//app.use("/api/dev", devRoutes);



/* =======================
   HEALTH CHECK
   ======================= */

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("API running...");
});



/* =======================
   DASHBOARD TEST
   ======================= */

app.get("/api/dashboard", protect, (req: any, res: Response) => {
  res.status(200).json({
    message: `Welcome to your dashboard, ${req.user?.email}`,
    user: req.user,
  });
});

export default app;
