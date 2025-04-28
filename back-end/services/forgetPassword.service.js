const nodemailer = require("nodemailer");

const generateEmailHtml = (username, resetLink) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333333;
      }
      p {
        color: #555555;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Reset Your Password</h1>
      <p>Hello ${username},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <p>Thanks,<br>Your Company Team</p>
    </div>
  </body>
  </html>
`;

module.exports.main = async (email, userName, resetLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ecommercesystemiti@gmail.com",
        pass: "broo nnyd mrzf hjpw" // Use your App Password here
    }
});

try {
    const info = await transporter.sendMail({
        from: "ecommercesystemiti@gmail.com",
        to: email,
        subject: "Change Password",
        html: generateEmailHtml(userName, resetLink)
    });

    console.log("Message sent successfully. Message ID: " + info.messageId);
    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info)); // Only for nodemailer test account

    return {
        success: true,
        message: "Email sent successfully",
        info
    };
} catch (error) {
    console.error("Error sending email:", error);
    return {
        success: false,
        message: "Failed to send email",
        error
    };
}
}
