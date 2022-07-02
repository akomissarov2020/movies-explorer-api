const router = require('express').Router();

const {
  validateAddMovie,
  validateDeleteMovie,
} = require('../utils/request_validators');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.route('/')
  .get(getMovies)
  .post(validateAddMovie, createMovie);

router.route('/:movieId')
  .delete(validateDeleteMovie, deleteMovie);

module.exports = router;
