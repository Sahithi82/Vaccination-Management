const express = require("express");
const vaccinationController = require("../controllers/vaccinationController");

const router = express.Router();

router.get("/centers", vaccinationController.getCenters);
router.get("/centers/:id", vaccinationController.getCenterById);
router.post("/book", vaccinationController.bookVaccination);
router.get("/user/:userId", vaccinationController.getVaccinationsByUser);
router.get("/:id", vaccinationController.getVaccinationById);
router.put("/:id/status", vaccinationController.updateVaccinationStatus);
router.delete("/:id", vaccinationController.cancelVaccination);

module.exports = router;
