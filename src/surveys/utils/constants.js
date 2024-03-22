// General constants
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const AWS_REGION = process.env.AWS_REGION;
const COMPANY_FEEDBACK_TABLE = process.env.COMPANY_FEEDBACK_TABLE;
const COMPANY_FEEDBACK_BUCKET = process.env.COMPANY_FEEDBACK_BUCKET;
const BASE_URL = process.env.BASE_URL;

// Authentification constants
const JWT_SECRET = "MySuperSecretKeyForJWT";

// Date constants
const TIME_ZONE = "America/Bogota";
const FORMAT_DATE = "yyyy-MM-dd HH:mm:ss";

module.exports = {
  CORS_ORIGIN,
  AWS_REGION,
  COMPANY_FEEDBACK_TABLE,
  COMPANY_FEEDBACK_BUCKET,
  BASE_URL,
  JWT_SECRET,
  TIME_ZONE,
  FORMAT_DATE,
};
