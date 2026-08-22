import express from "express";
import { errorHandler } from '../middlewares/errorHandler.js';
import storeRoutes from "../routes/store.js";


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/stores", storeRoutes);


// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Wine Shop ERP API is running",
  });
});

// Error for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);

export default app;
