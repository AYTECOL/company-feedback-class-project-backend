const nodemailer = require("nodemailer");

const {
  MAILER_EMAIL,
  MAILER_PASSWORD,
  MAILER_SERVICE,
  BASE_URL,
} = require("./constants");

const transporter = nodemailer.createTransport({
  service: MAILER_SERVICE,
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_PASSWORD,
  },
});

const sendMail = (email) => {
  const url = `${BASE_URL}/v1/account/verify?email=${email}`;
  const mailOptions = {
    from: `Remitente ${MAILER_EMAIL}`,
    to: email,
    subject: "Verificación de cuenta",
    html: `
      <h1>Verifica tu cuenta</h1> 
      <p>Para verificar tu cuenta, haz clic en el siguiente enlace: ${url}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    } else {
      console.log(info.response);
    }
  });
};

module.exports = {
  sendMail,
};
