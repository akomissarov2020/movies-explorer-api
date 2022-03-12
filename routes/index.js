const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const {
  error404HandlingMiddleware,
} = require('../middlewares/errors');

router.use(require('./auth'));
router.use('/users', authMiddleware, require('./user'));
router.use('/movies', authMiddleware, require('./movie'));

router.use(error404HandlingMiddleware);

module.exports = router;
