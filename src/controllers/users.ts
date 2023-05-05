import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IRequestCustom } from '../types/user';
import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';
import RepeatEmail from '../errors/RepeatEmail';
import {
  incorrectDataMessage,
  registrationSuccesMessage,
  repeatEmailMessage,
  userNotFoundMessage,
} from '../constants/constants';
import { SECRET_KEY } from '../../config';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundMessage);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new NotFoundError(userNotFoundMessage));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(incorrectDataMessage));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        message: registrationSuccesMessage,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(incorrectDataMessage));
      } else if (err.code === 11000) {
        next(new RepeatEmail(repeatEmailMessage));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundMessage);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(incorrectDataMessage));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new NotFoundError(userNotFoundMessage));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundMessage);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(incorrectDataMessage));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new NotFoundError(userNotFoundMessage));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(err));
};

export const getCurrentUser = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundMessage);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new NotFoundError(userNotFoundMessage));
      } next(err);
    });
};
