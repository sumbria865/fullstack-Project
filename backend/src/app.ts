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

// Production-safe CORS allowlist (configure here or via env)
const allowedOrigins = [
  "https://fullstack-project-nine-beta.vercel.app",
  "https://fullstack-project-git-main-prinkas-projects.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly respond to OPTIONS preflight with CORS headers
app.options("*", cors());

// Log allowed origins for easier debugging
console.log("CORS allowed origins:", allowedOrigins);

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
