const router = require('express').Router();

const { validateUpdateUser } = require('../utils/request_validators');

const {
  getUser,
  updateUser,
  logoutUser,
} = require('../controllers/user');

router.route('/users/me')
  .get(getUser)
  .patch(validateUpdateUser, updateUser)
  .delete(logoutUser);

module.exports = router;
