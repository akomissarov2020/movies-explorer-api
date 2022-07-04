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
  const currentUserId = req.user._id;
  Movie.find({ owner: currentUserId })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
    const {
      country, director, duration, year, description, image,
      trailer, nameRU, nameEN, thumbnail, movieId,
    } = req.body;

    const owner = req.user._id;
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    })
    .then((movie) => {
      Movie.findById(movie._id)
        .then((foundMovie) => res.send(foundMovie))
        .catch((e) => e);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные в методы создания фильма'));
      } else if (err.name === 'CastError') {
        return next(new CastError(ERROR_400_TEXT));
      } else {
        return next(err);
      }
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
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new Error400(ERROR_400_TEXT));
          }
          return next(err);
        });
    })
    .catch(next);
};
