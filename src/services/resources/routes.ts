import express from "express";
import {
  badRequestCatch,
  healthCheck,
  teamVolunteers,
  teamDonors,
  teamHubs,
  neighbourhoodVolunteers,
  neighbourhoodDonors,
  neighbourhoodDrives,
  updateVolunteerNotes,
  updateVolunteerNotesByTeam,
  teamFoodDrives,
  authenticate,
  getLoggedIn,
  logout,
} from "./controllers";

export const router = express.Router();

router.use("/v1/resources/healthcheck", healthCheck);

router.get("/v1/teams/:team/volunteers", teamVolunteers);
router.post("/v1/teams/:team/volunteers/:volunteer/updateNotes", updateVolunteerNotesByTeam);
router.get("/v1/teams/:team/donors", teamDonors);
router.get("/v1/teams/:team/food-drives", teamFoodDrives);
router.get("/v1/teams/:team/hubs", teamHubs);

router.get("/v1/auth/me", getLoggedIn);
router.post("/v1/auth/authenticate", authenticate);
router.post("/v1/auth/logout", logout);


// to be deprecated
router.get("/v1/neighbourhoods/:neighbourhood/volunteers", neighbourhoodVolunteers);
router.get("/v1/neighbourhoods/:neighbourhood/donors", neighbourhoodDonors);
router.get("/v1/neighbourhoods/:neighbourhood/foodDrives", neighbourhoodDrives);
router.post("/v1/neighbourhoods/:neighbourhood/volunteers/:volunteer/updateNotes", updateVolunteerNotes);

router.use(badRequestCatch);
