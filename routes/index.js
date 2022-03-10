const router = require('express').Router();
const Error404 = require('../errors/error404');
const { ERROR_404_URL_TEXT } = require('../constants/error_texts');

router.use(require('./user'));
router.use(require('./movie'));

router.route('*', (req, res, next) => next(
  new Error404(ERROR_404_URL_TEXT),
));

module.exports = router;
