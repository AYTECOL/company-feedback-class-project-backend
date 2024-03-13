const express = require("express");
const { StatusCodes } = require("http-status-codes");

const { validateToken } = require("../middleware/authentication");
const {
  getCompanyData,
  createSurvey,
  updateSurveys,
} = require("../aws/dynamodb");
const { getCurrentDate } = require("../utils/dates");
const { getS3File, uploadS3File } = require("../aws/s3");

const api = express.Router();

api.get("/list", [validateToken], async (request, response) => {
  try {
    const { email } = request.user;

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });

    response.status(StatusCodes.OK).json({ surveys: companyData.surveys });
  } catch (error) {
    console.error("Error list route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.post("/create", [validateToken], async (request, response) => {
  try {
    const { email } = request.user;

    console.info({ msg: "BODY", body: request.body });
    const { name, questions } = request.body;
    const questionsExists = questions.every(
      (question) => question.question && question.type
    );
    if (!name || !questions || !questionsExists) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Name and questions are required" });
    }

    await createSurvey(email, { name, questions });

    response
      .status(StatusCodes.OK)
      .json({ msg: "Created survey successfully" });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.put("/update/:surveyId", [validateToken], async (request, response) => {
  try {
    const { email } = request.user;

    console.info({ msg: "BODY", body: request.body });
    const { name, questions } = request.body;

    const questionsExists = questions.every(
      (question) => question.question && question.type
    );
    if (!name || !questions || !questionsExists) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Name and questions are required" });
    }

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });

    console.info({ msg: "PARAMS", params: request.params });
    const { surveyId } = request.params;

    const surveyExists = companyData.surveys.some(
      (survey) => survey.surveyId === surveyId
    );
    if (!surveyExists) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Survey not found" });
    }

    const newSurveys = companyData.surveys.map((survey) => {
      if (survey.surveyId === surveyId) {
        return {
          ...survey,
          name,
          questions,
          dateModified: getCurrentDate(),
        };
      }
      return survey;
    });

    await updateSurveys(email, newSurveys);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Updated survey successfully" });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.get("/publish/:surveyId", [validateToken], async (request, response) => {
  try {
    const { email } = request.user;

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });

    console.info({ msg: "PARAMS", params: request.params });
    const { surveyId } = request.params;
    const surveyExists = companyData.surveys.some(
      (survey) => survey.surveyId === surveyId
    );
    if (!surveyExists) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Survey not found" });
    }

    const newSurveys = companyData.surveys.map((survey) => {
      if (survey.surveyId === surveyId) {
        return {
          ...survey,
          published: true,
          datePublished: getCurrentDate(),
        };
      }
      return survey;
    });
    await updateSurveys(email, newSurveys);

    // TODO Create a url to share the survey
    const surveyUrl = `TODO https://{Frontend CloudFrontID}/surveys/${surveyId}`;

    response.status(StatusCodes.OK).json({
      msg: "Published survey successfully",
      surveyUrl,
    });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.get("/get/:email/:surveyId", async (request, response) => {
  try {
    console.info({ msg: "PARAMS", params: request.params });
    const { email, surveyId } = request.params;

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });
    if (!companyData) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Company not found" });
    }

    const survey = companyData.surveys.find(
      (survey) => survey.surveyId === surveyId
    );
    if (!survey) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Survey not found" });
    }
    if (!survey.published) {
      return response
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Survey not published" });
    }

    response.status(StatusCodes.OK).json(survey);
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.post("/submit/:email/:surveyId", async (request, response) => {
  try {
    console.info({ msg: "PARAMS", params: request.params });
    const { email, surveyId } = request.params;

    console.info({ msg: "BODY", body: request.body });
    const { answers } = request.body;

    const csvFileName = `answers-${surveyId}.csv`;
    // TODO Create or get a csv file fs with the answers

    // TODO Upload the csv file to s3
    await uploadS3File(file, csvFileName);

    response.status(StatusCodes.OK).json({
      msg: "Survey submitted successfully",
    });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

api.get("/answers/:surveyId", [validateToken], async (request, response) => {
  try {
    const { email } = request.user;

    const companyData = await getCompanyData(email);
    console.info({ msg: "COMPANY DATA", companyData });

    console.info({ msg: "PARAMS", params: request.params });
    const { surveyId } = request.params;

    const csvFile = getS3File(`answers-${surveyId}.csv`);

    // TODO Who can access the answers?

    response.status(StatusCodes.OK).json({ answers: csvFile });
  } catch (error) {
    console.error("Error signin route: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error general endpoint" });
  }
});

// api.delete("/delete", [validateToken], async (request, response) => {
//   try {
//     console.info(request.params);
//     response
//       .status(StatusCodes.OK)
//       .json({ msg: "Deleted survey successfully" });
//   } catch (error) {
//     console.error("Error signin route: ", error);
//     response
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "internal server error general endpoint" });
//   }
// });

module.exports = api;
