const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { validateURL } = require('../utils/local_validators');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/api/movies', getMovies);

router.post('/api/movies', celebrate({
  params: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.number(),
    year: Joi.number(),
    description: Joi.string(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.string(),
  }),
}), createMovie);

router.delete('/api/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
