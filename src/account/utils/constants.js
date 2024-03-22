// General constants
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const AWS_REGION = process.env.AWS_REGION;
const COMPANY_FEEDBACK_TABLE = process.env.COMPANY_FEEDBACK_TABLE;
const BASE_URL = "https://d5q0bzq9r5.execute-api.us-east-1.amazonaws.com/dev/v1"

// Authentification constants
const JWT_SECRET = "MySuperSecretKeyForJWT";

// Mailer constants
const MAILER_EMAIL = "companyfeedback347@gmail.com";
const MAILER_PASSWORD = "mgvp jujf npkg avch";

module.exports = {
  CORS_ORIGIN,
  AWS_REGION,
  COMPANY_FEEDBACK_TABLE,
  BASE_URL,
  JWT_SECRET,
  MAILER_EMAIL,
  MAILER_PASSWORD,
};
