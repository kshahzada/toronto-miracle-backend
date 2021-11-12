import express from "express";
import {
  badRequestCatch,
  healthCheck,
  teamDonors,
  neighbourhoodVolunteers,
  neighbourhoodDonors,
  neighbourhoodDrives,
  updateVolunteerNotes,
  authenticate,
  getLoggedIn,
  logout,
} from "./controllers";

export const router = express.Router();

router.use("/v1/resources/healthcheck", healthCheck);

router.get("/v1/teams/:team/volunteers", neighbourhoodVolunteers);
router.get("/v1/teams/:team/donors", teamDonors);
router.get("/v1/teams/:team/foodDrives", neighbourhoodDrives);

router.get("/v1/auth/me", getLoggedIn);
router.post("/v1/auth/authenticate", authenticate);
router.post("/v1/auth/logout", logout);


// to be deprecated
router.get("/v1/neighbourhoods/:neighbourhood/volunteers", neighbourhoodVolunteers);
router.get("/v1/neighbourhoods/:neighbourhood/donors", neighbourhoodDonors);
router.get("/v1/neighbourhoods/:neighbourhood/foodDrives", neighbourhoodDrives);
router.post("/v1/neighbourhoods/:neighbourhood/volunteers/:volunteer/updateNotes", updateVolunteerNotes);

router.use(badRequestCatch);
