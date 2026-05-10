const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
      from: `"MUJI Online Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("MAIL SENT:", info.response);

  } catch (err) {
    console.log("MAIL ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;