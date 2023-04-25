import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { IRequestCustom } from '../types/user';
import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';

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
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
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
