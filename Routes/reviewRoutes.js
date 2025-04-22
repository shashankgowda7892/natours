const express = require("express");
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

const router = express.Router({ mergeParams : true});

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(authController.protect,authController.restrictTo('user'),reviewController.createReview);



  module.exports = router