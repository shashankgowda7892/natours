const Review = require("../Models/reviewModel");
// const AppError = require("../Utils/appError");
// const catchAsync = require("../Utils/catchAsync");
const factory = require('./factoryHandler')


exports.getAllReview =factory.getAll(Review)


// Middleware
exports.setTourIds = (req,res,next) =>{
  if(!req.body.tour)
    req.body.tour = req.params.tourId
  if(!req.body.user)
    req.body.user = req.user.id

  next()
}

exports.getReview = factory.getOne(Review)

exports.createReview = factory.createOne(Review)

exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.UpdateOne(Review)