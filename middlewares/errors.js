const { isCelebrateError } = require('celebrate');
const Error500 = require('../errors/error500');
const Error404 = require('../errors/error404');
const {
  ERROR_500_TEXT,
  ERROR_400_TEXT,
  ERROR_404_URL_TEXT,
} = require('../constants/error_texts');

module.exports.error404HandlingMiddleware = (req, res, next) => next(
  new Error404(ERROR_404_URL_TEXT),
);

module.exports.errorsHandlingMiddleware = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (isCelebrateError(err)) {
    statusCode = 400;
    message = ERROR_400_TEXT;
  }

  res.status(statusCode).send(
    { message: statusCode === 500 ? new Error500(ERROR_500_TEXT) : message },
  );
  next();
};
