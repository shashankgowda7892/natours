const mongoose = require("mongoose");
const User =  require('./userModel');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must have Name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Must have Duration"],
  },
  ratingAverage: {  
    type: Number,
    required: true,
    default: 4.5,
    // Rounding value 
    set : val => Math.round(val * 10)/10
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Must have group size"],
  },
  difficulty: {
    type: String,
    required: [true, "Must have difficulty"],
  },
  price: {
    type: Number,
    required: [true, "Must have Price"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "must have summary"],
  },
  discription: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "must have Image Cover"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  startLocation :{
      type :  {
        type : String,
        default : 'Point',
        enum : ["Point"]
      },
      coordinates : [Number],
      address : String,
      description : String
  },
  locations : [
    {
      type :  {
        type : String,
        default : 'Point',
        enum : ["Point"]
      },
      coordinates : [Number],
      address : String,
      description : String,
      day : Number
    }
  ],
  // guides : Array  ??? embeded reference
  guides :[
    {
      type : mongoose.Schema.ObjectId,    //?? Chid reference
      ref : 'User'
    }
  ],
  reviews :[
    {
      type : mongoose.Schema.ObjectId,    //?? Chid reference
      ref : 'Review'
    }
  ],


},
{
  toJSON : {virtuals : true},
  toObject : {virtuals : true},
});


tourSchema.index({price : 1 })
tourSchema.index({startLocation : '2dsphere'})


tourSchema.virtual('Reviews',{
  ref : 'Review',
  foreignField :  'tour',
  localField : '_id'
})

tourSchema.pre('save', async function(next){
  const guidePromises = this.guides.map(async id => await User.findById(id)) 

  
  this.guides = await Promise.all(guidePromises)
  next()
})

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
