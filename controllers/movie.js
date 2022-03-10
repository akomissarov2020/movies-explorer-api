const Error400 = require('../errors/error400');
const Error403 = require('../errors/error403');
const Error404 = require('../errors/error404');

const {
  ERROR_400_TEXT,
  ERROR_403_TEXT,
  ERROR_404_MOVIE_TEXT,
} = require('../constants/error_texts');

const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find()
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  if (!req.body) {
    return next(new Error400(ERROR_400_TEXT));
  }
  const {
    country,
    director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    owner,
    thumbnail,
    movieId,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .populate('owner')
        .then((populatedMovie) => res.send(populatedMovie))
        .catch((e) => e);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new Error400(ERROR_400_TEXT));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  return Movie.findById(req.params.movieId)
    .populate('owner')
    .then((mymovie) => {
      if (!mymovie) {
        return next(new Error404(ERROR_404_MOVIE_TEXT));
      }
      if (!mymovie.owner || mymovie.owner._id.toString() !== owner) {
        return next(new Error403(ERROR_403_TEXT));
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .populate('owner')
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new Error400(ERROR_400_TEXT));
          }
          return next(err);
        });
    });
};
