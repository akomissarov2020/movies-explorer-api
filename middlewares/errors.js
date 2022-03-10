const Error500 = require('../errors/error500');
const { ERROR_500_TEXT } = require('../constants/error_texts');

module.exports.errorsHandlingMiddleware = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    { message: statusCode === 500 ? new Error500(ERROR_500_TEXT) : message },
  );
  next();
};
