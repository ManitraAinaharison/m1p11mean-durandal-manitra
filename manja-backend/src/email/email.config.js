const nodemailer = require("nodemailer");
require("dotenv").config({
    path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    },
});

const mailOptions = (sendToList, subject, content) => {
    return {
        from: {
            name: "Manja - salon de beauté",
            address: process.env.USER
        },
        to: sendToList,
        subject: subject,
        html: content,
    }
}

module.exports.transporter = transporter;
module.exports.mailOptions = mailOptions;