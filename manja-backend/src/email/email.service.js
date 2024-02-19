const emailConfig = require('./email.config');

module.exports.sendEmail = async (sendToList, subject, content) => {
    try {
        const mailOptions = emailConfig.mailOptions(sendToList, subject, content);
        await emailConfig.transporter.sendMail(mailOptions);
        console.log("Email envoyé");
    } catch (e) {
        console.error(e);
    }
}