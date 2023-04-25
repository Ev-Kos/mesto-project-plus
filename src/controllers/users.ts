import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
}

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
}