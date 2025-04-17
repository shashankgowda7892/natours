const express = require("express");
const morgan = require("morgan");
const AppError = require("./Utils/appError");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const GlobalErrorHandler = require("./Controllers/errorController");

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log(req.headers);
  
  next();
});
app.use(morgan("dev"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users",userRouter)

// Error handling in UnKnown Route
app.all("{*path}", (req, res, next) => {
  next(new AppError("Can't find  on this server!", 404));
});
// Global Error Handling
app.use(GlobalErrorHandler);

module.exports = app;
