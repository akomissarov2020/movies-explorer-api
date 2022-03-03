const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { validateURL } = require('../utils/local_validators');

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/api/movies', getMovie);

router.post('/api/movies', celebrate({
  params: Joi.object().keys({
    country: Joi.string().length(24).hex(),
    director: Joi.string().length(24).hex(),
    duration: Joi.string().length(24).hex(),
    year: Joi.string().length(24).hex(),
    description: Joi.string().length(24).hex(),
    image: Joi.string().length(24).hex(),
    trailer: Joi.string().length(24).hex(),
    nameRU: Joi.string().length(24).hex(),
    nameEN: Joi.string().length(24).hex(),
    thumbnail: Joi.string().length(24).hex(),
    movieId: Joi.string().length(24).hex(),
  }),
}), createMovie);

router.delete('/api/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
