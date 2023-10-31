import nodemailer from 'nodemailer';


const sendEmail = async (to, from, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'passquantum@gmail.com',
      pass: '3Fhl%3Den-GB&dsh'
    }
  });
  const mailOptions = {
    from: 'passquantum@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export { sendEmail };

