import express from 'express';
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import { rateLimiter } from '@/middlewares/rateLimiter.middleware';
import path from "path";
import fs from "fs";
import { connectDB } from '@/config/database.config';
import logger from '@/utils/logger.util';
import { errorHandler } from '@/middlewares/errorhandler.middleware';
import authRoutes from '@/routes/auth.routes';
import categoryRoutes from '@/routes/category.routes';
import recipeRoutes from '@/routes/recipe.routes';
import seedDatabase from '@/utils/seedDatabase.utils';

dotenv.config();

connectDB()
  .then(async () => {
  console.log("Connected to DB✅")
  // this script creates default admin, categories and recipes
  seedDatabase();
  })
  .catch((err) => {
    logger.error("Error initializing defaults:", err);
  });

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-App-Signature",
    "X-Request-ID",
    "X-Source",
    "X-Timestamp",
    "X-Organization-Id",
  ],
};

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors(corsOptions))
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter());

const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const recipesPath = path.join(uploadsPath, "/recipes");
if (!fs.existsSync(recipesPath)) {
  fs.mkdirSync(recipesPath, { recursive: true });
}

const categoriesPath = path.join(uploadsPath, "/categories");
if (!fs.existsSync(categoriesPath)) {
  fs.mkdirSync(categoriesPath, { recursive: true });
}

const avatarsPath = path.join(uploadsPath, "/avatars");
if (!fs.existsSync(avatarsPath)) {
  fs.mkdirSync(avatarsPath, { recursive: true });
}

const directionsPath = path.join(uploadsPath, "/directions");
if (!fs.existsSync(directionsPath)) {
  fs.mkdirSync(directionsPath, { recursive: true });
}

// Log the paths for debugging
console.log("Recipes images absolute path:", path.resolve(recipesPath));
console.log("Categories images absolute path:", path.resolve(categoriesPath));
console.log("Avatars images absolute path:", path.resolve(avatarsPath));
console.log("Directions images absolute path:", path.resolve(directionsPath));

// Log the uploads path for debugging
console.log("Uploads directory path:", uploadsPath);
console.log("Recipes images path:", recipesPath);
console.log("Categories images path:", categoriesPath);
console.log("Avatars images path:", avatarsPath);
console.log("Directions images path:", directionsPath);

const setCorsHeaders = (req: any, res: any, next: any) => {
  const origin =
    typeof corsOptions.origin === "string"
      ? corsOptions.origin
      : "http://localhost:5173";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cache-Control", "no-cache");
  next();
};

app.use(
  "/uploads",
  setCorsHeaders,
  express.static(uploadsPath, {
    etag: false,
    lastModified: false,
  })
);

app.use(
  "/upload/categories",
  setCorsHeaders,
  express.static(categoriesPath, {
    etag: false,
    lastModified: false,
  })
);

app.use(
  "/upload/recipes",
  setCorsHeaders,
  express.static(recipesPath, {
    etag: false,
    lastModified: false,
  })
);

app.use(
  "/upload/avatars",
  setCorsHeaders,
  express.static(avatarsPath, {
    etag: false,
    lastModified: false,
  })
);

app.use(
  "/upload/directions",
  setCorsHeaders,
  express.static(directionsPath, {
    etag: false,
    lastModified: false,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/recipes", recipeRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
