class OtherError extends Error {
  constructor(message = 'Отправлены некорректные данные') {
    super(message);
    this.name = 'OtherError';
    this.statusCode = 500;
  }
}
module.exports = OtherError;