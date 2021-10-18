import express from "express";
import {
  badRequestCatch,
  healthCheck,
  volunteers,
  authenticate,
  getLoggedIn,
} from "./controllers";

export const router = express.Router();

router.use("/v1/resources/healthcheck", healthCheck);
router.get("/v1/resources/captains/:captain_id/volunteers", volunteers);
router.get("/v1/resources/loggedin", getLoggedIn);
router.post("/v1/resources/authenticate", authenticate);

router.use(badRequestCatch);
