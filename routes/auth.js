const router = require('express').Router();

const {
  validateSignin,
  validateSignup,
} = require('../utils/request_validators');

const { login, signup } = require('../controllers/user');

router.route('/api/signin')
  .post(validateSignin, login);

router.route('/api/signup')
  .post(validateSignup, signup);

module.exports = router;
