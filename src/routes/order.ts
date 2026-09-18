import { Router } from "express";
import orderController from "../controllers/order.js";
import { authMiddleware } from "../middleware/auth.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderSchema,
  updateOrderSchema,
  orderParamsSchema,
} from "../validations/order.schema.js";

const router = Router();


router.post(
  "/",
  authorizePermission("manage_order"),
  validate(createOrderSchema),
  orderController.create

);

router.get("/", authorizePermission("view_order"), );

router.get(
  "/:uuid",
  authorizePermission("view_order"),
  validate(orderParamsSchema, "params"),

);

router.patch(
  "/:uuid",
  authorizePermission("manage_order"),
  validate(orderParamsSchema, "params"),
  validate(updateOrderSchema),

);

router.delete(
  "/:uuid",
  authorizePermission("manage_order"),
  validate(orderParamsSchema, "params"),

);

export default router;