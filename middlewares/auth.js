const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorisationError('Вы не авторизованы');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-bad-key');
  } catch (error) {
    next(new AuthorisationError('Вы не авторизованы'));
    return
  }
  req.user = payload;
  next();
};
