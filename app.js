const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require("hpp")

const AppError = require("./Utils/appError");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const GlobalErrorHandler = require("./Controllers/errorController");

console.log("here");
const app = express();



app.use(express.json({limit : '500kb'}));

// Data sanitization against No SQL Query Injection
// app.use(mongoSanitize())

// // Data sanitization XSS
// app.use(xss())

// Preventing Paramter Pollution (?sort=duration&sort=price)
app.use(hpp({
  whitelist :[
    'duration',
    'price',
    'ratingAverage',
    'ratingQuantity',
    'difficulty',
    'maxGroupSize'
  ]
}))

app.use(express.static(`${__dirname}/public`));

// Set security HTTP Headers
app.use(helmet())


app.use((req, res, next) => {
  // console.log(req.headers);
  
  next();
});
app.use(morgan("dev"));


// Global Rate Limiter (Too limit request from same IP)
const limiter = rateLimit({
  max:100,
  windowMs : 60 *60 *1000,
  message :'Too mant request from this IP Try again in an hour'
})
app.use('/api',limiter)


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users",userRouter)

// Error handling in UnKnown Route
app.all("{*path}", (req, res, next) => {
  next(new AppError("Can't find  on this server!", 404));
});
// Global Error Handling
app.use(GlobalErrorHandler);

module.exports = app;
