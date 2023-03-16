const Cards = require('../models/card');
const ErrorIsntFound = require('../errors/ErrorIsntFound');
const { ErrorHandler } = require('../middlewares/ErrorHandler');

exports.getCards = (req, res) => {
  Cards.find({}).then((card) => res.send(card))
    .catch((error) => {
      ErrorHandler(error, res);
    });
};

exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          valMsg: 'Переданы неверные данные карточки',
        },
      );
    });
};
exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) throw new ErrorIsntFound();
      else res.send(card);
    }).catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          foundMsg: 'Rарточка не найдена',
          valMsg: 'Переданы неверные данные карточки',
        },
      );
    });
};

exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new ErrorIsntFound();
      else res.send(card);
    })
    .catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          foundMsg: 'Rарточка не найдена',
          valMsg: 'Переданы неверные данные карточки',
        },
      );
    });
};

exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new ErrorIsntFound();
      else res.send(card);
    })
    .catch((err) => {
      ErrorHandler(
        error,
        res,
        {
          foundMsg: 'Rарточка не найдена',
          valMsg: 'Переданы неверные данные карточки',
        },
      );
    });
};
