const Review = require("../Models/reviewModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");



exports.getAllReview = catchAsync(async (req, res,next) => {
  let filter = {}
  if(!req.params.tourId)
    filter = {tour : req.params.tourId}


  const review =  await Review.find(filter)
  
  res.status(200).json({
    status: "sucess",
    review : review
  });
})



exports.createReview = catchAsync(async (req, res,next) => {
  if(!req.body.tour)
    req.body.tour = req.params.tourId
  if(!req.body.user)
    req.body.user = req.user.id


    const newReview = await Review.create(req.body);
    res.json({
      staus: "Success",
      data: {
        review: newReview,
      },
    });
   
})