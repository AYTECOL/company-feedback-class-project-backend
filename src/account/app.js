const serverlessExpress = require("@codegenie/serverless-express");
const express = require("express");

const app = express();

const api = require("./controller/routes");

app.use(express.json());

app.use("", api);

module.exports.handler = serverlessExpress({ app });
