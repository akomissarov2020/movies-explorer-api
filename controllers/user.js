const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

const {
  ERROR_400_TEXT,
  ERROR_401_TEXT,
  ERROR_409_TEXT,
  ERROR_400_EMAIL_TEXT,
  ERROR_404_USER_TEXT,
} = require('../constants/error_texts');

const { JWT_COOKIE_AGE } = require('../constants/parameters');

require('dotenv').config();

const { NODE_ENV, PROD_JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../constants/devs');

const JWT_SECRET = NODE_ENV === 'production' ? PROD_JWT_SECRET : DEV_JWT_SECRET;

module.exports.signup = (req, res, next) => {
  if (!req.body) {
    return next(new Error400(ERROR_400_TEXT));
  }

  const {
    name, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new Error400(ERROR_400_TEXT));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error409(ERROR_409_TEXT);
      }

      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then(res.status(201).send({}))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new Error400(ERROR_400_EMAIL_TEXT));
          }
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            return next(new Error400(ERROR_400_TEXT));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new Error404(ERROR_404_USER_TEXT));
      }
      return res.send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(ERROR_400_TEXT));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { _id } = req.user;
  if (!req.body) {
    return next(new Error400(ERROR_400_TEXT));
  }
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new Error400(ERROR_400_TEXT));
  }
  return User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new Error404(ERROR_404_USER_TEXT));
      }
      return res.send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new Error400(ERROR_400_TEXT));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new Error401(ERROR_401_TEXT));
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
      );
      return res.status(200).cookie('jwt', token, {
        maxAge: JWT_COOKIE_AGE,
        httpOnly: true,
        sameSite: true,
      }).send({}).end();
    })
    .catch((err) => next(err));
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie('jwt').send({}).end();
};
