const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
module.exports.sendActivationMail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Активация аккаунта на${process.env.API_URL}`,
    text: '',
    html: `<div>
        <h1>Для активации перейдите по ссылке</h1>
        <a href="${link}">${link}</a>
      </div>`,
  });
};
module.exports.sendResetPasswordMail = async (to, resetToken) => {
  const resetLink = `${resetToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Сброс пароля на ${process.env.API_URL}`,
    text: '',
    html: `<div>
        <h1>Для сброса пароля перейдите по ссылке</h1>
        <a href="${resetLink}">${resetLink}</a>
      </div>`,
  });
};
// class MailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//       },
//       debug: true,
//     });
//   }
//   async sendActivationMail(to, link) {
//     await this.transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to,
//       subject: 'Активация аккаунта на' + process.env.API_URL,
//       text: '',
//       html: `<div>
//         <h1>Для активации перейдите по ссылке</h1>
//         <a href="${link}">${link}</a>
//       </div>`,
//     });
//   }
// }
// module.exports = new MailService();
