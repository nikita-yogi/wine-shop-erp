import { Router } from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
import roleRoutes from "./role.js";
import storeRoutes from "./store.js";

const router = Router();


router.use("/auth", authRoutes);
router.use("/users/profile", userRoutes);
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);


export default router;
