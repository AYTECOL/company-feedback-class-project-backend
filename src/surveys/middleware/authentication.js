const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../utils/authentication");

const validateToken = (request, response, next) => {
  try {
    console.info({ msg: "HEADERS", headers: request.headers });
    const authorization = request.headers["authorization"];
    const token = authorization.split(" ")[1];
    if (!token) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Token not found" });
    }

    const decoded = verifyToken(token);
    console.info({ msg: "DECODED", decoded });
    if (!decoded) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid token" });
    }

    request.user = { email: decoded.email };

    next();
  } catch (error) {
    console.error("Error validateToken middleware: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
};

module.exports = {
  validateToken,
};
