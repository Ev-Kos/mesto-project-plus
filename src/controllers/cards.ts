import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IRequestCustom } from '../types/user';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
    return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
}

export const createCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user?._id})
    .then((card) => res.status(200).send(card))
    .catch((err) => next(err));
}

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return Card.findByIdAndDelete(id)
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};