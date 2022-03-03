const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUser,
  updateUser,
  logoutUser,
} = require('../controllers/user');

router.get('/api/users/me', getUser);

router.patch('/api/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.delete('/api/users/me', logoutUser);

module.exports = router;
