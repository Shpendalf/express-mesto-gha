const ErrorIsntFound = require ('../errors/ErrorIsntFound');
const OtherError = require ('../errors/OtherError');
const ValidationError = require('../errors/ValidationError');

module.exports.ErrorHandler = (error, res, {ErrorIsntFound, OtherError, ValidationError})=>{
  if (error.name === "ValidationError"){
    const customError = new ValidationError(valMessage);
    res.status(customError.statusCode).send({message: customError.message})
  } else if ((error.name === "ErrorIsntFound")){
    const customError = new ErrorIsntFound(isntFoundMessage);
    res.status(customError.statusCode).send({message: customError.message})
  }
   else if ((error.name === "OtherError")){
    const customError = new OtherError(otherMessage);
    res.status(customError.statusCode).send({message: customError.message})
   }
}