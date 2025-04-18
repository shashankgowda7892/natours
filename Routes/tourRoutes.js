const express = require("express");
const tourController = require("../Controllers/tourController");
const authController = require("../Controllers/authController");

const router = express.Router();


router
  .route("/")
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
