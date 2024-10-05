import nodemailer from 'nodemailer';

export const sendReport = async (email, html) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS
    }
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: `Badania Przesiewowe ${new Date().toLocaleString()}`,
    html
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Message sent: %s', info.messageId);
        resolve(info);
      }
    });
  });
};