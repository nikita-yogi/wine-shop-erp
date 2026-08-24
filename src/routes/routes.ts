import { Router } from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
import roleRoutes from "./role.js";
import storeRoutes from "./store.js";
import brandRoutes from "./brand.js";
import categoryRoutes from "./category.js";

const router = Router();

//auth routes
router.use("/auth", authRoutes);
// User routes
router.use("/users", userRoutes);
//role
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);
router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);



export default router;
