const Cards = require('../models/card');

exports.getCards = (req, res) => {
  Cards.find({}).then((card) => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Неизвестная ошибка ' }));
};

exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Отправлены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};
exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId).orFail(new Error('InvalidId'))
    .then((card) => {
      res.status(201).send(card);
    }).catch((error) => {
      if (error.message === 'InvalidId') {
        return res.status(404).send(({ message: 'Id карточки не найден' }));
      }
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Ошибка 400' });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('IncorrectID'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (error.message === 'IncorrectID') {
        return res.status(404).send({ message: 'Id карточки не найден' });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('IncorrectID'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (error.message === 'IncorrectID') {
        return res.status(404).send({ message: `Id карточки '${req.params}' не найден!` });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};
