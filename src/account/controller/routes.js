const express = require("express");
const { StatusCodes } = require("http-status-codes");

const { encryptPassword, comparePasswords } = require("../utils/cryptography");
const { generateToken } = require("../utils/authentication");
const { sendMail } = require("../utils/mailer");
const { validateToken } = require("../middleware/authentication");
const {
  getCompanyData,
  updateCompanyData,
  verifyCompany,
  createCompany,
} = require("../aws/dynamodb");

const api = express.Router();

api.post("/signin", async (request, response) => {
  try {
    console.info({ msg: "BODY", body: request.body });
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Missing email or password" });
    }

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });
    if (!companyData) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Company not found" });
    }

    if (!companyData.verified) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Account not verified" });
    }

    const match = await comparePasswords(password, companyData.password);
    console.info({ msg: "MATCH", match });
    if (!match) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid password" });
    }

    const token = generateToken({ email });
    console.info({ msg: "TOKEN", token });

    response
      .status(StatusCodes.OK)
      .json({ msg: "Logged in successfully", token });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.post("/create", async (request, response) => {
  try {
    console.info({ msg: "BODY", body: request.body });
    const { email, password, passwordConfirmation } = request.body;
    if (!email || !password) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Missing email, password or password confirmation" });
    }

    if (password !== passwordConfirmation) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Passwords do not match" });
    }

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });
    if (companyData) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Company already exists" });
    }

    const hashedPassword = await encryptPassword(password);

    await createCompany(email, hashedPassword);

    await sendMail(email);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Account created successfully" });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.get("/verify/:email", async (request, response) => {
  try {
    console.info({ msg: "PARAMS", params: request.params });
    const { email } = request.params;

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });
    if (!companyData) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .setHeader("Content-Type", "text/html")
        .send("<h1 style='color: red;'>Company not found</h1>");
    }

    if (companyData.verified) {
      return response
        .status(StatusCodes.CONFLICT)
        .setHeader("Content-Type", "text/html")
        .send("<h1 style='color: red;'>Account already verified</h1>");
    }

    await verifyCompany(email);

    response
      .status(StatusCodes.OK)
      .setHeader("Content-Type", "text/html")
      .send("<h1 style='color: green;'>Account verified successfully</h1>");
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .setHeader("Content-Type", "text/html")
      .send("<h1 style='color: red;'>Internal server error</h1>");
  }
});

api.put("/update", [validateToken], async (request, response) => {
  try {
    console.info({ msg: "USER", user: request.user });
    const { email } = request.user;

    console.info({ msg: "BODY", body: request.body });
    const companyData = request.body;

    await updateCompanyData(email, companyData);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Updated account successfully" });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

module.exports = api;
