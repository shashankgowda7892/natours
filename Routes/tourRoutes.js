const express = require("express");
const tourController = require("../Controllers/tourController");
const authController = require("../Controllers/authController");
const reviewRouter = require('./reviewRoutes')

const router = express.Router();


router.use('/:tourId/reviews',reviewRouter)

router.route('/tour-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)
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
