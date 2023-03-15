const Users = require('../models/user');
const ErrorIsntFound = require('../errors/ErrorIsntFound');
const OtherError = require('../errors/OtherError');
const ValidationError = require('../errors/ValidationError');
const { ErrorHandler } = require('../middlewares/ErrorHandler');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch((error) => { ErrorHandler(error, res); });
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new ErrorIsntFound();
      else return res.status(200).send(user);
    })
    .catch((error) => {
      ErrorHandler(error, res, {
        valMessage: 'Переданы некорректные данные профиля',
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => { res.status(201).send(user); })
    .catch((error) => {
      ErrorHandler(error, res, {
        valMessage: 'Передан неверный формат ID',
        isntFoundMessage: 'Пользователь не найден',

      });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true, upsert: false })
    .then((user) => {
      if (!name || !about) throw new ValidationError();
      else if (!user) throw new ErrorIsntFound();
      else res.status(200).send(user);
    })
    .catch((err) => {
      ErrorHandler(err, res, {
        valMessage: 'Переданы неверные данные пользователя',
        isntFoundMessage: 'Пользователь не найден',
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true, upsert: false })
    .then((user) => {
      if (!avatar) throw new ValidationError();
      else if (!user) throw new ErrorIsntFound();
      else res.status(200).send(user);
    })
    .catch((err) => {
      ErrorHandler(err, res, {
        isntFoundMessage: 'Пользователь не найден',
        valMessage: 'Переданы неверные данные пользователя',
      });
    });
};
