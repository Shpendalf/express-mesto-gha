const ErrorIsntFound = require('../errors/ErrorIsntFound');
const ValidationError = require('../errors/ValidationError');
const OtherError = require('../errors/OtherError');
// Обработчик ошибок д
module.exports.ErrorHandler = (error, res, { foundMsg, valMsg, OtherMsg }) => {
  if (error.name === 'NotFoundError') {
    const customError = new ErrorIsntFound(foundMsg);
    res.status(customError.statusCode).send({ message: customError.message });
  } else if (error.name === 'ValidationError' || error.name === 'CastError') {
    const customError = new ValidationError(valMsg);
    res.status(customError.statusCode).send({ message: customError.message });
  } else {
    const customError = new OtherError(OtherMsg);
    res.status(customError.statusCode).send({ message: customError.message });
  }
};
