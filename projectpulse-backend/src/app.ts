import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import config from "./config";
import logger from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";

// ====== App Init ======
const app: Application = express();

// ====== CORS CONFIG (SAFE + MODERN) ======
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ====== Body Parsing ======
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ====== Request Logging (DEV ONLY) ======
if (config.nodeEnv === "development") {
    app.use((req: Request, _res: Response, next: NextFunction) => {
        logger.info(`${req.method} ${req.originalUrl}`, {
            query: req.query,
            body: req.body,
        });
        next();
    });
}

// ====== Health Check ======
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Project Pulse API is running",
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// ====== API ROUTES ======
import authRoutes from "./modules/auth/routes/auth.routes";
import usersRoutes from "./modules/users/routes/users.routes";
import projectsRoutes from "./modules/projects/routes/projects.routes";
import tasksRoutes from "./modules/tasks/routes/tasks.routes";
import timeTrackingRoutes from "./modules/time-tracking/routes/time-tracking.routes";
import fileRoutes from "./modules/files/routes/files.routes";
import ganttRoutes from "./modules/gantt/routes/gantt.routes";
import budgetRoutes from "./modules/budget/routes/budget.routes";
import analyticsRoutes from "./modules/analytics/routes/analytics.routes";
import resourcesRoutes from "./modules/resources/routes/resources.routes";

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/time-tracking", timeTrackingRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/gantt", ganttRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/resources", resourcesRoutes);

// ====== Error Handling ======
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
