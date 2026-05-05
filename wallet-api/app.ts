import http from "http";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import cors, { CorsOptions } from "cors";

import { setupSwagger } from "./api/swagger";
import { connectDB } from "./src/config/db.config"; // ✅ FIXED
import indexRouter from "./src/routers/index.router";
import { globalErrorHandler } from "./src/common/middlewares/error.middleware";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔐 CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://52.66.132.71:3001",
  "http://localhost:5000",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      return callback(
        new Error(`CORS blocked for origin: ${origin}`),
        false
      );
    }

    return callback(null, true);
  },
};

app.use(cors(corsOptions));

//   Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

//   Routes
app.use("/api", indexRouter);

//   Swagger
setupSwagger(app);

//   Health Check
app.get("/", (_, res) => {
  res.send("✅ App Works Properly");
});

//   Global Error Handler
app.use(globalErrorHandler);

//   Start Server ONLY after DB connection
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); // ✅ await DB

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();