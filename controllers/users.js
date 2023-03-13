const Users = require('../models/user');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Запрашиваемый пользователь не найден' }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы не верные пользовательские данные' });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => { res.status(201).send(user); })
    .catch((error) => {
      console.log(res);
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы не верные пользовательские данные' });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })

    .orFail(new Error('InvalidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные профиля' });
      }
      if (err.message === 'InvalidId') {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true  })
    .orFail(new Error('InvalidLink'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'InvalidLink') {
        return res.status(400).send({ message: 'Переданы некорректные данные профиля' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    });
};
