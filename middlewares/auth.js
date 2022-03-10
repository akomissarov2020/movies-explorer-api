const jwt = require('jsonwebtoken');
require('dotenv').config();

const Error401 = require('../errors/error401');

const { NODE_ENV, PROD_JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../constants/devs');

const JWT_SECRET = NODE_ENV === 'production' ? PROD_JWT_SECRET : DEV_JWT_SECRET;

module.exports = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new Error401('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new Error401('Необходима авторизация'));
  }
};
