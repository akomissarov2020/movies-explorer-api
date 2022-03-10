const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUser,
  updateUser,
  logoutUser,
} = require('../controllers/user');

router.route('/api/users/me')
  .get(getUser)
  .patch(celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }), updateUser)
  .delete(logoutUser);

module.exports = router;
