import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { createCardValidation, cardValidation } from '../middleware/validation';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:id', cardValidation, deleteCardById);
cardRouter.put('/:cardId/likes', cardValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardValidation, dislikeCard);

export default cardRouter;
