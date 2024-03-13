const { formatInTimeZone } = require("date-fns-tz");

const { TIME_ZONE, FORMAT_DATE } = require("./constants");

const getCurrentDate = () => {
  return formatInTimeZone(new Date(), TIME_ZONE, FORMAT_DATE);
};

module.exports = {
  getCurrentDate,
};
