import { Router } from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
import roleRoutes from "./role.js";
import { authMiddleware } from "../middleware/auth.js";
import storeRoutes from "./store.js";
import brandRoutes from "./brand.js";
import categoryRoutes from "./category.js";
import productTypeRoutes from "./productType.js";
import storeProductRoutes from "./storeProduct.js";
import supplierRouts from "../routes/supplier.js"
const router = Router();

//auth routes
router.use("/auth", authRoutes);
// User routes
router.use("/users",authMiddleware , userRoutes);
//role
router.use("/roles", roleRoutes);
router.use("/stores", authMiddleware ,storeRoutes);
router.use("/brands",authMiddleware , brandRoutes);
router.use("/categories", authMiddleware ,categoryRoutes);
router.use("/product-types",authMiddleware , productTypeRoutes);
router.use("/store-products",authMiddleware , storeProductRoutes);

router.use("/supplier", authMiddleware ,supplierRouts);


export default router;
