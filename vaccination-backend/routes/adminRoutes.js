const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/login", adminController.login);
router.post("/centers", adminController.createCenter);
router.get("/centers", adminController.getCenters);
router.get("/centers/:id", adminController.getCenterById);
router.put("/centers/:id", adminController.updateCenter);
router.delete("/centers/:id", adminController.deleteCenter);
router.get("/users", adminController.getUsers);
router.get("/vaccinations", adminController.getVaccinations);

module.exports = router;
