import express from "express";
import {
  badRequestCatch,
  healthCheck,
  captainVolunteers,
  neighbourhoodVolunteers,
  updateVolunteerNotes,
  authenticate,
  getLoggedIn,
  logout,
} from "./controllers";

export const router = express.Router();

router.use("/v1/resources/healthcheck", healthCheck);
router.get("/v1/neighbourhoods/:neighbourhood/volunteers", neighbourhoodVolunteers);
router.post("/v1/neighbourhoods/:neighbourhood/volunteers/:volunteer/updateNotes", updateVolunteerNotes);
router.get("/v1/auth/me", getLoggedIn);
router.post("/v1/auth/authenticate", authenticate);
router.post("/v1/auth/logout", logout);

// to be deprecated
router.get("/v1/resources/captains/:captain_id/volunteers", captainVolunteers);
router.get("/v1/resources/loggedin", getLoggedIn);
router.post("/v1/resources/authenticate", authenticate);

router.use(badRequestCatch);
