const Tour = require("../Models/TourModel");
const AppError = require("../Utils/appError");
const catchAsync = require('../Utils/catchAsync')
const factory = require('./factoryHandler')


exports.getAllTours = factory.getAll(Tour)

exports.createTour = factory.createOne(Tour)

exports.getTour = factory.getOne(Tour,{path : "reviews guides" })

exports.updateTour = factory.UpdateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)


exports.getToursWithin = catchAsync( async(req,res,next) =>{
    const {distance,latlng,unit} = req.params;
    const [lat,lng] = latlng.split(',')

    if(!lat || !lng)
        next(new AppError("Please peovide latitude and longitude in thios format lat,lng",400))

    const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1
    const tours  = await Tour.find({startLocation : { $geoWithin : { $centerSphere : [[lng,lat],radius]}}})

    res.status(200).json({
        result : "success",
        count : tours.length,
        data :{
            data : tours
        }
    })

})


exports.getDistances = catchAsync(async (req,res,next) =>{
    const {latlng,unit} = req.params
    const [lat,lng] = latlng.split(',')
    
    const multiplier = unit ==='mi' ? 0.000621371 : 0.001


    if(!lat || !lng)
        next(new AppError("Please peovide latitude and longitude in thios format lat,lng",400))


    const distances = await Tour.aggregate([{
        $geoNear :{
            near : {
                type : 'Point',
                coordinates : [parseInt(lng),parseInt(lat)] 
            },
            distanceField : 'distance',
            key: 'startLocation',
            distanceMultiplier : multiplier
        },
        
       
    },
    {
        $project : {
            distance : 1,
            name : 1
        }
    }
])

    res.status(200).json({
        result : "success",
        count : distances.length,
        data :{
            data : distances
        }
    })
})