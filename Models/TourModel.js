const mongoose = require("mongoose");

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
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
