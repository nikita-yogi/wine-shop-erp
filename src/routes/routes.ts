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
import customerRoutes from "./customers.js"
import orderRoutes from "./order.js";
import productRoutes from "./product.js"
import storeBatchRoutes from "./storeProductBatch.js";
import supplierRoutes from "./supplier.js";
import purchaseOrderRoutes from  "./purchaseOrder.js";



const router = Router();

//auth routes
router.use("/auth", authRoutes);

// Users routes
router.use("/users",authMiddleware, userRoutes);

//role
router.use("/roles", roleRoutes);

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

//store-batch rotes
router.use("/store-product-batchs" ,authMiddleware,storeBatchRoutes);

//supplier route
router.use("/suppliers", authMiddleware ,supplierRoutes);

//purchaseOrder route
router.use("/purchaseOrder", authMiddleware, purchaseOrderRoutes);


//customer routes
 router.use("/customer",authMiddleware, customerRoutes );

//order route
router.use("/orders", authMiddleware,orderRoutes);






export default router;
