import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IRequestCustom } from '../types/user';
import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';
import RepeatEmail from '../errors/RepeatEmail';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new BadRequest('Пользователи не найдены');
      }
      res.status(200).send(users);
    })
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    });
  })
    .then(async (user) => {
      const detected = await User.findOne({ email: req.body.email }).exec();
      if (detected) {
        return next(new RepeatEmail('Пользователь с такой почтой уже зарегистрирован'));
      }
      res.status(200).send({ message: 'Регистрация прошла успешно', user });
    })
    .catch((err) => next(err));
};

export const updateUser = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

export const updateAvatar = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(err));
};

export const getCurrentUser = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};
