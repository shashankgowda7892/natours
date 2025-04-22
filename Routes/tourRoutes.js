const express = require("express");
const tourController = require("../Controllers/tourController");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour
  );

module.exports = router;
