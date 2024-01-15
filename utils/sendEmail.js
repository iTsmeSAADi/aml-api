import nodemailer from 'nodemailer';


const sendEmail = async (to, from, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'saadshah269@gmail.com',
      pass: 'kihkpxmwdulurvma'
    }
  });
  const mailOptions = {
    from: 'saadshah269@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: " + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export { sendEmail };

