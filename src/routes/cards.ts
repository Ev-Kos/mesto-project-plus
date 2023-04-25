import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:id', deleteCardById);

export default cardRouter;