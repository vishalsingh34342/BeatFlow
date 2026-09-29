const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendOtpEmail = async(email,otp)=>{
    const message = {
        to : email,
        from: process.env.SENDGRID_FROM_EMAIL,
           subject: "Your OTP",
       html: `
       <h2>Email Verification</h2>
       <p>Your OTP is:</p>
       <h1>${otp}</h1>
       <p>This OTP is valid for 5 minutes.</p>
    `,
    };

    await sgMail.send(message)


}
module.exports = { sendOtpEmail };