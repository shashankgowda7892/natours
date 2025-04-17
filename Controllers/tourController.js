const Tour = require("../Models/TourModel");
const AppError = require("../Utils/appError");
const catchAsync = require('../Utils/catchAsync')


exports.createTour = catchAsync(async (req, res,next) => {

    console.log(req.body);

    const newTour = await Tour.create(req.body);
    res.json({
      staus: "Success",
      data: {
        tour: newTour,
      },
    });
   
})

exports.getAllTour = async (req, res) => {
  try {
    const allTours = await Tour.find();
 
    
    res.json({
      staus: "Success",
      data: {
        tour: allTours,
      },
    });
  } catch (error) {
    res.status(400).json({
      staus: "Fail",
      message: error,
    });
  }
};

exports.getTour = catchAsync(async (req, res,next) => {

    const getTour = await Tour.findById(req.params.id);
    
    if(!getTour){
 
      return next(new AppError("No Data Found",404))
    }
    res.status(200).json({
      staus: "Success",
      data: {
        tour: getTour,
      },
    });

   

})

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      staus: "Updated Successfully!!",
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      staus: "Fail",
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      message: "Deleted Successfully!!",
    });
  } catch (error) {
    res.status(400).json({
      staus: "Fail",
      message: error,
    });
  }
};
