import { Router } from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
// app.ts ya server.ts me
import roleRoutes from "../routes/role.js";



const router = Router();


router.use("/auth", authRoutes);
// User routes
router.use("/users/profile", userRoutes);
//role
router.use("/roles", roleRoutes);


export default router;