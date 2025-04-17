const nodemailer = require('nodemailer')
const { options } = require('../app')

const sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        service : "Gmail",
        auth : {
            user : process.env.EMAIL,
            password : process.env.password
        }
    })



    const mailOptions = {
        from : 'Shashank',
        to : options.email,
        text : options.message,

    }



    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail