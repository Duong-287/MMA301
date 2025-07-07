require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, content, isHtml = false) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    [isHtml ? "html" : "text"]: content, 
  });
};

module.exports = sendEmail;
