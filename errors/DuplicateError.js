class DuplicateError extends Error {
  constructor(message = 'Нельзя создавать пользователей с одинаковой почтой') {
    super(message);
    this.name = 'DuplicateError';
    this.statusCode = 409;
  }
}
module.exports = DuplicateError;
