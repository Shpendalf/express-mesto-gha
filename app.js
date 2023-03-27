const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');
const ErrorIsntFound = require('./errors/ErrorIsntFound');
const {
  linkMask,
  emailMask,
} = require('./middlewares/masks');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(emailMask),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(emailMask),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(linkMask),
    }),
  }),
  createUser,
);
// app.all('*', (req, res) => {
//   next();
// });
app.use('/', () => {
  throw new ErrorIsntFound('Данного адреса не сущесттвует');
});
app.use(errors({ message: 'Ошибка в данных' }));
app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Неизвестная ошибка' : message });
  next();
});

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
