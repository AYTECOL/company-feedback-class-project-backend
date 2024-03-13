const bcrypt = require("bcryptjs");
const saltRounds = 10;

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const comparePasswords = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  encryptPassword,
  comparePasswords,
};
