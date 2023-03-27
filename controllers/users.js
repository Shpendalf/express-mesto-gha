const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ErrorIsntFound = require('../errors/ErrorIsntFound');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');
// const { ErrorHandler } = require('../middlewares/ErrorHandler');
// const AuthorisationError = require('../errors/AuthorisationError');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.send(user)).catch(next);
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(new ErrorIsntFound('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    }).catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationError('Переданы не верные пользовательские данные'));
      } else {
        next(error);
      }
    });
  // .catch((error) => {
  //   ErrorHandler(
  //     error,
  //     res,
  //     {
  //       foundMsg: 'Пользователь не найден',
  //       valMsg: 'Переданы не верные пользовательские данные',
  //     },
  //   );
  // });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(
          new DuplicateError(
            'Нельзя повторно использовать email',
          ),
        );
      } else if (error.name === 'ValidationError') { next(new ValidationError(error.message)); } else next(error);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(
      new ErrorIsntFound('Пользователь не найден'),
    )
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') { next(new ValidationError(error.message)); } else next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(
      new ErrorIsntFound('Пользователь не найден'),
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new ValidationError(err.message)); } else next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-bad-key',
        { expiresIn: '3d' },
      );
      res.cookie('jwt', token, {
        maxAge: 360000 * 24 * 3,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Пользователь авторизован' });
    })
    .catch(next);
};
module.exports.getOwner = (req, res, next) => {
  const userId = req.user._id;

  Users.findById(userId)
    .orFail(
      new ErrorIsntFound('Пользователь не найден'),
    )
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
