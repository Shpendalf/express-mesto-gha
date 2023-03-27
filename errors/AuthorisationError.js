class AuthorisationError extends Error {
  constructor(message = 'Ошибка Аутентификации') {
    super(message);
    this.name = 'AuthorisationError';
    this.statusCode = 401;
  }
}
module.exports = AuthorisationError;
