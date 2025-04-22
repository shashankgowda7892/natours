const mongoose = require('mongoose')

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