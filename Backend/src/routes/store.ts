import { Router } from "express";
import storeController from "../controllers/store.js";
import { validate } from "../middlewares/validate.js";
import {
  createStoreSchema,
  updateStoreSchema,
  storeParamsSchema,
} from "../validations/store.schema.js";

const router = Router();

router.post("/", validate(createStoreSchema), storeController.create);

router.get("/", storeController.list);

router.get("/:uuid", validate(storeParamsSchema), storeController.getStore);

router.patch("/:uuid", validate(storeParamsSchema),validate(updateStoreSchema),storeController.update);

router.delete("/:uuid", validate(storeParamsSchema), storeController.remove);

export default router;
