const crypto = require('crypto')
const mongoose = require("mongoose")
const validator  =require("validator")
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Add Name before submitting"]
    },
    email :{
        type:String,
        required :[true,"Provide email"],
        unique : true,
        lowercase : true,
        validate: [
            {
              validator: function(value) {
                return validator.isEmail(value); 
              },
              message: 'Please provide a valid email address',
            },
          ],
        
    },
    photo : String,
    role : {
        type: String,
        enum : ['user','guide','Lead-guide','admin'],
        default : 'user'
    },
    password :{
        type : String,
        required : [true,"Add Strong password"],
        minlength :8,
        select :false
    },
    passwordConfirm :{
        type:String,
        required : true,
        validate :{
            validator : function (el) {
                return el === this.password
            },
            message: "Passowrd not match"
        }

    },
    passwordresetToken : String,
    passwordResetExpires :Date,
    active :{
        type :Boolean,
        default : true,
        select : false

    }
    
    

})

userSchema.pre('save',async function(next) {

    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12)

    this.passwordConfirm = undefined;
})

userSchema.pre(/^find/,function(next){
    this.where({active : {$ne : false}})
    next()
})


userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

// userSchema.methods.changedPasswordAfter = async function(JWTTimeStamp){
//     return JWTTimeStamp < this.changedTimeStamp
// }

userSchema.methods.createPasswordResetPassoword = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordresetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken
}

const User = mongoose.model('user',userSchema)

module.exports  = User