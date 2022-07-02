const router = require('express').Router();

const {
  validateSignin,
  validateSignup,
} = require('../utils/request_validators');

const { login, signup } = require('../controllers/user');

const { logoutUser } = require('../controllers/user');

router.route('/signin')
  .post(validateSignin, login);

router.route('/signup')
  .post(validateSignup, signup);

router.route('/signout')
  .delete(logoutUser);

module.exports = router;
