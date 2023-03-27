const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorisationError = require('../errors/AuthorisationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Введенные данные не являются ссылкой',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введенные данные не соответствуют формату почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new AuthorisationError('Пользователь  не найден');
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthorisationError('Пользователь не найден');
      }
      return user;
    });
  });
};
module.exports = mongoose.model('user', userSchema);
