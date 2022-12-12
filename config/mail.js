const
  nodemailer = require('nodemailer'),
  { MAIL, MAIL_PASSWORD } = process.env

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL,
    pass: MAIL_PASSWORD
  }
})

let mail = options => {
  console.log('MAIL : ', MAIL);
  console.log('MAIL_PASSWORD : ', MAIL_PASSWORD);
  return new Promise((resolve, reject) => {
    let o = {
      from: `E-Voting <${MAIL}>`,
      ...options
    }
    transporter.sendMail(o, (err, res) => {
      err ? reject(err) : resolve('Mail Sent!!')
    })
  })
}

module.exports = mail
