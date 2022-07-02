const mongoose = require('mongoose');
const { validateURLforScheme } = require('../utils/custom_validators');

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: /[ \wа-яА-ЯЁёё-]+/,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: /[ \wа-яА-ЯЁёё-]+/,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validateURLforScheme,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: validateURLforScheme,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: validateURLforScheme,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', moviesSchema);
