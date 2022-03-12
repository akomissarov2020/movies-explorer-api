const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Error401 = require('../errors/error401');
const { ERROR_401_TEXT } = require('../constants/error_texts');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: /[\wа-яА-ЯЁёё-]+/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    minlength: 5,
    required: true,
    select: false,
  },
});

usersSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error401(ERROR_401_TEXT));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error401(ERROR_401_TEXT));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', usersSchema);
