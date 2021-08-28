var nodemailer = require('nodemailer');

var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
console.log("otp ", seq);
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'skch.bu@gmail.com',
    pass: 'zecvjfqdlyxttoxp'
  }
});

var mailOptions = {
  from: 'skch.bu@gmail.com',
  to: '	snagbiswas@gmail.com,vksvks03@gmail.com',
  subject: 'Sending Email using Node.js',
  text: "Your OTP is :" + seq + " Please share it to Courier Boy",
  // html: "<html> <head></head><body><div><p>Hi<userName>,</p><br><br><p>Please share OTP:<% seq %> </p><br><p>Logisticsteam +Tel:111111111</p></div></body></html>", 
};
 async function sendMail() {
  console.log('Email sent testtt:');
  var sndmail = await transporter.sendMail(mailOptions);
  return sndmail;
}
module.exports = sendMail;


