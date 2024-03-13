const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("./constants");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("Error verifyToken: ", error);
      return null;
    }
    return decoded;
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
