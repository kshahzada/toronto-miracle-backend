import express from "express";
import {
  badRequestCatch,
  healthCheck,
} from "./controllers";

export const router = express.Router();

// Just handle all versions downstream
// router.get("/:version/resources/captains/redirect", getPouchRedirect);

router.use("/:version/resources/healthcheck", healthCheck);

router.use(badRequestCatch);
