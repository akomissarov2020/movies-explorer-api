const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { validateURL } = require('../utils/local_validators');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.route('/api/movies')
  .get(getMovies)
  .post(celebrate({
    body: Joi.object().keys({
      country: Joi.string(),
      director: Joi.string(),
      duration: Joi.number(),
      year: Joi.number(),
      description: Joi.string(),
      image: Joi.string().required().custom(validateURL),
      trailerLink: Joi.string().required().custom(validateURL),
      thumbnail: Joi.string().required().custom(validateURL),
      nameRU: Joi.string(),
      nameEN: Joi.string(),
      movieId: Joi.string(),
    }),
  }), createMovie);

router.route('/api/movies/:movieId')
  .delete(celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }), deleteMovie);

module.exports = router;
