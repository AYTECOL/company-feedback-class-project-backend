// General constants
const AWS_REGION = process.env.AWS_REGION;
const COMPANY_FEEDBACK_TABLE = process.env.COMPANY_FEEDBACK_TABLE;
const BASE_URL = process.env.BASE_URL;

// Authentification constants
const JWT_SECRET = "MySuperSecretKeyForJWT";

// Mailer constants
const MAILER_SERVICE = "Gmail";
const MAILER_EMAIL = "companyfeedback347@gmail.com";
const MAILER_PASSWORD = "company_password";

module.exports = {
  AWS_REGION,
  COMPANY_FEEDBACK_TABLE,
  BASE_URL,
  JWT_SECRET,
  MAILER_SERVICE,
  MAILER_EMAIL,
  MAILER_PASSWORD,
};
