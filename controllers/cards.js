const { Error } = require('mongoose');
const Cards = require('../models/card');
const ErrorIsntFound = require('../errors/ErrorIsntFound');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

exports.getCards = (req, res, next) => {
  Cards.find({}).then((card) => res.send(card))
    .catch(next);
};

exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') { next(new ValidationError(error.message)); } else next(error);
    });
};
exports.deleteCard = (req, res, next) => {
  const uId = req.user._id;
  Cards.findById(req.params.cardId)
    .orFail(new ErrorIsntFound('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() === uId) {
        Cards.findByIdAndRemove(req.params.cardId).then((delition) => res.send(delition)).catch((error) => {
          if (Error.name === 'CastError') {
            next(
              new ValidationError('Переданы неверные данные карточки'),
            );
          } else next(error);
        });
      } else throw new ForbiddenError('Карточка создана другим пользователем');
    })
    .catch((error) => {
      if (Error.name === 'CastError') {
        next(
          new ValidationError('Переданы неверные данные карточки'),
        );
      } else next(error);
    });
};

exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ErrorIsntFound('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    }).catch((error) => {
      if (error.name === 'ValidationError') { next(new ValidationError(error.message)); } else if (error.name === 'CastError') {
        next(
          new ValidationError('Переданы неверные данные карточки'),
        );
      } else next(error);
    });
};
exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ErrorIsntFound('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') { next(new ValidationError(error.message)); } else if (error.name === 'CastError') {
        next(
          new ValidationError('Переданы неверные данные карточки'),
        );
      } else next(error);
    });
};
