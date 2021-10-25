import express from "express";
import {
  badRequestCatch,
  healthCheck,
  captainVolunteers,
  neighbourhoodVolunteers,
  updateVolunteer,
  authenticate,
  getLoggedIn,
} from "./controllers";

export const router = express.Router();

router.use("/v1/resources/healthcheck", healthCheck);
router.get("/v1/neighbourhoods/:neighbourhood/volunteers", neighbourhoodVolunteers);
router.post("/v1/volunteers/:volunteer/update", updateVolunteer);
router.get("/v1/auth/me", getLoggedIn);
router.post("/v1/auth/authenticate", authenticate);

// to be deprecated
router.get("/v1/resources/captains/:captain_id/volunteers", captainVolunteers);
router.get("/v1/resources/loggedin", getLoggedIn);
router.post("/v1/resources/authenticate", authenticate);

router.use(badRequestCatch);
