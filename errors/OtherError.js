class OtherError extends Error {
  constructor(message = 'Неизвестная ошибка') {
    super(message);
    this.name = 'OtherError';
    this.statusCode = 500;
  }
}

module.exports = OtherError;
