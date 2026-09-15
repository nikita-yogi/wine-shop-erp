import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
import roleRoutes from "./role.js";
import storeRoutes from "./store.js";
import brandRoutes from "./brand.js";
import categoryRoutes from "./category.js";
import productTypeRoutes from "./productType.js";
import storeProductRoutes from "./storeProduct.js";
import storeProductBatchRoutes from "./storeProductBatch.js";
import customerRoutes from "./customers.js"
import orderRoutes from "./order.js";
import productRoutes from "./product.js"



const router = Router();



//auth routes
router.use("/auth", authRoutes);

// Users routes
router.use("/users",authMiddleware, userRoutes);

//role
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);
router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/product-types", productTypeRoutes);
router.use("/store-products", storeProductRoutes);
router.use("/storeProduct-batch", storeProductBatchRoutes);
router.use("/customer", customerRoutes );
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);

//stores routes
router.use("/stores", authMiddleware ,storeRoutes);

//brands routes
router.use("/brands",authMiddleware , brandRoutes);

// Category routes
router.use("/categories", authMiddleware ,categoryRoutes);

// Products routes
router.use("/product-types",authMiddleware , productTypeRoutes);

//products routes
router.use("/products", authMiddleware ,productRoutes);

//store-products routes
router.use("/store-products",authMiddleware , storeProductRoutes);

//store-batch
router.use("/store-product-batchs" ,authMiddleware,storeBatchRoutes)
//supplier route
router.use("/suppliers", authMiddleware ,supplierRouts);

//purchaseOrder route
router.use("/purchaseOrder", authMiddleware, purchaseOrderRouts);


export default router;
