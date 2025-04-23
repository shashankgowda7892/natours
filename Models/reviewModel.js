const mongoose = require('mongoose')
const Tour = require('./TourModel')
const { stat } = require('fs')
const reviewSchema = mongoose.Schema({
    review : {
        type : String,
        required : [true," review cannot be empty"]
    },
    rating : {
        type : Number,
        min :1,
        max : 5
    },
    createAt : {
        type : Date,
        default : Date.now()
    },
    tour :{
        type : mongoose.Schema.ObjectId,
        ref : 'Tour',
        required : [true ,"Review must belog to a tour" ]

    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : [true ,"Review must belog to a user" ]

        
    },
   
})

// Only one review can be given ont tour by the users
reviewSchema.index({tour : 1,user : 1},{unique : true})

// calculating average review for the tour
reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match : {tour : tourId}
        },
        {
            $group : {
                _id : "$tour",
                nRatings : { $sum :1},
                aRatings : { $avg : '$rating'}
            }
        }
        
    ])
    console.log(stats);
    if(stat.length > 0){

        await Tour.findByIdAndDelete(tourId,{
            ratingQuantity : stats[0].nRatings,
            ratingAverage : stats[0].aRatings
        })
    }else{
        await Tour.findByIdAndDelete(tourId,{
            ratingQuantity : 0,
            ratingAverage : 4.5
        })
    }

}

reviewSchema.post('save',function(next){

    this.constructor.calcAverageRatings(this.tour)
    next()
})

// Update and delete 
reviewSchema.pre(/^findOneAnd/,async function(next){
     this.r = await this.findOne()
     next()
})

reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructorcalcAverageRatings(this.r.tour)

  
})




reviewSchema.pre(/^find/,function(next){
    this.populate({
        path : 'Tour',
        select : "name"
    }).populate({
        path : 'user',
        select : "name photo"
    })

    next()
})


const Review = mongoose.model('Review',reviewSchema)

module.exports = Review