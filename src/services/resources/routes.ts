import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../../openAPIs/swagger";
import {
  badRequestCatch,
  healthCheck,
} from "./controllers";

export const router = express.Router();

// Just handle all versions downstream
// router.get("/:version/resources/captains/redirect", getPouchRedirect);

router.use("/:version/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/:version/resources/healthcheck", healthCheck);

router.use(badRequestCatch);
