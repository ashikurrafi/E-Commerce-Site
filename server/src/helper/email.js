const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: smtpUsername,
        pass: smtpPassword,
    },
});

const emailWithNodeMailer = async (emailData) => {
    try {
        const mailOptions = {
            from: smtpUsername,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html,
        };

        // Send the email and capture the response
        const info = await transporter.sendMail(mailOptions);

        // Log the response message
        logger.log("info", "Message sent: %s", info.response);
    } catch (error) {
        logger.error("error", "Error occurred while sending mail", error);
        throw error;
    }
};

module.exports = emailWithNodeMailer;
