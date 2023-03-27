const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { linkMask } = require('../middlewares/masks');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', auth, getCards);

cardRoutes.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(linkMask),
    }),
  }),
  createCard,
);

cardRoutes.delete(
  '/:cardId',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().required().hex()
        .length(24),
    }),
  }),
  deleteCard,
);

cardRoutes.put(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().required().hex()
        .length(24),
    }),
  }),
  likeCard,
);

cardRoutes.delete(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().required().hex()
        .length(24),
    }),
  }),
  dislikeCard,
);

module.exports = cardRoutes;
