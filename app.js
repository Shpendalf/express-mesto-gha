const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '640e18df5a450aa64ee237f6',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', (req, res) => {
  res.status(404).send({ message: `Данного адреса не существует` });
});

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
