class ValidationError extends Error {
  constructor(message = 'Отправлены некорректные данные') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}
module.exports = ValidationError;