import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import prisma from "./src/config/prisma.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import mainRoute from "./src/routes/routes.js";
import { ApiError } from "./src/utils/ApiError.js"; 
import { globalLimiter } from "./src/middleware/rateLimiter.js";
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//rate limiting
app.use(globalLimiter);

// Database test
app.get("/api/test-db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    throw new ApiError(500, "Database connection failed", error);
  }
});


// Main Routes
app.use("/api", mainRoute);
app.use(errorHandler);



// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
