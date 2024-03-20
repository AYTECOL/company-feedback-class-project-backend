const nodemailer = require("nodemailer");

const {
  MAILER_EMAIL,
  MAILER_PASSWORD,
  BASE_URL,
} = require("./constants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_PASSWORD,
  },
});

const sendMail = async (email) => {
  const url = `${BASE_URL}/account/verify/${email}`;
  const mailOptions = {
    from: MAILER_EMAIL,
    to: email,
    subject: "Verificación de cuenta",
    html: `
      <h1>Verifica tu cuenta</h1> 
      <p>Para verificar tu cuenta, haz clic en el siguiente enlace: ${url}</p>
    `,
  };
  console.log({msg: "Sending email: ", mailOptions});

  const info = await transporter.sendMail(mailOptions);
  console.log({msg: "Email info: ", info});
};

module.exports = {
  sendMail,
};
