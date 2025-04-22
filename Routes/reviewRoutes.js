const express = require("express");
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

const router = express.Router({ mergeParams : true});

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(authController.protect,authController.restrictTo('user'),reviewController.setTourIds,reviewController.createReview);


router.route('/:id').delete(reviewController.deleteReview).patch(reviewController.updateReview)
.get(reviewController.getReview)

  module.exports = router