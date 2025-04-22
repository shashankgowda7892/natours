const Tour = require("../Models/TourModel");
const AppError = require("../Utils/appError");
const catchAsync = require('../Utils/catchAsync')
const factory = require('./factoryHandler')


exports.getAllTours = factory.getAll(Tour)

exports.createTour = factory.createOne(Tour)

exports.getTour = factory.getOne(Tour,{path : "reviews guides" })

exports.updateTour = factory.UpdateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)
