const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../Models/userModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user,statusCode,res) =>{
  const token = signToken(user._id);  
  
  
  const cookieOptions = {
    expiresIn : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 * 60* 60 *1000),
    // secure : true,
    httpOnly : true
  }

  // if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt',token,cookieOptions)
  user.password = undefined


  res.status(statusCode).json({
    status: "Success",
    token: token,
    data: {
      user: user,
    },
  });
}


exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser,201,res)

  
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect Email or password", 401));
  }

  createSendToken(user,201,res)

});

exports.protect = catchAsync(async (req, res, next) => {
  // 1.get token and check it's there
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(new AppError("Not logged in !!"), 401);
  }

  // 2.verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("here", decoded);

  // 3.checek if user exits
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User no longer Exits", 401));
  }

  // 4.check if user changed password after creating 
  // if(!currentUser.changedPasswordAfter(decoded.iat)){
  //     return next(new AppError("Password changed recently, Try again with new password",401))
  // }

  req.user = currentUser;
  console.log(req.user);
  
  next();

  
});

// Adding restriction on some features
exports.restrictTo = (...role) => {
  return (req, res, next) => {
    console.log(role,req.user.role)
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("Do not have permission to perfrom the action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No user Found", 404));
  }

  const resetToken = user.createPasswordResetPassoword();

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;


  const message = `Forgot your password? Submit a PATCH request with your new password and passwordconfirm to :${resetUrl} .\nIf you didn't forgot yout passwrod, please ignore theis email`;
  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(202).json({
      status: syncBuiltinESMExports,
      message: "Token sent to the mail",
    });
  } catch (error) {
    user.passwordresetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
  }

  return next(
    new AppError("There was an error sending the mail Try again later", 500)
  );
};

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordresetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if(!user){
    return next(new AppError("Token has been expired",400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordresetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()


  createSendToken(user,201,res)


};


exports.updatePassword = async (req,res,next) => {
  const user  =  await User.findById(req.user.id).select('+password')

  if(!user.correctPassword(req.body.passwordCurrent,user.password)){
    next(new AppError('Your current password is wrong',401))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  createSendToken(user,201,res)
  

}