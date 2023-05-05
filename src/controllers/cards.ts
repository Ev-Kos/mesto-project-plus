import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { IRequestCustom } from '../types/user';
import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenAction from '../errors/ForbiddenAction';
import {
  incorrectDataMessage,
  forbiddenActionMessage,
  cardNotFoundMessage,
  deleteCardMessage,
} from '../constants/constants';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

export const createCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const createdAt = new Date();

  return Card.create({
    name, link, owner: req.user, createdAt,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(incorrectDataMessage));
      } else {
        next(err);
      }
    });
};

export const deleteCardById = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return Card.findById(id)
    .then((card) => {
      if (req.user?._id !== card?.owner.toString()) {
        throw new ForbiddenAction(forbiddenActionMessage);
      }
      card?.delete();
      return res.status(200).send({ message: deleteCardMessage, card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest(cardNotFoundMessage));
      } next(err);
    });
};

export const likeCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFoundMessage);
      }
      res.status(200).send(card?.likes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(incorrectDataMessage));
      } if (err instanceof mongoose.Error.CastError) {
        return next(new NotFoundError(cardNotFoundMessage));
      } next(err);
    });
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFoundMessage);
      }
      res.send(card?.likes);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(incorrectDataMessage));
      } if (err instanceof mongoose.Error.CastError) {
        return next(new NotFoundError(cardNotFoundMessage));
      } next(err);
    });
};
