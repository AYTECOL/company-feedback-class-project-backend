const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const short = require("short-uuid");

const { AWS_REGION, COMPANY_FEEDBACK_TABLE } = require("../utils/constants");
const { getCurrentDate } = require("../utils/dates");

const dynamodbClient = new DynamoDB({ region: AWS_REGION });
const dynamodb = DynamoDBDocument.from(dynamodbClient);

const getCompanyData = async (email) => {
  try {
    const params = {
      TableName: COMPANY_FEEDBACK_TABLE,
      Key: {
        email,
      },
    };
    console.info({ msg: "PARAMS", params });

    const { Item } = await dynamodb.get(params);

    return Item;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createSurvey = async (email, { name, questions }) => {
  try {
    const params = {
      TableName: COMPANY_FEEDBACK_TABLE,
      Key: {
        email,
      },
      UpdateExpression: "set surveys = list_append(surveys, :s)",
      ExpressionAttributeValues: {
        ":s": [
          {
            surveyId: short.generate(),
            name,
            questions,
            published: false,
            dateCreated: getCurrentDate(),
            dateModified: getCurrentDate(),
            datePublished: "",
          },
        ],
      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.update(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSurveys = async (email, surveys) => {
  try {
    const params = {
      TableName: COMPANY_FEEDBACK_TABLE,
      Key: {
        email,
      },
      UpdateExpression: "set surveys = :s",
      ExpressionAttributeValues: {
        ":s": surveys,
      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.update(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getCompanyData,
  createSurvey,
  updateSurveys,
};
