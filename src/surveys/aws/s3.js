const { S3Client } = require("@aws-sdk/client-s3");

const { AWS_REGION, COMPANY_FEEDBACK_BUCKET } = require("../utils/constants");

const s3Client = new S3Client({ region: AWS_REGION });

const uploadS3File = async (file, key) => {
  try {
    const params = {
      Bucket: COMPANY_FEEDBACK_BUCKET,
      Key: key,
      Body: file,
    };
    console.info({ msg: "PARAMS", params });

    await s3Client.putObject(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getS3File = async (file, path = "") => {
  const params = {
    Bucket: COMPANY_FEEDBACK_BUCKET,
    Key: path + file,
  };
  console.info({ msg: "PARAMS", params });

  let bufferFile;
  try {
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    bufferFile = await response.Body.transformToString("utf-8");
  } catch (error) {
    console.error(error);
    throw error;
  }

  return bufferFile;
};
module.exports = {
  uploadS3File,
  getS3File,
};
