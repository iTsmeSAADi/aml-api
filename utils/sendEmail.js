import pkg from 'nodemailer';
const { nodemailer } = pkg;

export const sendEmail = async (to, from, subject, text) => {


  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'passquantum@gmail.com',
      pass: '3Fhl%3Den-GB&dsh'
    }
  });
  var mailOptions = {
    from: 'passquantum@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
