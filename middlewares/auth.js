const jwt = require('jsonwebtoken');

const Error401 = require('../errors/error401');

const { ERROR_401_AUTH_TEXT } = require('../constants/error_texts');

const { NODE_ENV, PROD_JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../constants/devs');

const JWT_SECRET = NODE_ENV === 'production' ? PROD_JWT_SECRET : DEV_JWT_SECRET;

module.exports = (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];
  } else {
    return next(new Error401(ERROR_401_AUTH_TEXT));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new Error401(ERROR_401_AUTH_TEXT));
  }
};
