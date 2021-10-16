import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../../openAPIs/swagger";
import {
  badRequestCatch,
  healthCheck,
} from "./controllers";

export const router = express.Router();

router.use("/v1/resources/api-docs", swaggerUi.serveWithOptions({ redirect: false }), swaggerUi.setup(swaggerDocument));
router.use("/v1/resources/healthcheck", healthCheck);

router.use(badRequestCatch);
