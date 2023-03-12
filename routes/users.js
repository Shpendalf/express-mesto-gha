const userRouter = require('express').Router();


const { getUsers, createUser, getUserById, updateAvatar, updateProfile } = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.post('/', createUser);

userRouter.get('/:userId', getUserById);

userRouter.patch('/me', updateProfile);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;