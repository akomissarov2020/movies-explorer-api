const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

require('dotenv').config();

const { NODE_ENV, PROD_JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../constants/devs');

const JWT_SECRET = NODE_ENV === 'production' ? PROD_JWT_SECRET : DEV_JWT_SECRET;

module.exports.createUser = (req, res, next) => {
  if (!req.body) {
    return next(new Error400('Неправильные параметры'));
  }

  const {
    name, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new Error400('Неправильные параметры'));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error409('Пользователь существует');
      }

      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then(res.status(201).send({}))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new Error400('Неправильные формат email'));
          }
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            return next(new Error400('Неправильные параметры'));
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
        return next(new Error404('Пользователь не найден'));
      }
      return res.send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400('Неправильные параметры'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { _id } = req.user;
  if (!req.body) {
    return next(new Error400('Неправильные параметры'));
  }
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new Error400('Неправильные параметры'));
  }
  return User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new Error404('Пользователь не найден'));
      }
      return res.send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new Error400('Неправильные параметры'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return next(new Error400('Неправильные параметры'));
  }
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new Error401('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
      );
      return res.status(200).cookie('jwt', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({}).end();
    })
    .catch((err) => next(err));
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie('jwt').send({}).end();
};
