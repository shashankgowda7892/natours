const User = require("../Models/userModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const factory = require('./factoryHandler')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};


exports.getMe = (req,res,next) =>{
  req.params.id = req.user.id
  next()
}



exports.updateMe = catchAsync(async (req, res, next) => {
  
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update, Please use updateMyPassword",
        400
      )
    );
  }
  
  const filterBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status : 'success',
    data : {
      user : updatedUser
    }
  })
  
  
});



exports.deleteMe = async (req,res,next) =>{
  await User.findByIdAndUpdate(req.user.id,{active :false})
  
  res.status(204).json({
    status : 'success'
  })
}



exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User)

exports.createUser = factory.createOne(User)

exports.updateUser = factory.UpdateOne(User)
exports.deleteUser = factory.deleteOne(User)
