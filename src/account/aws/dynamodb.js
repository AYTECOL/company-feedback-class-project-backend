const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const { AWS_REGION, COMPANY_FEEDBACK_TABLE } = require("../utils/constants");

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

const createCompany = async (email, password) => {
  try {
    const params = {
      TableName: COMPANY_FEEDBACK_TABLE,
      Item: {
        email,
        password,
        verified: false,
        businessName: "",
        companyDescription: "",
        companyName: "",
        foundation: "",
        numberEmployees: "",
        surveys: [],
      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.put(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const verifyCompany = async (email) => {
  try {
    const params = {
      TableName: COMPANY_FEEDBACK_TABLE,
      Key: {
        email,
      },
      UpdateExpression: "set verified = :v",
      ExpressionAttributeValues: {
        ":v": true,
      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.update(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateCompanyData = async (email, data) => {
  try {
    const params = {
      TableName: COMPANY_FEEDBACK_TABLE,
      Key: {
        email,
      },
      UpdateExpression: `set 
        businessName = :bn, 
        companyDescription = :cd, 
        companyName = :cn, 
        foundation = :f, 
        numberEmployees = :ne
      `,
      ExpressionAttributeValues: {
        ":bn": data.businessName,
        ":cd": data.companyDescription,
        ":cn": data.companyName,
        ":f": data.foundation,
        ":ne": data.numberEmployees,
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
  createCompany,
  verifyCompany,
  updateCompanyData,
};
