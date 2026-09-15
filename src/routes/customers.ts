import { Router } from "express";

import customerController from "../controllers/customers.js";

import { authMiddleware } from "../middleware/auth.js";
import { authorizePermission } from "../middleware/authorizePermission.js";
import { validate } from "../middleware/validate.js";
import {
  createCustomerSchema,
  customerParamsSchema,
  updateCustomerSchema,
} from "../validations/customers.schema.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizePermission("manage_customer"),
  validate(createCustomerSchema),
    customerController.create,
);

router.get("/", authorizePermission("view_customer"),customerController.list,);

router.get(
  "/:uuid",
  authorizePermission("view_customer"),
  validate(customerParamsSchema, "params"),
  customerController.getOne,
    
);

router.patch(
  "/:uuid",
  authorizePermission("manage_customer"),
  validate(customerParamsSchema, "params"),
  validate(updateCustomerSchema),
  customerController.update,
);

router.delete(
  "/:uuid",
  authorizePermission("manage_customer"),
  validate(customerParamsSchema),
   customerController.remove,
);

export default router;
