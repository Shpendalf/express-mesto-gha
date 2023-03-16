const Users = require('../models/user');
const ErrorIsntFound = require('../errors/ErrorIsntFound');
const ValidationError = require('../errors/ValidationError');
const { ErrorHandler } = require('../middlewares/ErrorHandler');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user)).catch((error) => {
      ErrorHandler(
        error,
        res,
      );
    });
};

module.exports.getUserByUserId = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .then((user) => {
      if (user === null) throw new ErrorIsntFound();
      else res.send(user);
    })
    .catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          foundMsg: 'Пользователь не найден',
          valMsg: 'Переданы не верные пользовательские данные',
        },
      );
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => { res.send(user); })
    .catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          valMsg: 'Переданы не верные пользовательские данные',
        },
      );
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!name || !about) throw new ValidationError();
      else if (!user) throw new ErrorIsntFound();
      else res.send(user);
    })
    .catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          foundMsg: 'Пользователь не найден',
          valMsg: 'Переданы не верные пользовательские данные',
        },
      );
    });
};

module.exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!avatar) throw new ValidationError();
      else if (!user) throw new ErrorIsntFound();
      else res.send(user);
    })
    .catch((error) => {
      ErrorHandler(
        error,
        res,
        {
          foundMsg: 'Пользователь не найден',
          valMsg: 'Переданы не верные пользовательские данные',
        },
      );
    });
};
