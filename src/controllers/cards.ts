import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IRequestCustom } from '../types/user';
import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenAction from '../errors/ForbiddenAction';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new BadRequest('Карточки не найдены');
      }
      res.status(200).send(cards);
    })
    .catch((err) => next(err));
};

export const createCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => next(err));
};

export const deleteCardById = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return Card.findByIdAndDelete(id)
    .then((card) => {
      if (req.user?._id !== card?.owner.toString()) {
        throw new ForbiddenAction('Нельзя удалить чужую карточку');
      }
      res.status(200).send(card);
    })
    .catch((err) => next(err));
};

export const likeCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не валидный id карточки');
      }
      res.status(200).send(card?.likes);
    })
    .catch((err) => next(err));
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не валидный id карточки');
      }
      res.send(card?.likes);
    })
    .catch((err) => next(err));
};
