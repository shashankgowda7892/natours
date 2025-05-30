const express = require("express");
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");


const router = express.Router();


router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)

// MiddleWare to all the routes comes after this
router.use(authController.protect)

router.patch('/updateMyPassword',authController.protect,authController.updatePassword)
router.get('/me',authController.protect,userController.getMe,userController.getUser)

router.patch('/updateMe',userController.updateMe)
router.delete('/deleteMe',userController.deleteMe)

router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect,authController.restrictTo,userController.deleteUser);



module.exports = router