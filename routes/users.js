const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { linkMask } = require('../middlewares/masks');
const {
  getUsers, getOwner, getUserById, updateAvatar, updateProfile,
} = require('../controllers/users');

userRouter.get('/', auth, getUsers);

userRouter.get('/me', auth, getOwner);

// userRouter.post('/', createUser);

userRouter.get(
  '/:userId',
  auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().required().hex()
        .length(24),
    }),
  }),
  getUserById,
);

userRouter.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

userRouter.patch(
  '/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(linkMask),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
