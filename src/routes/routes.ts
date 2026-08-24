import { Router } from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
import roleRoutes from "../routes/role.js";



const router = Router();

//auth routes
router.use("/auth", authRoutes);
// User routes
router.use("/users", userRoutes);
//role
router.use("/roles", roleRoutes);


export default router;