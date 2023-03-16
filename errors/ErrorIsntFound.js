class ErrorIsntFound extends Error {
  constructor(message = 'Результатов по запросу не найдено') {
    super(message);
    this.name = 'ErrorIsntFound';
    this.statusCode = 404;
  }
}
module.exports = ErrorIsntFound;
