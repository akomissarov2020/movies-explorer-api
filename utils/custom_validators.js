const validator = require('validator');
const { WRONG_URL_FORMAT } = require('../constants/error_texts');

module.exports.validateURLforScheme = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return false;
  }
  return value;
};

module.exports.validateURL = (value, helper) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helper.message(WRONG_URL_FORMAT);
  }
  return value;
};
