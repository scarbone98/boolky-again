const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Token } = require('../models/token');

// Create a transport object
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'groovermanager@gmail.com',
        pass: 'qhqlwjvufpbdljbh'
    }
});

async function sendVerificationEmail(email, session) {
    // Generate a verification token and save it to the database
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const currentTime = new Date();

    const token = new Token({
        email,
        token: verificationToken,
        type: 'email',
        expiresAt: currentTime.setHours(currentTime.getHours() + 24)
    });

    await token.save({ session });

    // Define the email options
    const mailOptions = {
        from: '"Bookly" <groovermanager@gmail.com>',
        to: email,
        subject: 'Bookly Verification',
        text: `Please click the following link to verify your email: http://localhost:3000/authentication/verify?token=${verificationToken}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };